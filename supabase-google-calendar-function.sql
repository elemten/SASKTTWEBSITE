-- Google Calendar Integration Function for Supabase
-- This function automatically creates Google Calendar events when bookings are submitted

-- First, create the function that will handle Google Calendar operations
CREATE OR REPLACE FUNCTION create_google_calendar_event()
RETURNS TRIGGER AS $$
DECLARE
  -- Use environment variables for security - these should be set in Supabase dashboard
  calendar_id TEXT := current_setting('app.google_calendar_id', true);
  service_account_email TEXT := current_setting('app.google_service_account_email', true);
  private_key TEXT := current_setting('app.google_private_key', true);
  
  -- HTTP request variables
  request_url TEXT;
  request_body TEXT;
  response_status INTEGER;
  response_body TEXT;
  
  -- Event details
  event_summary TEXT;
  event_description TEXT;
  event_start TEXT;
  event_end TEXT;
  
BEGIN
  -- Only process new SPED submissions
  IF TG_TABLE_NAME = 'sped_submissions' AND TG_OP = 'INSERT' THEN
    
    -- Build event details
    event_summary := 'SPED Class - ' || NEW.first_name || ' ' || NEW.last_name;
    event_description := 'SPED Class Booking' || E'\n\n' ||
                       'Teacher: ' || NEW.first_name || ' ' || NEW.last_name || E'\n' ||
                       'School: ' || NEW.school || E'\n' ||
                       'Email: ' || NEW.email || E'\n' ||
                       'Phone: ' || NEW.phone || E'\n' ||
                       'Students: ' || NEW.students || E'\n' ||
                       'Grade: ' || COALESCE(NEW.grade, 'Not specified') || E'\n' ||
                       'Notes: ' || COALESCE(NEW.notes, 'None') || E'\n\n' ||
                       'Duration: ' || NEW.preferred_times;
    
    -- Parse preferred_times to get date and time
    -- Format: "2025-01-15 at 11:00-13:45"
    event_start := SPLIT_PART(NEW.preferred_times, ' at ', 1) || 'T' || SPLIT_PART(SPLIT_PART(NEW.preferred_times, ' at ', 2), '-', 1) || ':00';
    event_end := SPLIT_PART(NEW.preferred_times, ' at ', 1) || 'T' || SPLIT_PART(SPLIT_PART(NEW.preferred_times, ' at ', 2), '-', 2) || ':00';
    
    -- Build Google Calendar API request
    request_url := 'https://www.googleapis.com/calendar/v3/calendars/' || calendar_id || '/events';
    request_body := json_build_object(
      'summary', event_summary,
      'description', event_description,
      'start', json_build_object('dateTime', event_start, 'timeZone', 'America/Regina'),
      'end', json_build_object('dateTime', event_end, 'timeZone', 'America/Regina'),
      'attendees', json_build_array(
        json_build_object('email', NEW.email),
        json_build_object('email', current_setting('app.admin_email', true))
      ),
      'reminders', json_build_object(
        'useDefault', false,
        'overrides', json_build_array(
          json_build_object('method', 'email', 'minutes', 1440),
          json_build_object('method', 'popup', 'minutes', 30)
        )
      )
    )::text;
    
    -- Make HTTP request to Google Calendar API
    SELECT 
      status,
      content
    INTO 
      response_status,
      response_body
    FROM 
      http((
        'POST',
        request_url,
        ARRAY[
          http_header('Authorization', 'Bearer ' || get_google_access_token()),
          http_header('Content-Type', 'application/json')
        ],
        'application/json',
        request_body
      ));
    
    -- Log the response
    RAISE NOTICE 'Google Calendar API Response: Status %, Body %', response_status, response_body;
    
    -- Update the submission with calendar event ID if successful
    IF response_status = 200 THEN
      UPDATE sped_submissions 
      SET admin_notes = COALESCE(admin_notes, '') || E'\nCalendar Event Created: ' || 
                       json_extract_path_text(response_body::json, 'id')
      WHERE id = NEW.id;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get Google access token (you'll need to implement this)
CREATE OR REPLACE FUNCTION get_google_access_token()
RETURNS TEXT AS $$
BEGIN
  -- For now, return a placeholder
  -- In production, you'd implement JWT token generation
  RETURN 'PLACEHOLDER_TOKEN';
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically call the function
CREATE TRIGGER trigger_create_google_calendar_event
  AFTER INSERT ON sped_submissions
  FOR EACH ROW
  EXECUTE FUNCTION create_google_calendar_event();

-- Also create trigger for clinics submissions
CREATE TRIGGER trigger_create_google_calendar_event_clinics
  AFTER INSERT ON clinics_submissions
  FOR EACH ROW
  EXECUTE FUNCTION create_google_calendar_event();