-- SPED Booking System Database Schema
-- Create the confirmed_bookings table for SPED program bookings

CREATE TABLE IF NOT EXISTS confirmed_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Teacher Information
  teacher_first_name VARCHAR(100) NOT NULL,
  teacher_last_name VARCHAR(100) NOT NULL,
  teacher_email VARCHAR(255) NOT NULL,
  teacher_phone VARCHAR(20) NOT NULL,
  
  -- School Information
  school_name VARCHAR(255) NOT NULL,
  school_address_line1 VARCHAR(255) NOT NULL,
  school_address_line2 VARCHAR(100),
  school_city VARCHAR(100) NOT NULL,
  school_province VARCHAR(50) NOT NULL,
  school_postal_code VARCHAR(10) NOT NULL,
  school_country VARCHAR(50) DEFAULT 'Canada',
  
  -- Booking Details
  booking_date DATE NOT NULL,
  booking_time_start TIME NOT NULL,
  booking_time_end TIME NOT NULL,
  number_of_sessions INTEGER NOT NULL DEFAULT 1,
  number_of_students INTEGER NOT NULL,
  grade_level VARCHAR(50),
  preferred_coach VARCHAR(100),
  
  -- Financial Information
  rate_per_hour DECIMAL(10,2) DEFAULT 95.00,
  total_cost DECIMAL(10,2) NOT NULL,
  
  -- Google Calendar Integration
  google_calendar_event_id VARCHAR(255),
  google_calendar_link TEXT,
  
  -- Status and Notes
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  admin_notes TEXT,
  special_requirements TEXT,
  
  -- Email Notifications
  teacher_confirmation_sent BOOLEAN DEFAULT FALSE,
  coach_notification_sent BOOLEAN DEFAULT FALSE,
  admin_notification_sent BOOLEAN DEFAULT FALSE,
  
  -- Invoice Information
  invoice_generated BOOLEAN DEFAULT FALSE,
  invoice_number VARCHAR(50),
  invoice_sent BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_date ON confirmed_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_status ON confirmed_bookings(status);
CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_teacher_email ON confirmed_bookings(teacher_email);
CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_google_event_id ON confirmed_bookings(google_calendar_event_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_confirmed_bookings_updated_at 
    BEFORE UPDATE ON confirmed_bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - for testing)
-- INSERT INTO confirmed_bookings (
--   teacher_first_name, teacher_last_name, teacher_email, teacher_phone,
--   school_name, school_address_line1, school_city, school_province, school_postal_code,
--   booking_date, booking_time_start, booking_time_end, number_of_sessions, number_of_students,
--   total_cost, status
-- ) VALUES (
--   'John', 'Doe', 'john.doe@example.com', '306-555-0123',
--   'Example School', '123 Main St', 'Saskatoon', 'SK', 'S7K 1A1',
--   '2025-01-15', '11:00:00', '12:00:00', 1, 15,
--   95.00, 'confirmed'
-- );
