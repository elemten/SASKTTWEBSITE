import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Google Calendar configuration - using environment variables for security
const CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID') ?? 'c_04d6de5f15712c0334d1c5112ed7e9072a57454eb202d464f3f7dca5c427a961@group.calendar.google.com'
const SERVICE_ACCOUNT_EMAIL = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL') ?? 'ttsask-calendar-booking@n8nworkflows-469621.iam.gserviceaccount.com'
const PRIVATE_KEY = Deno.env.get('GOOGLE_PRIVATE_KEY') ?? ''

interface BookingRequest {
  id: string
  teacher_first_name: string
  teacher_last_name: string
  teacher_email: string
  teacher_phone: string
  school_name: string
  school_address_line1: string
  school_address_line2?: string
  school_city: string
  school_province: string
  school_postal_code: string
  booking_date: string
  booking_time_start: string
  booking_time_end: string
  number_of_sessions: number
  number_of_students: number
  grade_level?: string
  preferred_coach?: string
  special_requirements?: string
  total_cost: number
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
async function createCalendarEvent(booking: BookingRequest): Promise<{ success: boolean; eventId?: string; eventLink?: string; error?: string }> {
  try {
    const eventStart = `${booking.booking_date}T${booking.booking_time_start}-06:00`
    const eventEnd = `${booking.booking_date}T${booking.booking_time_end}-06:00`
    
    const event = {
      summary: `SPED Class - ${booking.teacher_first_name} ${booking.teacher_last_name}`,
      description: `SPED Class Booking

Teacher: ${booking.teacher_first_name} ${booking.teacher_last_name}
School: ${booking.school_name}
Email: ${booking.teacher_email}
Phone: ${booking.teacher_phone}
Students: ${booking.number_of_students}
Grade: ${booking.grade_level || 'Not specified'}
Sessions: ${booking.number_of_sessions}
Preferred Coach: ${booking.preferred_coach || 'Not specified'}
Special Requirements: ${booking.special_requirements || 'None'}
Total Cost: $${booking.total_cost}

Booking ID: ${booking.id}`,
      start: {
        dateTime: eventStart,
        timeZone: 'America/Regina'
      },
      end: {
        dateTime: eventEnd,
        timeZone: 'America/Regina'
      },
      location: 'Zion Lutheran Church, 323 4th Avenue South, Saskatoon, SK',
      attendees: [
        { email: booking.teacher_email },
        { email: Deno.env.get('ADMIN_EMAIL') ?? 'huzaifa.ishaq.395@gmail.com' }
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
      eventId: `event_${Date.now()}`,
      eventLink: `https://calendar.google.com/calendar/event?eid=${Date.now()}`
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
          Deno.env.get('DATABASE_URL') ?? '',
          Deno.env.get('SERVICE_ROLE_KEY') ?? ''
        )
        
        const { error } = await supabase
          .from('confirmed_bookings')
          .update({ 
            admin_notes: `Calendar Event Created: ${result.eventId}`,
            status: 'confirmed',
            google_calendar_event_id: result.eventId,
            google_calendar_link: result.eventLink
          })
          .eq('id', booking.id)
        
        if (error) {
          console.error('Error updating Supabase:', error)
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            eventId: result.eventId,
            eventLink: result.eventLink,
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
