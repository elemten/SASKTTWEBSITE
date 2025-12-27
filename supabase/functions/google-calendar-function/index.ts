// Deno imports - Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const CALENDAR_ID =
  Deno.env.get("GOOGLE_CALENDAR_ID") ??
  "c_04d6de5f15712c0334d1c5112ed7e9072a57454eb202d464f3f7dca5c427a961@group.calendar.google.com";
const SERVICE_ACCOUNT_EMAIL =
  Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL") ??
  "ttsask-calendar-booking@n8nworkflows-469621.iam.gserviceaccount.com";
const PRIVATE_KEY = Deno.env.get("GOOGLE_PRIVATE_KEY") ?? "";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

// ---------- GOOGLE AUTH ----------
async function generateJWT() {
  if (!PRIVATE_KEY) throw new Error("Google Private Key not configured");

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    sub: "info@ttsask.ca", // Domain-wide delegation user
  };

  const header = { alg: "RS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const cleanPrivateKey = PRIVATE_KEY
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  const keyData = Uint8Array.from(atob(cleanPrivateKey), (c) => c.charCodeAt(0));

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signatureInput),
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${signatureInput}.${encodedSignature}`;
}

async function getAccessToken() {
  const jwt = await generateJWT();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Failed to get access token: ${res.status} - ${t}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

// ---------- SLOTS ----------
function getDefaultTimeSlots(date: Date) {
  const dayOfWeek = date.getDay();
  const slots: any[] = [];

  if (dayOfWeek === 1) {
    slots.push({ time: "11:00", display: "11:00 AM - 12:00 PM (60 min)", available: true, duration: 60 });
  } else if (dayOfWeek >= 2 && dayOfWeek <= 4) {
    slots.push(
      { time: "11:20", display: "11:20 AM - 12:20 PM (60 min)", available: true, duration: 60 },
      { time: "12:45", display: "12:45 PM - 1:45 PM (60 min)", available: true, duration: 60 },
    );
  } else if (dayOfWeek === 5) {
    slots.push(
      { time: "11:00", display: "11:00 AM - 12:00 PM (60 min)", available: true, duration: 60 },
      { time: "12:00", display: "12:00 PM - 1:00 PM (60 min)", available: true, duration: 60 },
      { time: "13:00", display: "1:00 PM - 2:00 PM (60 min)", available: true, duration: 60 },
      { time: "14:00", display: "2:00 PM - 3:00 PM (60 min)", available: true, duration: 60 },
      { time: "15:00", display: "3:00 PM - 4:00 PM (60 min)", available: true, duration: 60 },
    );
  }

  return slots;
}

async function getAvailableSlots(date: string) {
  try {
    const accessToken = await getAccessToken();

    const startOfDay = `${date}T00:00:00-06:00`;
    const endOfDay = `${date}T23:59:59-06:00`;

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?timeMin=${encodeURIComponent(startOfDay)}&timeMax=${encodeURIComponent(endOfDay)}&singleEvents=true&orderBy=startTime`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!response.ok) throw new Error(`Calendar API error: ${response.statusText}`);

    const data = await response.json();
    const bookedEvents = data.items || [];

    const defaults = getDefaultTimeSlots(new Date(date));

    return defaults.map((slot) => {
      const slotStart = new Date(`${date}T${slot.time}:00-06:00`);
      const slotEnd = new Date(slotStart.getTime() + (slot.duration ?? 60) * 60 * 1000);

      const isBooked = bookedEvents.some((ev: any) => {
        const es = new Date(ev.start.dateTime || ev.start.date);
        const ee = new Date(ev.end.dateTime || ev.end.date);
        return slotStart < ee && slotEnd > es;
      });

      return { ...slot, available: !isBooked };
    });
  } catch (_e) {
    return getDefaultTimeSlots(new Date(date));
  }
}

