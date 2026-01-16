
// Supabase Edge Function (Deno)
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

// Service role client (full access) to read/write bookings
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

// --- GOOGLE AUTH HELPERS ---

async function generateJWT() {
  if (!PRIVATE_KEY) throw new Error("Google Private Key not configured");
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    sub: "info@ttsask.ca",
  };

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
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signatureInput)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${signatureInput}.${encodedSignature}`;
}

async function getAccessToken() {
  const jwt = await generateJWT();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`OAuth token error: ${response.status} ${txt}`);
  }

  const data = await response.json();
  return data.access_token as string;
}

// --- BOOKING LOGIC ---

function getDefaultTimeSlots(date: Date) {
  const day = date.getDay();
  const slots: any[] = [];

  if (day === 1) {
    slots.push({ time: "11:00", display: "11:00 AM - 12:00 PM (60 min)", available: true, duration: 60 });
  } else if (day >= 2 && day <= 4) {
    slots.push(
      { time: "11:20", display: "11:20 AM - 12:20 PM (60 min)", available: true, duration: 60 },
      { time: "12:45", display: "12:45 PM - 1:45 PM (60 min)", available: true, duration: 60 }
    );
  } else if (day === 5) {
    slots.push(
      { time: "11:00", display: "11:00 AM - 12:00 PM (60 min)", available: true, duration: 60 },
      { time: "12:00", display: "12:00 PM - 1:00 PM (60 min)", available: true, duration: 60 },
      { time: "13:00", display: "1:00 PM - 2:00 PM (60 min)", available: true, duration: 60 },
      { time: "14:00", display: "2:00 PM - 3:00 PM (60 min)", available: true, duration: 60 },
      { time: "15:00", display: "3:00 PM - 4:00 PM (60 min)", available: true, duration: 60 }
    );
  }

  return slots;
}

// Source of truth: DATABASE (confirmed, pending, blocked)
async function getAvailableSlots(dateStr: string) {
  const defaultSlots = getDefaultTimeSlots(new Date(dateStr));

  const { data: booked, error } = await supabaseAdmin
    .from("confirmed_bookings")
    .select("id, booking_time_start, booking_time_end, status")
    .eq("booking_date", dateStr)
    // We treat 'blocked' just like 'confirmed' or 'pending' - it takes up the slot
    .in("status", ["pending", "confirmed", "blocked"]);

  if (error) {
    console.error("DB read error:", error);
    return defaultSlots; // fallback
  }

  const bookedStarts = new Set((booked ?? []).map((b: any) => String(b.booking_time_start).slice(0, 5)));

  return defaultSlots.map((s) => {
    const bookingMatch = (booked ?? []).find((b: any) => String(b.booking_time_start).slice(0, 5) === s.time);

    return {
      ...s,
      available: !bookingMatch,
      status: bookingMatch?.status || 'available',
      bookingId: bookingMatch?.id // Need this to delete "real" bookings
    };
  });
}

async function createGoogleEvent(booking: any, bookingRowId: string) {
  const accessToken = await getAccessToken();

  // UNIQUE per booking row
  const iCalUID = `sped-${bookingRowId}@ttsask.ca`;

  const slotSummary =
    booking.selected_slots?.map((slot: any) => `${slot.time} (${slot.duration} min)`).join(", ") ?? "Custom";

  const eventData = {
    iCalUID,
    summary: `SPED Class - ${booking.teacher_first_name} ${booking.teacher_last_name}`,
    description:
      `SPED Class Booking\n\n` +
      `Teacher: ${booking.teacher_first_name} ${booking.teacher_last_name}\n` +
      `School: ${booking.school_name}\n` +
      `Email: ${booking.teacher_email}\n` +
      `Phone: ${booking.teacher_phone}\n` +
      `Students: ${booking.number_of_students}\n` +
      `Grade: ${booking.grade_level ?? ""}\n` +
      `Preferred Coach: ${booking.preferred_coach ?? ""}\n` +
      `Special Requirements: ${booking.special_requirements ?? ""}\n` +
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

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?sendUpdates=all`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Google Calendar create error:", txt);
    throw new Error(`GOOGLE_CREATE_FAILED`);
  }

  const ev = await res.json();
  return { eventId: ev.id, eventLink: ev.htmlLink };
}

async function bookSlot(booking: any) {
  // 1) Insert in DB. Unique index prevents double booking against blocked slots too.
  const { data: inserted, error: insertErr } = await supabaseAdmin
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
      status: "pending",
    }])
    .select("id")
    .single();

  if (insertErr) {
    const msg = String(insertErr.message || "");
    const code = (insertErr as any).code;

    if (code === "23505" || msg.includes("duplicate key value") || msg.includes("unique constraint")) {
      throw new Error("DOUBLE_BOOKED");
    }

    console.error("DB insert error:", insertErr);
    throw new Error("DB_INSERT_FAILED");
  }

  const bookingId = inserted.id as string;

  try {
    const { eventId, eventLink } = await createGoogleEvent(booking, bookingId);

    const { error: updErr } = await supabaseAdmin
      .from("confirmed_bookings")
      .update({
        google_calendar_event_id: eventId,
        google_calendar_link: eventLink,
        status: "confirmed",
      })
      .eq("id", bookingId);

    if (updErr) {
      console.error("DB update error:", updErr);
    }

    return { eventId, eventLink };
  } catch (e) {
    await supabaseAdmin.from("confirmed_bookings").delete().eq("id", bookingId);
    throw e;
  }
}

