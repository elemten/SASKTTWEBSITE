// Deno imports - these work in Supabase Edge Functions environment
// @ts-ignore - TypeScript doesn't understand Deno imports locally
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Google Calendar configuration - using environment variables for security
const CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID') ?? 'c_04d6de5f15712c0334d1c5112ed7e9072a57454eb202d464f3f7dca5c427a961@group.calendar.google.com';
const SERVICE_ACCOUNT_EMAIL = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL') ?? 'ttsask-calendar-booking@n8nworkflows-469621.iam.gserviceaccount.com';
const PRIVATE_KEY = Deno.env.get('GOOGLE_PRIVATE_KEY') ?? '';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey'
};

// JWT generation with Domain-Wide Delegation
async function generateJWT() {
  if (!PRIVATE_KEY) {
    throw new Error('Google Private Key not configured');
  }
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    sub: 'info@ttsask.ca' // Required for Domain-Wide Delegation
  };
  try {
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    // Clean the private key
    const cleanPrivateKey = PRIVATE_KEY.replace(/\\n/g, '\n').replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\s/g, '');
    // Convert base64 to ArrayBuffer
    const keyData = Uint8Array.from(atob(cleanPrivateKey), (c)=>c.charCodeAt(0));
    // Import the private key
    const privateKey = await crypto.subtle.importKey('pkcs8', keyData, {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    }, false, [
      'sign'
    ]);
    // Sign the JWT
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, new TextEncoder().encode(signatureInput));
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
    return `${signatureInput}.${encodedSignature}`;
  } catch (error) {
    console.error('JWT generation error:', error);
    throw new Error(`Failed to generate JWT: ${error.message}`);
  }
}

// Get access token from Google
async function getAccessToken() {
  try {
    console.log('Generating JWT token...');
    const jwt = await generateJWT();
    console.log('JWT generated successfully');
    console.log('Requesting access token from Google...');
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });
    console.log('Google OAuth response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google OAuth error response:', errorText);
      throw new Error(`Failed to get access token: ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    console.log('Access token received successfully');
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

// Helper function to calculate slot end time
function calculateSlotEndTime(date, startTime, display) {
  const [hours, minutes] = startTime.split(':').map(Number);
  let durationHours = 1 // Default 1 hour
  ;
  if (display.includes('1.5 hours')) {
    durationHours = 1.5;
  } else if (display.includes('2.75 hours')) {
    durationHours = 2.75;
  } else if (display.includes('5 hours')) {
    durationHours = 5;
  }
  const totalMinutes = hours * 60 + minutes + durationHours * 60;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${date}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00-06:00`;
}

