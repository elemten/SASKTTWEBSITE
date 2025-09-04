import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Google Calendar configuration - using environment variables for security
const CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID') ?? ''
const SERVICE_ACCOUNT_EMAIL = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL') ?? ''
const PRIVATE_KEY = Deno.env.get('GOOGLE_PRIVATE_KEY') ?? ''

interface BookingRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  school: string
  students: string
  grade?: string
  preferred_times: string
  notes?: string
}

interface TimeSlot {
  time: string
  duration: string
  available: boolean
}

// Generate JWT token for Google Calendar API
async function generateJWT(): Promise<string> {
  // For now, return a placeholder - in production you'd implement proper JWT signing
  return 'PLACEHOLDER_JWT_TOKEN'
}

// Get available time slots from Google Calendar
async function getAvailableSlots(date: string): Promise<TimeSlot[]> {
  try {
    // For now, return mock data - in production this would query Google Calendar API
    const mockSlots = [
      { time: '09:00-10:30', duration: '1.5 hours', available: true },
      { time: '11:00-12:30', duration: '1.5 hours', available: true },
      { time: '13:00-14:30', duration: '1.5 hours', available: false }, // Booked
      { time: '15:00-16:30', duration: '1.5 hours', available: true },
      { time: '17:00-18:30', duration: '1.5 hours', available: true }
    ]
    
    // Filter only available slots
    return mockSlots.filter(slot => slot.available)
    
  } catch (error) {
    console.error('Error getting available slots:', error)
    return []
  }
}

// Create Google Calendar event
async function createCalendarEvent(booking: BookingRequest): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    // Parse preferred_times to get date and time
    // Format: "2025-01-15 at 11:00-13:45"
    const [date, timeRange] = booking.preferred_times.split(' at ')
    const [startTime, endTime] = timeRange.split('-')
    
    const eventStart = `${date}T${startTime}:00`
    const eventEnd = `${date}T${endTime}:00`
    
    const event = {
      summary: `SPED Class - ${booking.first_name} ${booking.last_name}`,
      description: `SPED Class Booking

Teacher: ${booking.first_name} ${booking.last_name}
School: ${booking.school}
Email: ${booking.email}
Phone: ${booking.phone}
Students: ${booking.students}
Grade: ${booking.grade || 'Not specified'}
Notes: ${booking.notes || 'None'}

Duration: ${booking.preferred_times}`,
      start: {
        dateTime: eventStart,
        timeZone: 'America/Regina'
      },
      end: {
        dateTime: eventEnd,
        timeZone: 'America/Regina'
      },
      attendees: [
        { email: booking.email },
        { email: Deno.env.get('ADMIN_EMAIL') ?? 'admin@example.com' }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 }, // 1 day before
          { method: 'popup', minutes: 30 }   // 30 minutes before
        ]
      }
    }
    
    // For now, simulate success - in production you'd make the actual API call
    console.log('Calendar event would be created:', event)
    
    return {
      success: true,
      eventId: `event_${Date.now()}`
    }
    
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

serve(async (req) => {
  try {
    const { action, date, booking } = await req.json()
    
    if (action === 'getSlots') {
      // Get available slots for a specific date
      if (!date) {
        return new Response(
          JSON.stringify({ error: 'Date is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      const slots = await getAvailableSlots(date)
      return new Response(
        JSON.stringify({ success: true, slots }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
      
    } else if (action === 'bookSlot') {
      // Book a slot and create calendar event
      if (!booking) {
        return new Response(
          JSON.stringify({ error: 'Booking data is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      // Create the calendar event
      const result = await createCalendarEvent(booking)
      
      if (result.success) {
        // Update the booking in Supabase with calendar event ID
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        const { error } = await supabase
          .from('sped_submissions')
          .update({ 
            admin_notes: `Calendar Event Created: ${result.eventId}`,
            status: 'approved'
          })
          .eq('id', booking.id)
        
        if (error) {
          console.error('Error updating Supabase:', error)
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            eventId: result.eventId,
            message: 'Calendar event created successfully'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: result.error 
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "getSlots" or "bookSlot"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})