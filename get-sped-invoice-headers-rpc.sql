-- RPC function to get SPED invoice headers grouped by school and month
-- This function returns invoice summary data grouped by school system and school name
-- for a given month, including booking counts and total costs

CREATE OR REPLACE FUNCTION get_sped_invoice_headers(month_start date)
RETURNS TABLE (
  school_system text,
  school_name text,
  booking_count bigint,
  total_cost numeric
) 
LANGUAGE plpgsql
AS $$
DECLARE
  month_start_trunc date;
  month_end_trunc date;
BEGIN
  -- Truncate to first day of month
  month_start_trunc := DATE_TRUNC('month', month_start)::date;
  -- Get last day of the month
  month_end_trunc := (DATE_TRUNC('month', month_start) + INTERVAL '1 month' - INTERVAL '1 day')::date;
  
  RETURN QUERY
  SELECT 
    COALESCE(cb.school_system, 'Other')::text as school_system,
    cb.school_name::text,
    COUNT(*)::bigint as booking_count,
    SUM(cb.total_cost)::numeric as total_cost
  FROM confirmed_bookings cb
  WHERE 
    cb.booking_date >= month_start_trunc
    AND cb.booking_date <= month_end_trunc
    AND cb.status IN ('confirmed', 'completed')
  GROUP BY cb.school_system, cb.school_name
  ORDER BY cb.school_system, cb.school_name;
END;
$$;