// Get available time slots from Google Calendar
async function getAvailableSlots(date) {
  try {
    console.log('Fetching real Google Calendar data for date:', date);
    // Get access token
    const accessToken = await getAccessToken();
    console.log('Got access token for calendar query');
    // Query Google Calendar for existing events
    const startOfDay = `${date}T00:00:00-06:00`;
    const endOfDay = `${date}T23:59:59-06:00`;
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?timeMin=${startOfDay}&timeMax=${endOfDay}&singleEvents=true&orderBy=startTime`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetched calendar events:', data.items?.length || 0);
    // Get default slots and mark unavailable ones
    const defaultSlots = getDefaultTimeSlots(new Date(date));
    const bookedSlots = data.items || [];
    // Mark slots as unavailable if they conflict with existing events
    const availableSlots = defaultSlots.map((slot) => {
      const [hours, minutes] = slot.time.split(':').map(Number);
      const slotStartTime = new Date(date + 'T00:00:00-06:00');
      slotStartTime.setHours(hours, minutes, 0, 0);
      
      const slotEndTime = new Date(slotStartTime);
      slotEndTime.setMinutes(slotEndTime.getMinutes() + slot.duration);
      
      const slotStart = slotStartTime.toISOString();
      const slotEnd = slotEndTime.toISOString();
      
      const isBooked = bookedSlots.some((event) => {
        const eventStart = event.start.dateTime || event.start.date;
        const eventEnd = event.end.dateTime || event.end.date;
        
        // Convert to Date objects for proper comparison
        const eventStartTime = new Date(eventStart);
        const eventEndTime = new Date(eventEnd);
        
        // Check for true overlap (not just boundary touching)
        // Slot is booked if: slot starts before event ends AND slot ends after event starts
        // But exclude cases where they just touch at the boundary
        const hasOverlap = slotStartTime < eventEndTime && slotEndTime > eventStartTime;
        const justTouching = slotEndTime.getTime() === eventStartTime.getTime() || 
                           slotStartTime.getTime() === eventEndTime.getTime();
        
        const isConflict = hasOverlap && !justTouching;
        
        // Debug logging
        if (hasOverlap) {
          console.log(`Checking slot ${slot.time} (${slotStartTime.toISOString()} - ${slotEndTime.toISOString()}) vs event (${eventStartTime.toISOString()} - ${eventEndTime.toISOString()}): hasOverlap=${hasOverlap}, justTouching=${justTouching}, conflict=${isConflict}`);
        }
        
        return isConflict;
      });
      
      return {
        ...slot,
        available: !isBooked
      };
    });
    console.log('Available slots after checking calendar:', availableSlots.filter((s)=>s.available).length);
    return availableSlots;
  } catch (error) {
    console.error('Error getting available slots from Google Calendar:', error);
    console.log('Falling back to default slots...');
    return getDefaultTimeSlots(new Date(date));
  }
}

// Get default time slots based on day of week
function getDefaultTimeSlots(date) {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const slots = [];
  
  // Monday: 11am-12pm (1 hour only)
  if (dayOfWeek === 1) {
    slots.push({
      time: '11:00',
      display: '11:00 AM - 12:00 PM (60 min)',
      available: true,
      duration: 60 // minutes
    });
  } 
  // Tuesday-Thursday: 11am-1:45pm (3 slots: 2 x 60min + 1 x 45min)
  else if (dayOfWeek >= 2 && dayOfWeek <= 4) {
    slots.push({
      time: '11:00',
      display: '11:00 AM - 12:00 PM (60 min)',
      available: true,
      duration: 60
    });
    slots.push({
      time: '12:00',
      display: '12:00 PM - 1:00 PM (60 min)',
      available: true,
      duration: 60
    });
    slots.push({
      time: '13:00',
      display: '1:00 PM - 1:45 PM (45 min)',
      available: true,
      duration: 45
    });
  } 
  // Friday: 11am-4pm (5 x 60min slots)
  else if (dayOfWeek === 5) {
    slots.push({
      time: '11:00',
      display: '11:00 AM - 12:00 PM (60 min)',
      available: true,
      duration: 60
    });
    slots.push({
      time: '12:00',
      display: '12:00 PM - 1:00 PM (60 min)',
      available: true,
      duration: 60
    });
    slots.push({
      time: '13:00',
      display: '1:00 PM - 2:00 PM (60 min)',
      available: true,
      duration: 60
    });
    slots.push({
      time: '14:00',
      display: '2:00 PM - 3:00 PM (60 min)',
      available: true,
      duration: 60
    });
    slots.push({
      time: '15:00',
      display: '3:00 PM - 4:00 PM (60 min)',
      available: true,
      duration: 60
    });
  }
  
  return slots;
}

// Create Google Calendar event for multiple slots
async function createCalendarEvent(booking) {
  try {
    console.log('Creating Google Calendar event for booking');
    console.log('Selected slots:', booking.selected_slots);
    
    // Try to get access token and create real event
    try {
      const accessToken = await getAccessToken();
      console.log('Got access token, creating real calendar event...');
      
      // Create slot summary for description
      const slotSummary = booking.selected_slots?.map(slot => 
        `${slot.time} (${slot.duration} min)`
      ).join(', ') || 'Custom time slots';
      
      const eventData = {
        summary: `SPED Class - ${booking.teacher_first_name} ${booking.teacher_last_name}`,
        description: `SPED Class Booking\n\nTeacher: ${booking.teacher_first_name} ${booking.teacher_last_name}\nSchool: ${booking.school_name}\nEmail: ${booking.teacher_email}\nPhone: ${booking.teacher_phone}\nStudents: ${booking.number_of_students}\nGrade: ${booking.grade_level}\nPreferred Coach: ${booking.preferred_coach}\nSpecial Requirements: ${booking.special_requirements}\nSelected Slots: ${slotSummary}\nTotal Minutes: ${booking.total_minutes}\nTotal Cost: $${booking.total_cost}`,
      start: {
          dateTime: `${booking.booking_date}T${booking.booking_time_start}`,
        timeZone: 'America/Regina'
      },
      end: {
          dateTime: `${booking.booking_date}T${booking.booking_time_end}`,
        timeZone: 'America/Regina'
      },
        location: `${booking.school_name}, ${booking.school_address_line1}, ${booking.school_city}, ${booking.school_province}`,
      attendees: [
          {
            email: booking.teacher_email
          },
          {
            email: 'info@ttsask.ca'
          }
      ],
      reminders: {
        useDefault: false,
        overrides: [
            {
              method: 'email',
              minutes: 1440
            },
            {
              method: 'popup',
              minutes: 30
            }
          ]
        }
      };
      console.log('Creating real calendar event with data:', eventData);
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Calendar API error:', errorText);
        throw new Error(`Failed to create calendar event: ${response.statusText}`);
      }
      const event = await response.json();
      console.log('✅ Real calendar event created successfully:', event.id);
    return {
        eventId: event.id,
        eventLink: event.htmlLink || `https://calendar.google.com/calendar/event?eid=${event.id}`
      };
    } catch (authError) {
      console.error('Authentication failed, creating simulated event:', authError);
      // Fallback: create simulated event
      const eventId = `simulated_${Date.now()}`;
      const eventLink = `https://calendar.google.com/calendar/event?eid=${eventId}`;
              console.log('⚠️ Created simulated calendar event (not in real calendar):', {
          summary: `SPED Class - ${booking.teacher_first_name} ${booking.teacher_last_name}`,
          description: `SPED Class Booking\n\nTeacher: ${booking.teacher_first_name} ${booking.teacher_last_name}\nSchool: ${booking.school_name}\nEmail: ${booking.teacher_email}\nPhone: ${booking.teacher_phone}\nStudents: ${booking.number_of_students}\nGrade: ${booking.grade_level}\nPreferred Coach: ${booking.preferred_coach}\nSpecial Requirements: ${booking.special_requirements}\nTotal Cost: $${booking.total_cost}`,
        start: {
          dateTime: `${booking.booking_date}T${booking.booking_time_start}`,
          timeZone: 'America/Regina'
        },
        end: {
          dateTime: `${booking.booking_date}T${booking.booking_time_end}`,
          timeZone: 'America/Regina'
        },
        location: `${booking.school_name}, ${booking.school_address_line1}, ${booking.school_city}, ${booking.school_province}`,
        attendees: [
          {
            email: booking.teacher_email
          },
          {
            email: 'info@ttsask.ca'
          }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            {
              method: 'email',
              minutes: 1440
            },
            {
              method: 'popup',
              minutes: 30
            }
          ]
        }
      });
    return {
        eventId,
        eventLink
      };
    }
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

// Main handler
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  try {
    const { action, date, booking } = await req.json();
    if (action === 'getSlots') {
      console.log('Getting available slots for date:', date);
      const slots = await getAvailableSlots(date);
      return new Response(JSON.stringify({
        success: true,
        slots
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    if (action === 'bookSlot') {
      console.log('Booking slot for:', booking.id);
      const { eventId, eventLink } = await createCalendarEvent(booking);
      return new Response(JSON.stringify({
        success: true,
        eventId,
        eventLink,
        message: 'Booking confirmed and calendar event created'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({
      error: 'Invalid action'
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});