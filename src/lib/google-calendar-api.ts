// Google Calendar API integration for SPED bookings
import { createClient } from '@supabase/supabase-js'

// Google Calendar configuration - these should be set as environment variables
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'c_04d6de5f15712c0334d1c5112ed7e9072a57454eb202d464f3f7dca5c427a961@group.calendar.google.com'
const SERVICE_ACCOUNT_EMAIL = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL || 'ttsask-calendar-booking@n8nworkflows-469621.iam.gserviceaccount.com'
const PRIVATE_KEY = import.meta.env.VITE_GOOGLE_PRIVATE_KEY || ''

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

interface BookingData {
  bookingId: string;
  teacher_first_name: string;
  teacher_last_name: string;
  teacher_email: string;
  teacher_phone: string;
  school_name: string;
  booking_date: string;
  booking_time_start: string;
  booking_time_end: string;
  number_of_sessions: number;
  number_of_students: number;
  grade_level?: string;
  preferred_coach?: string;
  special_requirements?: string;
}

// Generate JWT token for Google Calendar API
async function generateJWT(): Promise<string> {
  if (!PRIVATE_KEY) {
    throw new Error('Google Private Key not configured')
  }

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

  // For now, we'll use a simplified approach
  // In a real implementation, you'd use a JWT library to sign the token
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  
  // This is a placeholder - you'd need to implement actual RSA signing
  const signature = 'PLACEHOLDER_SIGNATURE'
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Get available time slots for a specific date
export async function getAvailableTimeSlots(date: string): Promise<TimeSlot[]> {
  try {
    // Define the available time slots based on day of week
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    let availableSlots: TimeSlot[] = []
    
    if (dayOfWeek === 1) { // Monday
      availableSlots = [
        { time: '11:00', display: '11:00 AM - 12:00 PM', available: true }
      ]
    } else if (dayOfWeek >= 2 && dayOfWeek <= 4) { // Tuesday-Thursday
      availableSlots = [
        { time: '11:00', display: '11:00 AM - 12:00 PM', available: true },
        { time: '12:00', display: '12:00 PM - 1:00 PM', available: true },
        { time: '13:00', display: '1:00 PM - 2:00 PM', available: true }
      ]
    } else if (dayOfWeek === 5) { // Friday
      availableSlots = [
        { time: '11:00', display: '11:00 AM - 12:00 PM', available: true },
        { time: '12:00', display: '12:00 PM - 1:00 PM', available: true },
        { time: '13:00', display: '1:00 PM - 2:00 PM', available: true },
        { time: '14:00', display: '2:00 PM - 3:00 PM', available: true },
        { time: '15:00', display: '3:00 PM - 4:00 PM', available: true }
      ]
    }

    // Check Google Calendar for existing events on this date
    const jwt = await generateJWT()
    const startTime = `${date}T00:00:00-06:00` // Saskatchewan timezone
    const endTime = `${date}T23:59:59-06:00`
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?` +
      `timeMin=${startTime}&timeMax=${endTime}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      const existingEvents = data.items || []
      
      // Mark slots as unavailable if there are existing events
      availableSlots = availableSlots.map(slot => {
        const slotStart = `${date}T${slot.time}:00-06:00`
        const slotEnd = `${date}T${(parseInt(slot.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00:00-06:00`
        
        const isBooked = existingEvents.some((event: any) => {
          const eventStart = event.start?.dateTime || event.start?.date
          const eventEnd = event.end?.dateTime || event.end?.date
          return (eventStart <= slotEnd && eventEnd >= slotStart)
        })
        
        return {
          ...slot,
          available: !isBooked
        }
      })
    }

    return availableSlots
    
  } catch (error) {
    console.error('Error fetching available time slots:', error)
    // Return default slots if API fails
    return getDefaultTimeSlots(date)
  }
}

// Get default time slots (fallback)
function getDefaultTimeSlots(date: string): TimeSlot[] {
  const dateObj = new Date(date)
  const dayOfWeek = dateObj.getDay()
  
  if (dayOfWeek === 1) { // Monday
    return [{ time: '11:00', display: '11:00 AM - 12:00 PM', available: true }]
  } else if (dayOfWeek >= 2 && dayOfWeek <= 4) { // Tuesday-Thursday
    return [
      { time: '11:00', display: '11:00 AM - 12:00 PM', available: true },
      { time: '12:00', display: '12:00 PM - 1:00 PM', available: true },
      { time: '13:00', display: '1:00 PM - 2:00 PM', available: true }
    ]
  } else if (dayOfWeek === 5) { // Friday
    return [
      { time: '11:00', display: '11:00 AM - 12:00 PM', available: true },
      { time: '12:00', display: '12:00 PM - 1:00 PM', available: true },
      { time: '13:00', display: '1:00 PM - 2:00 PM', available: true },
      { time: '14:00', display: '2:00 PM - 3:00 PM', available: true },
      { time: '15:00', display: '3:00 PM - 4:00 PM', available: true }
    ]
  }
  
  return []
}

// Create a Google Calendar event
export async function createCalendarEvent(bookingData: BookingData): Promise<{ eventId: string; eventLink: string }> {
  try {
    const jwt = await generateJWT()
    
    const eventStart = `${bookingData.booking_date}T${bookingData.booking_time_start}-06:00`
    const eventEnd = `${bookingData.booking_date}T${bookingData.booking_time_end}-06:00`
    
    const event = {
      summary: `SPED Class - ${bookingData.teacher_first_name} ${bookingData.teacher_last_name}`,
      description: `SPED Class Booking

Teacher: ${bookingData.teacher_first_name} ${bookingData.teacher_last_name}
School: ${bookingData.school_name}
Email: ${bookingData.teacher_email}
Phone: ${bookingData.teacher_phone}
Students: ${bookingData.number_of_students}
Grade: ${bookingData.grade_level || 'Not specified'}
Sessions: ${bookingData.number_of_sessions}
Preferred Coach: ${bookingData.preferred_coach || 'Not specified'}
Special Requirements: ${bookingData.special_requirements || 'None'}

Booking ID: ${bookingData.bookingId}`,
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
        { email: bookingData.teacher_email },
        { email: process.env.ADMIN_EMAIL || 'admin@ttsask.ca' }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 }, // 1 day before
          { method: 'popup', minutes: 30 }   // 30 minutes before
        ]
      }
    }
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      return {
        eventId: data.id,
        eventLink: data.htmlLink
      }
    } else {
      throw new Error(`Failed to create calendar event: ${response.statusText}`)
    }
    
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }
}

// Send email notifications
export async function sendBookingNotifications(bookingData: BookingData, eventLink: string) {
  try {
    // This would integrate with your email service (SendGrid, AWS SES, etc.)
    // For now, we'll just log the notifications that should be sent
    
    const notifications = [
      {
        to: bookingData.teacher_email,
        subject: 'SPED Class Booking Confirmation',
        template: 'teacher_confirmation',
        data: { ...bookingData, eventLink }
      },
      {
        to: process.env.COACH_EMAIL || 'coach@ttsask.ca',
        subject: 'New SPED Class Booking',
        template: 'coach_notification',
        data: { ...bookingData, eventLink }
      },
      {
        to: process.env.ADMIN_EMAIL || 'admin@ttsask.ca',
        subject: 'New SPED Class Booking - Admin Notification',
        template: 'admin_notification',
        data: { ...bookingData, eventLink }
      }
    ]
    
    // In a real implementation, you would send these emails here
    console.log('Email notifications to send:', notifications)
    
    return { success: true, notifications }
    
  } catch (error) {
    console.error('Error sending notifications:', error)
    throw error
  }
}