// --- ADMIN BLOCKING LOGIC ---

async function verifyAdmin(authHeader: string | null) {
  if (!authHeader) throw new Error("Missing Authorization header");

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) throw new Error("Invalid token");

  // Check if user is in permitted admin emails list (Fallback for simple setup)
  const ALLOWED_ADMIN_EMAILS = ["info@ttsask.ca", "mark@ttsask.ca", "zion.office@sasktel.net"];
  if (user.email && ALLOWED_ADMIN_EMAILS.includes(user.email)) {
    return user.id;
  }

  // Otherwise check database role
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("UNAUTHORIZED: Admin access required");
  }

  return user.id;
}

// Block a slot (DB only, no Google Event)
async function blockSlot(booking: any, userId: string) {
  const { data: inserted, error } = await supabaseAdmin
    .from("confirmed_bookings")
    .insert([{
      // Minimal required fields for the table constraint
      teacher_first_name: "BLOCKED",
      teacher_last_name: "BLOCKED",
      teacher_email: "blocked@ttsask.ca",
      teacher_phone: "000-000-0000",
      school_name: "BLOCKED",
      school_address_line1: "BLOCKED",
      school_city: "BLOCKED",
      school_province: "SK",
      school_postal_code: "000 000",

      booking_date: booking.booking_date,
      booking_time_start: booking.booking_time_start,
      booking_time_end: booking.booking_time_end,

      number_of_students: 0,
      total_cost: 0,

      status: "blocked",
      blocked_reason: booking.blocked_reason,
      blocked_by: userId
    }])
    .select("id")
    .single();

  if (error) {
    const msg = String(error.message || "");
    const code = (error as any).code;
    if (code === "23505" || msg.includes("duplicate")) {
      throw new Error("SLOT_ALREADY_TAKEN");
    }
    throw new Error(`BLOCK_FAILED: ${error.message}`);
  }

  return { id: inserted.id };
}

// Unblock a slot
async function unblockSlot(booking: any) {
  const { error } = await supabaseAdmin
    .from("confirmed_bookings")
    .delete()
    .match({
      booking_date: booking.booking_date,
      booking_time_start: booking.booking_time_start,
      status: "blocked" // Safety: only delete blocked rows, never real bookings
    });

  if (error) throw new Error(`UNBLOCK_FAILED: ${error.message}`);
  return { success: true };
}


// Cancel a real booking (DB + Google Event)
async function deleteBooking(bookingId: string) {
  // 1. Get booking details to find Google Event ID
  const { data: booking, error: fetchError } = await supabaseAdmin
    .from("confirmed_bookings")
    .select("google_calendar_event_id")
    .eq("id", bookingId)
    .single();

  if (fetchError) throw new Error(`FETCH_FAILED: ${fetchError.message}`);
  if (!booking) throw new Error("BOOKING_NOT_FOUND");

  // 2. Delete from Google Calendar (if event exists)
  if (booking.google_calendar_event_id) {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${booking.google_calendar_event_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok && res.status !== 404 && res.status !== 410) {
        // Ignore 404/410 (already deleted)
        const txt = await res.text();
        console.error("Google delete error:", txt);
        // We continue to delete from DB even if Google fails, or throw? 
        // Usually better to ensure DB is clean. 
      }
    } catch (e) {
      console.error("Google delete exception:", e);
    }
  }

  // 3. Delete from DB
  const { error: deleteError } = await supabaseAdmin
    .from("confirmed_bookings")
    .delete()
    .eq("id", bookingId);

  if (deleteError) throw new Error(`DELETE_FAILED: ${deleteError.message}`);

  return { success: true };
}


// --- MAIN HANDLER ---

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, date, booking, bookingId } = await req.json();

    // Public Action: Check availability
    if (action === "getSlots") {
      const slots = await getAvailableSlots(date);
      return new Response(JSON.stringify({ success: true, slots }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Public Action: Book (DB + Google)
    if (action === "bookSlot") {
      const { eventId, eventLink } = await bookSlot(booking);
      return new Response(JSON.stringify({
        success: true,
        eventId,
        eventLink,
        message: "Booking confirmed",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin Action: Block
    if (action === "blockSlot") {
      const userId = await verifyAdmin(req.headers.get("Authorization"));
      await blockSlot(booking, userId);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Admin Action: Unblock
    if (action === "unblockSlot") {
      await verifyAdmin(req.headers.get("Authorization"));
      await unblockSlot(booking);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Admin Action: Delete Booking
    if (action === "deleteBooking") {
      await verifyAdmin(req.headers.get("Authorization"));
      if (!bookingId) throw new Error("Missing bookingId");
      await deleteBooking(bookingId);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: false, error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Edge function error:", err);

    const status =
      err.message === "UNAUTHORIZED" ? 401 :
        err.message === "DOUBLE_BOOKED" || err.message === "SLOT_ALREADY_TAKEN" ? 409 :
          500;

    return new Response(JSON.stringify({
      success: false,
      code: err.message,
      error: err.message === "DOUBLE_BOOKED"
        ? "This time slot was just booked by another teacher."
        : err.message
    }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});