import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, Check } from "lucide-react";
import { format } from "date-fns";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface FormData {
  teacher_first_name: string;
  teacher_last_name: string;
  teacher_email: string;
  teacher_phone: string;
  school_name: string;
  school_address_line1: string;
  school_address_line2: string;
  school_city: string;
  school_province: string;
  school_postal_code: string;
  booking_date: Date | null;
  number_of_students: number;
  grade_level?: string;
  preferred_coach?: string;
  special_requirements?: string;
  school_system?: 'Saskatoon Public' | 'Catholic' | 'Other' | undefined;
}

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
  duration?: number; // minutes
}

const HOURLY_RATE = 95;

// ✅ Single Supabase client (prevents "Multiple GoTrueClient instances" warning)
const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const SPEDBookingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    teacher_first_name: '',
    teacher_last_name: '',
    teacher_email: '',
    teacher_phone: '',
    school_name: '',
    school_address_line1: '',
    school_address_line2: '',
    school_city: '',
    school_province: '',
    school_postal_code: '',
    booking_date: null,
    number_of_students: 0,
    grade_level: '',
    preferred_coach: '',
    special_requirements: '',
    school_system: undefined
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Calendar & dropdowns
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Totals (derived)
  const totalMinutes = useMemo(
    () => selectedSlots.reduce((sum, s) => sum + (s.duration ?? 60), 0),
    [selectedSlots]
  );
  const totalCost = useMemo(
    () => Math.round(((totalMinutes / 60) * HOURLY_RATE) * 100) / 100,
    [totalMinutes]
  );

  // Fetch slots when date changes
  useEffect(() => {
    if (formData.booking_date) fetchAvailableTimeSlots(formData.booking_date);
    setSelectedSlots([]);
  }, [formData.booking_date]);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.calendar-container') && !target.closest('#date-picker-button')) setIsCalendarOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fetchAvailableTimeSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-function', {
        body: { action: 'getSlots', date: date.toISOString().split('T')[0] }
      });
      if (error) throw new Error(`Supabase function error: ${error.message}`);
      if (!data?.success) throw new Error(data?.message || data?.error || 'Failed to fetch time slots');
      setAvailableTimeSlots(data.slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableTimeSlots(getDefaultTimeSlots(date)); // fallback
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Mirror of Edge defaults (Mon same; Tue/Wed/Thu 11:20–12:20 & 12:45–1:45; Fri same)
  const getDefaultTimeSlots = (date: Date): TimeSlot[] => {
    const day = date.getDay();
    const slots: TimeSlot[] = [];
    if (day === 1) {
      slots.push({ time: '11:00', display: '11:00 AM - 12:00 PM (60 min)', available: true, duration: 60 });
    } else if (day >= 2 && day <= 4) {
      slots.push(
        { time: '11:20', display: '11:20 AM - 12:20 PM (60 min)', available: true, duration: 60 },
        { time: '12:45', display: '12:45 PM - 1:45 PM (60 min)', available: true, duration: 60 },
      );
    } else if (day === 5) {
      slots.push(
        { time: '11:00', display: '11:00 AM - 12:00 PM (60 min)', available: true, duration: 60 },
        { time: '12:00', display: '12:00 PM - 1:00 PM (60 min)', available: true, duration: 60 },
        { time: '13:00', display: '1:00 PM - 2:00 PM (60 min)', available: true, duration: 60 },
        { time: '14:00', display: '2:00 PM - 3:00 PM (60 min)', available: true, duration: 60 },
        { time: '15:00', display: '3:00 PM - 4:00 PM (60 min)', available: true, duration: 60 },
      );
    }
    return slots;
  };

  const slotEndTime = (startHHMM: string, duration = 60): string => {
    const [h, m] = startHHMM.split(':').map(Number);
    const total = h * 60 + m + duration;
    const eh = Math.floor(total / 60);
    const em = total % 60;
    return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}:00`;
  };

  // Validation
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!formData.school_system) errors.push('Please select School Type');
    if (!formData.teacher_first_name.trim()) errors.push('Teacher first name is required');
    if (!formData.teacher_last_name.trim()) errors.push('Teacher last name is required');
    if (!formData.teacher_email.trim()) errors.push('Teacher email is required');
    if (!formData.teacher_phone.trim()) errors.push('Teacher phone is required');
    if (!formData.school_name.trim()) errors.push('School name is required');
    if (!formData.school_address_line1.trim()) errors.push('School address is required');
    if (!formData.school_city.trim()) errors.push('School city is required');
    if (!formData.school_province.trim()) errors.push('School province is required');
    if (!formData.school_postal_code.trim()) errors.push('School postal code is required');
    if (!formData.booking_date) errors.push('Please select a booking date');
    if (selectedSlots.length === 0) errors.push('Please select at least one time slot');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.teacher_email && !emailRegex.test(formData.teacher_email)) errors.push('Please enter a valid email address');

    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    if (formData.teacher_phone && !phoneRegex.test(formData.teacher_phone)) errors.push('Please enter a valid phone number');

    const postalRegex = /^[A-Za-z]\d[A-Za-z][\s\-]?\d[A-Za-z]\d$/;
    if (formData.school_postal_code && !postalRegex.test(formData.school_postal_code)) errors.push('Please enter a valid postal code (e.g., S7K 1A1)');

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // 1) Validate form data
      const validation = validateForm();
      if (!validation.isValid) throw new Error(validation.errors.join('. '));

      const bookingDateStr = formData.booking_date!.toISOString().split('T')[0];
      const slotsPayload = selectedSlots.map(s => ({
        time: s.time,
        display: s.display,
        duration: s.duration ?? 60,
        available: s.available
      }));
      const first = selectedSlots[0];

      const bookingData = {
        teacher_first_name: formData.teacher_first_name,
        teacher_last_name: formData.teacher_last_name,
        teacher_email: formData.teacher_email,
        teacher_phone: formData.teacher_phone,
        school_name: formData.school_name,
        school_address_line1: formData.school_address_line1,
        school_address_line2: formData.school_address_line2,
        school_city: formData.school_city,
        school_province: formData.school_province,
        school_postal_code: formData.school_postal_code,
        booking_date: bookingDateStr,
        // legacy columns satisfied by first slot
        booking_time_start: `${first.time}:00`,
        booking_time_end: slotEndTime(first.time, first.duration ?? 60),
        number_of_students: formData.number_of_students,
        grade_level: formData.grade_level,
        preferred_coach: formData.preferred_coach,
        special_requirements: formData.special_requirements,
        rate_per_hour: HOURLY_RATE,
        total_cost: totalCost,
        total_minutes: totalMinutes,
        selected_slots: slotsPayload,
        school_system: formData.school_system
      };

      // ✅ 2) CALL EDGE FUNCTION FIRST — create calendar event(s)
      const { data: calendarData, error: calError } = await supabase.functions.invoke('google-calendar-function', {
        body: { action: 'bookSlot', booking: bookingData }
      });

      // ✅ 1) If backend returned DOUBLE_BOOKED in body
      if (calendarData?.code === 'DOUBLE_BOOKED') {
        if (formData.booking_date) fetchAvailableTimeSlots(formData.booking_date);
        throw new Error(calendarData.error || 'This time slot was just booked by another teacher. Please pick another time.');
      }

      // ✅ 2) If Supabase SDK flagged non-2xx (like 409 conflict)
      const status = (calError as any)?.context?.status;
      if (status === 409) {
        if (formData.booking_date) fetchAvailableTimeSlots(formData.booking_date);
        throw new Error('This time slot was just booked by another teacher. Please pick another available time.');
      }

      // ✅ 3) Any other error from invocation
      if (calError) {
        throw new Error(calendarData?.error || `Calendar function error: ${calError.message}`);
      }

      // ✅ 4) Generic success check
      if (!calendarData?.success) {
        const details = calendarData?.message || calendarData?.error || 'Failed to create calendar event(s)';
        throw new Error(details);
      }

      // 3) ONLY IF SUCCESS → insert into DB
      const firstEvent = calendarData.events?.[0];
      const extraLinks = calendarData.events?.map((e: any) => e.eventLink).join('\n') ?? null;

      const { error: dbError } = await supabase
        .from('confirmed_bookings')
        .insert([{
          teacher_first_name: bookingData.teacher_first_name,
          teacher_last_name: bookingData.teacher_last_name,
          teacher_email: bookingData.teacher_email,
          teacher_phone: bookingData.teacher_phone,
          school_name: bookingData.school_name,
          school_address_line1: bookingData.school_address_line1,
          school_address_line2: bookingData.school_address_line2,
          school_city: bookingData.school_city,
          school_province: bookingData.school_province,
          school_postal_code: bookingData.school_postal_code,
          booking_date: bookingData.booking_date,
          booking_time_start: bookingData.booking_time_start,
          booking_time_end: bookingData.booking_time_end,
          number_of_students: bookingData.number_of_students,
          grade_level: bookingData.grade_level,
          preferred_coach: bookingData.preferred_coach,
          special_requirements: bookingData.special_requirements,
          rate_per_hour: bookingData.rate_per_hour,
          total_cost: bookingData.total_cost,
          total_minutes: bookingData.total_minutes,
          selected_slots: bookingData.selected_slots,
          school_system: bookingData.school_system,
          google_calendar_event_id: firstEvent?.eventId ?? null,
          google_calendar_link: firstEvent?.eventLink ?? null,
          admin_notes: extraLinks ? `All events:\n${extraLinks}` : null,
          status: 'confirmed'
        }]);

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      setSubmitStatus('success');

      // Reset
      setFormData({
        teacher_first_name: '',
        teacher_last_name: '',
        teacher_email: '',
        teacher_phone: '',
        school_name: '',
        school_address_line1: '',
        school_address_line2: '',
        school_city: '',
        school_province: '',
        school_postal_code: '',
        booking_date: null,
        number_of_students: 0,
        grade_level: '',
        preferred_coach: '',
        special_requirements: '',
        school_system: undefined
      });
      setAvailableTimeSlots([]);
      setSelectedSlots([]);

    } catch (error: any) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
      setErrorMessage(error?.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto" id="booking-form">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">Location</h3>
            <p className="text-green-700">Zion Lutheran Church<br />323 4th Avenue South, Saskatoon, SK</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-green-800">Rate</h3>
            <p className="text-green-700">${HOURLY_RATE} per hour</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Type */}
        <Card>
          <CardHeader><CardTitle className="text-lg">School Type</CardTitle></CardHeader>
          <CardContent>
            <div>
              <Label>School System *</Label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Saskatoon Public', 'Catholic', 'Other'].map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={formData.school_system === opt ? 'default' : 'outline'}
                    onClick={() => handleInputChange('school_system', opt)}
                    className="justify-start"
                  >
                    {formData.school_system === opt && <Check className="h-4 w-4 mr-2" />}
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Availability</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Date */}
            <div className="space-y-2">
              <Label>Select Date *</Label>
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  type="button"
                  id="date-picker-button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.booking_date ? format(formData.booking_date, 'PPP') : 'Pick a date'}
                </Button>
                {isCalendarOpen && (
                  <>
                    <div className="fixed inset-0 z-[99] bg-black bg-opacity-20" onClick={() => setIsCalendarOpen(false)} />
                    <div className="calendar-container absolute z-[100] bg-white border border-gray-300 rounded-lg shadow-xl p-3 mt-1" style={{ top: 'calc(100% + 4px)', left: 0, right: 0, maxWidth: '320px' }}>
                      <Calendar
                        mode="single"
                        selected={formData.booking_date || undefined}
                        onSelect={(date) => { if (date) { handleInputChange('booking_date', date); setTimeout(() => setIsCalendarOpen(false), 150); } }}
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Time slots: multi-select */}
            {formData.booking_date && (
              <div>
                <Label>Available Time Slots *</Label>
                {isLoadingSlots ? (
                  <div className="flex items-center space-x-2 p-4 border rounded-md">
                    <Clock className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-gray-600">Loading available slots...</span>
                  </div>
                ) : availableTimeSlots.length > 0 ? (
                  <div className="time-slot-container grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableTimeSlots.map((slot, index) => {
                      const selected = selectedSlots.some(s => s.time === slot.time);
                      return (
                        <button
                          key={`${slot.time}-${index}`}
                          type="button"
                          className={`w-full text-left px-4 py-2 border rounded-md ${!slot.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'} ${selected ? 'ring-2 ring-green-500' : ''}`}
                          disabled={!slot.available}
                          onClick={() => {
                            if (!slot.available) return;
                            setSelectedSlots(prev => {
                              const exists = prev.some(s => s.time === slot.time);
                              if (exists) return prev.filter(s => s.time !== slot.time);
                              return [...prev, slot].sort((a, b) => a.time.localeCompare(b.time));
                            });
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{slot.display}</span>
                            {!slot.available ? <Badge variant="secondary">Booked</Badge> : selected ? <Badge>Selected</Badge> : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800">No available time slots found for this date.</p>
                    <p className="text-sm text-yellow-700">Please try a different date.</p>
                  </div>
                )}
              </div>
            )}

            {/* Totals */}
            <div className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="text-sm text-gray-600">Total Minutes</div>
                <div className="font-semibold">{totalMinutes}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Cost</div>
                <div className="font-semibold">${totalCost.toFixed(2)}</div>
              </div>
            </div>

            {/* Students / Grade / Pref Coach / Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number_of_students">Number of Students *</Label>
                <Input id="number_of_students" type="number" min="1" value={formData.number_of_students} onChange={(e) => handleInputChange('number_of_students', parseInt(e.target.value) || 0)} required />
              </div>
              <div>
                <Label htmlFor="grade_level">Grade Level</Label>
                <Input id="grade_level" placeholder="e.g., Grade 3-5" value={formData.grade_level} onChange={(e) => handleInputChange('grade_level', e.target.value)} />
              </div>
            </div>

            {/*
<div>
  <label className="block text-sm font-medium">Preferred Coach</label>
  <input
    type="text"
    name="preferred_coach"
    value={formData.preferred_coach}
    onChange={handleChange}
    className="mt-1 block w-full border-gray-300 rounded-md"
  />
</div>
*/}

            {/*
<div>
  <label className="block text-sm font-medium">Special Requirements</label>
  <textarea
    name="special_requirements"
    value={formData.special_requirements}
    onChange={handleChange}
    className="mt-1 block w-full border-gray-300 rounded-md"
  />
</div>
*/}

          </CardContent>
        </Card>

        {/* School Information */}
        <Card>
          <CardHeader><CardTitle className="text-lg">School Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="school_name">School Name *</Label>
              <Input id="school_name" value={formData.school_name} onChange={(e) => handleInputChange('school_name', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="school_address_line1">Address Line 1 *</Label>
              <Input id="school_address_line1" value={formData.school_address_line1} onChange={(e) => handleInputChange('school_address_line1', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="school_address_line2">Address Line 2</Label>
              <Input id="school_address_line2" value={formData.school_address_line2} onChange={(e) => handleInputChange('school_address_line2', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="school_city">City *</Label>
                <Input id="school_city" value={formData.school_city} onChange={(e) => handleInputChange('school_city', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="school_province">Province *</Label>
                <Input id="school_province" value={formData.school_province} onChange={(e) => handleInputChange('school_province', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="school_postal_code">Postal Code *</Label>
                <Input id="school_postal_code" value={formData.school_postal_code} onChange={(e) => handleInputChange('school_postal_code', e.target.value)} required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Info */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Teacher Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacher_first_name">First Name *</Label>
                <Input id="teacher_first_name" value={formData.teacher_first_name} onChange={(e) => handleInputChange('teacher_first_name', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="teacher_last_name">Last Name *</Label>
                <Input id="teacher_last_name" value={formData.teacher_last_name} onChange={(e) => handleInputChange('teacher_last_name', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacher_email">Email Address *</Label>
                <Input id="teacher_email" type="email" value={formData.teacher_email} onChange={(e) => handleInputChange('teacher_email', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="teacher_phone">Phone Number *</Label>
                <Input id="teacher_phone" type="tel" value={formData.teacher_phone} onChange={(e) => handleInputChange('teacher_phone', e.target.value)} required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="text-center">
          <Button
            type="submit"
            className="w-full md:w-auto px-8 py-3 text-lg"
            disabled={isSubmitting || !formData.booking_date || selectedSlots.length === 0}
          >
            {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
          </Button>
        </div>

        {/* Status */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">✅ Booking confirmed!</p>

          </div>
        )}
        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Booking failed</p>
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SPEDBookingForm;
