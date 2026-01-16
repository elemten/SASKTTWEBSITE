-- Migration to support SPED blocking feature
-- Run this in the Supabase SQL Editor

-- 1. Update the status CHECK constraint to include 'blocked'
ALTER TABLE confirmed_bookings
DROP CONSTRAINT IF EXISTS confirmed_bookings_status_check;

ALTER TABLE confirmed_bookings
ADD CONSTRAINT confirmed_bookings_status_check
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'blocked'));

-- 2. Add 'blocked' metadata columns (nullable)
ALTER TABLE confirmed_bookings
ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
ADD COLUMN IF NOT EXISTS blocked_by UUID REFERENCES auth.users(id);

-- 3. Create a unique index to prevent double bookings (DB-level safety)
-- This ensures no two rows can share the same date + start time
-- NOTE: If you have existing duplicates in your DB, this command will fail.
-- You would need to clean up duplicates first.
CREATE UNIQUE INDEX IF NOT EXISTS idx_confirmed_bookings_unique_slot
ON confirmed_bookings (booking_date, booking_time_start)
WHERE status != 'cancelled'; -- We can allow multiple cancelled bookings for same slot, but only one active/blocked one.
