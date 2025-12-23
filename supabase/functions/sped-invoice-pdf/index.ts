// Deno imports - these work in Supabase Edge Functions environment
// @ts-ignore - TypeScript doesn't understand Deno imports locally
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceRequest {
  monthStart: string; // YYYY-MM-DD
  schoolSystem: string;
  schoolName: string;
}

// Slug function (same as client)
function createInvoiceNumber(year: number, month: number, schoolSystem: string, schoolName: string): string {
  const sysCode = schoolSystem === 'Catholic' ? 'CATH' : schoolSystem === 'Saskatoon Public' ? 'PUB' : 'OTHER';
  const schoolSlug = schoolName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${year}-${String(month).padStart(2, '0')}-${sysCode}-${schoolSlug}`;
}

function formatMonthYear(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { monthStart, schoolSystem, schoolName }: InvoiceRequest = await req.json();

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get bookings for this month and school
    // monthStart should be the first day of the month (YYYY-MM-01)
    // But handle case where it might be any day in the month
    const inputDate = new Date(monthStart + 'T00:00:00');
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth(); // 0-indexed
    
    // Get first day of the month
    const monthStartDate = new Date(year, month, 1);
    // Get last day of the month
    const monthEndDate = new Date(year, month + 1, 0);
    
    // Format dates as YYYY-MM-DD
    const startDateStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(monthEndDate.getDate()).padStart(2, '0')}`;
    
    console.log('Query parameters:', {
      monthStart,
      schoolSystem,
      schoolName,
      startDateStr,
      endDateStr
    });
    
    // First, let's check what bookings exist for debugging
    const { data: allBookings, error: debugError } = await supabase
      .from('confirmed_bookings')
      .select('school_name, school_system, booking_date, status')
      .gte('booking_date', startDateStr)
      .lte('booking_date', endDateStr)
      .in('status', ['confirmed', 'completed'])
      .limit(100);
    
    console.log('All bookings in date range:', allBookings);
    console.log('Unique school names:', [...new Set(allBookings?.map(b => b.school_name) || [])]);
    console.log('Unique school systems:', [...new Set(allBookings?.map(b => b.school_system) || [])]);
    
    // Now query with exact match
    const { data: bookings, error } = await supabase
      .from('confirmed_bookings')
      .select('*')
      .eq('school_system', schoolSystem)
      .eq('school_name', schoolName)
      .gte('booking_date', startDateStr)
      .lte('booking_date', endDateStr)
      .in('status', ['confirmed', 'completed'])
      .order('booking_date', { ascending: true });

    console.log('Filtered bookings count:', bookings?.length || 0);
    
    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    if (!bookings || bookings.length === 0) {
      // Return more helpful error message
      const matchingSchools = allBookings?.filter(b => 
        b.school_name?.toLowerCase().includes(schoolName.toLowerCase()) ||
        schoolName.toLowerCase().includes(b.school_name?.toLowerCase() || '')
      ).map(b => b.school_name) || [];
      
      return new Response(
        JSON.stringify({ 
          error: 'No bookings found for this school and month',
          debug: {
            searchedSchool: schoolName,
            searchedSystem: schoolSystem,
            dateRange: `${startDateStr} to ${endDateStr}`,
            totalBookingsInRange: allBookings?.length || 0,
            matchingSchools: [...new Set(matchingSchools)]
          }
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate totals
    const totalCost = bookings.reduce((sum: number, b: any) => sum + (parseFloat(b.total_cost) || 0), 0);
    const totalMinutes = bookings.reduce((sum: number, b: any) => sum + (b.total_minutes || 0), 0);

    // Create invoice number
    const invoiceNumber = createInvoiceNumber(
      monthStartDate.getFullYear(),
      monthStartDate.getMonth() + 1,
      schoolSystem,
      schoolName
    );

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // US Letter size
    const { width, height } = page.getSize();
    
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 60;

    // Header
    page.drawText('Table Tennis Saskatchewan', {
      x: 50,
      y,
      size: 24,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    y -= 22;
    page.drawText('info@ttsask.ca', {
      x: 50,
      y,
      size: 10,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= 50;

    // Invoice details
    page.drawText('INVOICE', {
      x: 50,
      y,
      size: 20,
      font: helveticaBold,
    });
    y -= 30;
    page.drawText(`Invoice Number: ${invoiceNumber}`, {
      x: 50,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= 18;
    const today = new Date();
    page.drawText(`Invoice Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
      x: 50,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= 18;
    page.drawText(`Invoice Period: ${formatMonthYear(monthStartDate)}`, {
      x: 50,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= 40;

    // Bill To
    page.drawText('Bill To:', {
      x: 50,
      y,
      size: 12,
      font: helveticaBold,
    });
    y -= 18;
    page.drawText(schoolName, {
      x: 50,
      y,
      size: 11,
      font: helveticaFont,
    });
    y -= 40;

    // Line items header
    const tableTop = y;
    page.drawText('Date', { x: 50, y, size: 11, font: helveticaBold });
    page.drawText('Teacher', { x: 130, y, size: 11, font: helveticaBold });
    page.drawText('Time', { x: 280, y, size: 11, font: helveticaBold });
    page.drawText('Minutes', { x: 380, y, size: 11, font: helveticaBold });
    page.drawText('Cost', { x: 480, y, size: 11, font: helveticaBold, color: rgb(0, 0, 0) });
    y -= 25;
    page.drawLine({
      start: { x: 50, y },
      end: { x: 550, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 15;

    // Line items
    let currentPage = page;
    for (const booking of bookings) {
      if (y < 180) {
        // New page if needed
        currentPage = pdfDoc.addPage([612, 792]);
        y = currentPage.getSize().height - 60;
        // Redraw header on new page
        currentPage.drawText('Date', { x: 50, y, size: 11, font: helveticaBold });
        currentPage.drawText('Teacher', { x: 130, y, size: 11, font: helveticaBold });
        currentPage.drawText('Time', { x: 280, y, size: 11, font: helveticaBold });
        currentPage.drawText('Minutes', { x: 380, y, size: 11, font: helveticaBold });
        currentPage.drawText('Cost', { x: 480, y, size: 11, font: helveticaBold });
        y -= 25;
        currentPage.drawLine({
          start: { x: 50, y },
          end: { x: 550, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        y -= 15;
      }

      const bookingDate = new Date(booking.booking_date);
      const dateStr = formatDate(bookingDate);
      const teacherName = `${booking.teacher_first_name || ''} ${booking.teacher_last_name || ''}`.trim();
      const timeStr = `${booking.booking_time_start || ''} - ${booking.booking_time_end || ''}`;
      const minutes = booking.total_minutes || 0;
      const cost = parseFloat(booking.total_cost) || 0;

      currentPage.drawText(dateStr, { x: 50, y, size: 10, font: helveticaFont });
      currentPage.drawText(teacherName.substring(0, 20), { x: 130, y, size: 10, font: helveticaFont });
      currentPage.drawText(timeStr.substring(0, 18), { x: 280, y, size: 10, font: helveticaFont });
      currentPage.drawText(minutes > 0 ? minutes.toString() : '60', { x: 380, y, size: 10, font: helveticaFont });
      currentPage.drawText(`$${cost.toFixed(2)}`, { x: 480, y, size: 10, font: helveticaFont });
      y -= 18;
    }

    y -= 20;
    currentPage.drawLine({
      start: { x: 50, y },
      end: { x: 550, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 20;

    // Total
    currentPage.drawText('Total:', {
      x: 400,
      y,
      size: 13,
      font: helveticaBold,
    });
    currentPage.drawText(`$${totalCost.toFixed(2)}`, {
      x: 480,
      y,
      size: 13,
      font: helveticaBold,
    });
    y -= 40;

    // Payment instructions
    if (y < 100) {
      // New page if needed for payment instructions
      currentPage = pdfDoc.addPage([612, 792]);
      y = currentPage.getSize().height - 60;
    }
    currentPage.drawText('Payment Instructions:', {
      x: 50,
      y,
      size: 12,
      font: helveticaBold,
    });
    y -= 20;
    const paymentText = `Payment method: E-transfer to info@ttsask.ca (Auto-deposit enabled).\nPlease include invoice number in the message: ${invoiceNumber}`;
    const paymentLines = paymentText.split('\n');
    for (const line of paymentLines) {
      if (y < 80) {
        // New page if needed for payment instructions
        currentPage = pdfDoc.addPage([612, 792]);
        y = currentPage.getSize().height - 60;
      }
      currentPage.drawText(line, {
        x: 50,
        y,
        size: 10,
        font: helveticaFont,
      });
      y -= 18;
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    const base64 = btoa(String.fromCharCode(...pdfBytes));

    return new Response(
      JSON.stringify({ pdf: base64 }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: any) {
    console.error('Error generating invoice:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate invoice',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

