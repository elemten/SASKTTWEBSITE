create table if not exists booking_locks (
  booking_date date not null,
  booking_time_start time not null,
  booking_time_end time not null,
  created_at timestamptz not null default now(),
  primary key (booking_date, booking_time_start, booking_time_end)
);
