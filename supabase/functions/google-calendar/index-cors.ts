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
  number_of_students: number
  grade_level?: string
  preferred_coach?: string
  special_requirements?: string
  total_cost: number
}

interface TimeSlot {
  time: string
  display: string
  available: boolean
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Generate JWT for Google Calendar API (placeholder implementation)
async function generateJWT(): Promise<string> {
  // This is a placeholder - in a real implementation, you would:
  // 1. Create a JWT with the service account credentials
  // 2. Include proper claims and expiration
  // 3. Sign it with the private key
  
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }
  
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600 // 1 hour
  }
  
  // For now, return a placeholder token
  // In production, you would properly sign this JWT
  return 'placeholder-jwt-token'
}

// Get available time slots for a specific date
async function getAvailableSlots(date: string): Promise<TimeSlot[]> {
  try {
    // For now, return mock data
    // In production, you would:
    // 1. Generate JWT
    // 2. Get access token from Google
    // 3. Query Google Calendar API for existing events
    // 4. Calculate available slots based on existing bookings
    
    const mockSlots: TimeSlot[] = [
      { time: '09:00', display: '9:00 AM - 10:00 AM', available: true },
      { time: '10:00', display: '10:00 AM - 11:00 AM', available: true },
      { time: '11:00', display: '11:00 AM - 12:00 PM', available: false },
      { time: '13:00', display: '1:00 PM - 2:00 PM', available: true },
      { time: '14:00', display: '2:00 PM - 3:00 PM', available: true }
    ]
    
    return mockSlots
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return []
  }
}

// Create a calendar event
async function createCalendarEvent(booking: BookingRequest): Promise<{ success: boolean; eventId?: string; eventLink?: string; error?: string }> {
  try {
    // For now, simulate event creation
    // In production, you would:
    // 1. Generate JWT
    // 2. Get access token from Google
    // 3. Create event in Google Calendar
    // 4. Return event ID and link
    
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const eventLink = `https://calendar.google.com/calendar/event?eid=${eventId}`
    
    console.log('Simulated calendar event creation:', {
      title: `SPED Session - ${booking.teacher_first_name} ${booking.teacher_last_name}`,
      start: `${booking.booking_date}T${booking.booking_time_start}:00`,
      end: `${booking.booking_date}T${booking.booking_time_end}:00`,
      description: `SPED Table Tennis Session\n\nTeacher: ${booking.teacher_first_name} ${booking.teacher_last_name}\nSchool: ${booking.school_name}\nStudents: ${booking.number_of_students}\nGrade: ${booking.grade_level || 'Not specified'}\nSpecial Requirements: ${booking.special_requirements || 'None'}`
    })
    
    return {
      success: true,
      eventId,
      eventLink
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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { action, date, booking } = await req.json()
    
    if (action === 'getSlots') {
      // Get available slots for a specific date
      if (!date) {
        return new Response(
          JSON.stringify({ error: 'Date is required' }),
          { 
            status: 400, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            } 
          }
        )
      }
      
      const slots = await getAvailableSlots(date)
      return new Response(
        JSON.stringify({ success: true, slots }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
      
    } else if (action === 'bookSlot') {
      // Book a slot and create calendar event
      if (!booking) {
        return new Response(
          JSON.stringify({ error: 'Booking data is required' }),
          { 
            status: 400, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            } 
          }
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
            message: 'Calendar event created successfully'
          }),
          { 
            status: 200, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            } 
          }
        )
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: result.error 
          }),
          { 
            status: 500, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            } 
          }
        )
      }
      
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "getSlots" or "bookSlot"' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }
    
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  }
})
