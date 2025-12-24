// Deno imports - these work in Supabase Edge Functions environment
// @ts-ignore - TypeScript doesn't understand Deno imports locally
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Expose-Headers': 'Content-Disposition',
};

const DEBUG = Deno.env.get("DEBUG_INVOICES") === "true";

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

// Format YYYY-MM-DD date string without timezone issues
function formatDateYMD(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}`;
}

// Simple text wrapping for PDF
function wrapText(text: string, maxWidth: number): string[] {
  if (text.length <= maxWidth) return [text];

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY');
    }

    // Create Supabase client with user JWT
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      if (DEBUG) console.log('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin via profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      if (DEBUG) console.log('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found. Please contact an administrator.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['admin', 'finance_admin'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - admin or finance_admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User is authenticated and authorized, proceed with invoice generation
    const { monthStart, schoolSystem, schoolName }: InvoiceRequest = await req.json();

    // Validate request payload
    if (!monthStart || !schoolSystem || !schoolName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: monthStart, schoolSystem, schoolName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Now use service role for data access (after auth check)
    const supabaseServiceRole = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get bookings for this month and school
    const inputDate = new Date(monthStart + 'T00:00:00');
    const year = inputDate.getFullYear();
    const monthIndex = inputDate.getMonth(); // 0-indexed

    // Get first day of the month
    const monthStartDate = new Date(year, monthIndex, 1);
    // Get last day of the month
    const monthEndDate = new Date(year, monthIndex + 1, 0);

    // Format dates as YYYY-MM-DD
    const startDateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    const endDateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(monthEndDate.getDate()).padStart(2, '0')}`;

    if (DEBUG) {
      console.log('Query parameters:', {
        monthStart,
        schoolSystem,
        schoolName,
        startDateStr,
        endDateStr
      });
    }

    // Query bookings
    const { data: bookings, error } = await supabaseServiceRole
      .from('confirmed_bookings')
      .select('*')
      .eq('school_system', schoolSystem)
      .eq('school_name', schoolName)
      .gte('booking_date', startDateStr)
      .lte('booking_date', endDateStr)
      .in('status', ['confirmed', 'completed'])
      .order('booking_date', { ascending: true });

    if (DEBUG) {
      console.log('Bookings found:', bookings?.length || 0);
    }

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No bookings found for this school and month',
          details: `No confirmed/completed bookings for ${schoolName} (${schoolSystem}) in ${startDateStr} to ${endDateStr}`
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate totals with consistent minutes default
    let totalCost = 0;
    let totalMinutes = 0;

    for (const booking of bookings) {
      const minutes = booking.total_minutes && booking.total_minutes > 0 ? booking.total_minutes : 60;
      const cost = parseFloat(booking.total_cost) || 0;
      totalMinutes += minutes;
      totalCost += cost;
    }

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

    // Bill To with wrapping for long school names
    page.drawText('Bill To:', {
      x: 50,
      y,
      size: 12,
      font: helveticaBold,
    });
    y -= 18;
    const schoolNameLines = wrapText(schoolName, 60);
    for (const line of schoolNameLines) {
      page.drawText(line, {
        x: 50,
        y,
        size: 11,
        font: helveticaFont,
      });
      y -= 18;
    }
    y -= 22;

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

      // Use consistent minutes default
      const minutes = booking.total_minutes && booking.total_minutes > 0 ? booking.total_minutes : 60;
      const cost = parseFloat(booking.total_cost) || 0;
      const dateStr = formatDateYMD(booking.booking_date);
      const teacherName = `${booking.teacher_first_name || ''} ${booking.teacher_last_name || ''}`.trim();
      const timeStr = `${booking.booking_time_start || ''} - ${booking.booking_time_end || ''}`;

      currentPage.drawText(dateStr, { x: 50, y, size: 10, font: helveticaFont });
      currentPage.drawText(teacherName.substring(0, 20), { x: 130, y, size: 10, font: helveticaFont });
      currentPage.drawText(timeStr.substring(0, 18), { x: 280, y, size: 10, font: helveticaFont });
      currentPage.drawText(minutes.toString(), { x: 380, y, size: 10, font: helveticaFont });
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

    // Generate PDF bytes and return as application/pdf
    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="INVOICE_${invoiceNumber}.pdf"`,
      },
    });

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