// ---------- BOOKING ----------
async function createGoogleEvent(booking: any, accessToken: string) {
  const icalUid = `sped-${booking.booking_date}-${booking.booking_time_start}-${booking.booking_time_end}@ttsask.ca`;

  const slotSummary =
    booking.selected_slots?.map((s: any) => `${s.time} (${s.duration} min)`).join(", ") ??
    "Custom time slots";

  const eventData = {
    iCalUID: icalUid,
    summary: `SPED Class - ${booking.teacher_first_name} ${booking.teacher_last_name}`,
    description:
      `SPED Class Booking\n\n` +
      `Teacher: ${booking.teacher_first_name} ${booking.teacher_last_name}\n` +
      `School: ${booking.school_name}\n` +
      `Email: ${booking.teacher_email}\n` +
      `Phone: ${booking.teacher_phone}\n` +
      `Students: ${booking.number_of_students}\n` +
      `Grade: ${booking.grade_level}\n` +
      `Preferred Coach: ${booking.preferred_coach}\n` +
      `Special Requirements: ${booking.special_requirements}\n` +
      `Selected Slots: ${slotSummary}\n` +
      `Total Minutes: ${booking.total_minutes}\n` +
      `Total Cost: $${booking.total_cost}`,
    start: { dateTime: `${booking.booking_date}T${booking.booking_time_start}`, timeZone: "America/Regina" },
    end: { dateTime: `${booking.booking_date}T${booking.booking_time_end}`, timeZone: "America/Regina" },
    location: `${booking.school_name}, ${booking.school_address_line1}, ${booking.school_city}, ${booking.school_province}`,
    attendees: [
      { email: booking.teacher_email },
      { email: "info@ttsask.ca" },
      { email: "zion.office@sasktel.net" },
      { email: "coach@ttsask.ca" },
      { email: "murraysproule@sasktel.net" },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 1440 },
        { method: "popup", minutes: 30 },
      ],
    },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?sendUpdates=all`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    },
  );

  // If Google says duplicate iCalUID, treat it as DOUBLE_BOOKED (someone already created it)
  if (res.status === 409) {
    const t = await res.text();
    console.error("Google duplicate iCalUID:", t);
    throw new Error("DOUBLE_BOOKED");
  }

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GOOGLE_CREATE_FAILED: ${res.status} ${t}`);
  }

  const ev = await res.json();
  return { eventId: ev.id, eventLink: ev.htmlLink };
}

async function bookSlot(booking: any) {
  // 1) Try to reserve slot in DB FIRST (this is the lock)
  const { data: inserted, error: insertErr } = await supabase
    .from("confirmed_bookings")
    .insert([{
      teacher_first_name: booking.teacher_first_name,
      teacher_last_name: booking.teacher_last_name,
      teacher_email: booking.teacher_email,
      teacher_phone: booking.teacher_phone,
      school_name: booking.school_name,
      school_address_line1: booking.school_address_line1,
      school_address_line2: booking.school_address_line2,
      school_city: booking.school_city,
      school_province: booking.school_province,
      school_postal_code: booking.school_postal_code,
      booking_date: booking.booking_date,
      booking_time_start: booking.booking_time_start,
      booking_time_end: booking.booking_time_end,
      number_of_students: booking.number_of_students,
      grade_level: booking.grade_level,
      preferred_coach: booking.preferred_coach,
      special_requirements: booking.special_requirements,
      rate_per_hour: booking.rate_per_hour,
      total_cost: booking.total_cost,
      total_minutes: booking.total_minutes,
      selected_slots: booking.selected_slots,
      school_system: booking.school_system,
      status: "confirmed", // must match your CHECK constraint
    }])
    .select("id")
    .single();

  if (insertErr) {
    // Duplicate slot => already booked
    // PostgREST error codes vary, but "23505" is common in logs
    if ((insertErr as any).code === "23505") throw new Error("DOUBLE_BOOKED");
    throw new Error(`DB_INSERT_FAILED: ${insertErr.message}`);
  }

  // 2) Create Google event
  const accessToken = await getAccessToken();
  try {
    const { eventId, eventLink } = await createGoogleEvent(booking, accessToken);

    // 3) Save event info back to DB row
    await supabase
      .from("confirmed_bookings")
      .update({ google_calendar_event_id: eventId, google_calendar_link: eventLink })
      .eq("id", inserted.id);

    return { success: true, eventId, eventLink };
  } catch (e) {
    // If Google fails, rollback DB reservation so slot becomes available again
    await supabase.from("confirmed_bookings").delete().eq("id", inserted.id);
    throw e;
  }
}

// ---------- MAIN ----------
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, date, booking } = await req.json();

    if (action === "getSlots") {
      const slots = await getAvailableSlots(date);
      return new Response(JSON.stringify({ success: true, slots }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "bookSlot") {
      const result = await bookSlot(booking);
      return new Response(JSON.stringify({ ...result, message: "Booking confirmed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: false, error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Edge function error:", error);

    if (error.message === "DOUBLE_BOOKED") {
      return new Response(
        JSON.stringify({
          success: false,
          code: "DOUBLE_BOOKED",
          error: "This time slot was just booked by another teacher. Please pick another available time.",
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});