import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { createClient } from '@supabase/supabase-js';

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
  booking_time: string;
  number_of_students: number;
  grade_level?: string;
  preferred_coach?: string;
  special_requirements?: string;
}

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

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
    booking_time: '',
    number_of_students: 0,
    grade_level: '',
    preferred_coach: '',
    special_requirements: '',
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  // Calendar and time slot dropdown states
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);

  // Calculate total cost (fixed at $95 for single session)
  useEffect(() => {
    setTotalCost(95); // $95 per session
  }, []);

  // Calculate end time based on selected time slot
  const calculateEndTime = (startTime: string): string => {
    const time = startTime.split(':');
    const hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);
    
    // Determine duration based on time slot
    let durationHours = 1; // Default 1 hour
    
    if (startTime === '11:00' && minutes === 0) {
      // Check if it's a 1.5 hour slot (11:00-12:30) or 2.75 hour slot (11:00-1:45) or 5 hour slot (11:00-4:00)
      const selectedSlot = availableTimeSlots.find(slot => slot.time === startTime);
      if (selectedSlot?.display.includes('1.5 hours')) {
        durationHours = 1.5;
      } else if (selectedSlot?.display.includes('2.75 hours')) {
        durationHours = 2.75;
      } else if (selectedSlot?.display.includes('5 hours')) {
        durationHours = 5;
      }
    } else if (startTime === '12:30') {
      durationHours = 1.5; // 12:30-2:00
    } else if (startTime === '14:00') {
      durationHours = 1.5; // 2:00-3:30
    } else if (startTime === '15:30') {
      durationHours = 1.5; // 3:30-5:00
    }
    
    // Calculate end time
    const totalMinutes = hours * 60 + minutes + (durationHours * 60);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;
  };

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (formData.booking_date) {
      fetchAvailableTimeSlots(formData.booking_date);
    }
  }, [formData.booking_date]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (!target.closest('.calendar-container') && !target.closest('#date-picker-button')) {
        setIsCalendarOpen(false);
      }
      
      if (!target.closest('.time-slot-container') && !target.closest('#time-slot-button')) {
        setIsTimeSlotOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchAvailableTimeSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase.functions.invoke('google-calendar-function', {
        body: {
          action: 'getSlots',
          date: date.toISOString().split('T')[0]
        }
      });

      if (error) {
        throw new Error(`Supabase function error: ${error.message}`);
      }

      if (data.success) {
        setAvailableTimeSlots(data.slots);
      } else {
        throw new Error(data.error || 'Failed to fetch time slots');
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      // Fallback to default slots
      setAvailableTimeSlots(getDefaultTimeSlots(date));
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const getDefaultTimeSlots = (date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay();
    const slots: TimeSlot[] = [];

    if (dayOfWeek === 1) { // Monday
      slots.push({ time: '11:00', display: '11:00 AM - 12:00 PM (1 hour)', available: true });
    } else if (dayOfWeek >= 2 && dayOfWeek <= 4) { // Tuesday-Thursday
      slots.push({ time: '11:00', display: '11:00 AM - 12:30 PM (1.5 hours)', available: true });
      slots.push({ time: '12:30', display: '12:30 PM - 2:00 PM (1.5 hours)', available: true });
      slots.push({ time: '11:00-2.75', display: '11:00 AM - 1:45 PM (2.75 hours)', available: true });
    } else if (dayOfWeek === 5) { // Friday
      slots.push({ time: '11:00', display: '11:00 AM - 12:30 PM (1.5 hours)', available: true });
      slots.push({ time: '12:30', display: '12:30 PM - 2:00 PM (1.5 hours)', available: true });
      slots.push({ time: '14:00', display: '2:00 PM - 3:30 PM (1.5 hours)', available: true });
      slots.push({ time: '15:30', display: '3:30 PM - 5:00 PM (1.5 hours)', available: true });
      slots.push({ time: '11:00-5', display: '11:00 AM - 4:00 PM (5 hours)', available: true });
    }

    return slots;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      if (!formData.booking_date || !formData.booking_time) {
        throw new Error('Please select a date and time slot');
      }

      const bookingData = {
        id: `booking_${Date.now()}`,
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
        booking_date: formData.booking_date.toISOString().split('T')[0],
        booking_time_start: formData.booking_time + ':00',
        booking_time_end: calculateEndTime(formData.booking_time),
        number_of_students: formData.number_of_students,
        grade_level: formData.grade_level,
        preferred_coach: formData.preferred_coach,
        special_requirements: formData.special_requirements,
        rate_per_hour: 95.00,
        total_cost: totalCost
      };

      // Create calendar event first
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data: calendarData, error: calendarError } = await supabase.functions.invoke('google-calendar-function', {
        body: {
          action: 'bookSlot',
          booking: bookingData
        }
      });

      if (calendarError) {
        throw new Error(`Calendar function error: ${calendarError.message}`);
      }

      if (!calendarData.success) {
        throw new Error(calendarData.error || 'Failed to create calendar event');
      }

      // Save to Supabase database

      const { error } = await supabase
        .from('confirmed_bookings')
        .insert([{
          id: bookingData.id,
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
          calendar_event_id: calendarData.eventId,
          calendar_event_link: calendarData.eventLink,
          status: 'confirmed',
          created_at: new Date().toISOString()
        }]);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      setSubmitStatus('success');
      
      // Reset form
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
        booking_time: '',
        number_of_students: 0,
        grade_level: '',
        preferred_coach: '',
        special_requirements: '',
      });
      setAvailableTimeSlots([]);

    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Location & Rate Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">Location</h3>
            <p className="text-green-700">Regina Table Tennis Club</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-green-800">Rate</h3>
            <p className="text-green-700">$95 per session</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Booking Details - MOVED TO TOP */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date *</Label>
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  type="button"
                  id="date-picker-button"
                  data-testid="date-picker-button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.booking_date ? format(formData.booking_date, 'PPP') : 'Pick a date'}
                </Button>
                
                {isCalendarOpen && (
                  <>
                    {/* Background overlay */}
                    <div 
                      className="fixed inset-0 z-[99] bg-black bg-opacity-20"
                      onClick={() => setIsCalendarOpen(false)}
                    />
                    {/* Calendar container - positioned absolutely below button */}
                    <div 
                      className="calendar-container absolute z-[100] bg-white border border-gray-300 rounded-lg shadow-xl p-3 mt-1"
                      style={{
                        top: 'calc(100% + 4px)',
                        left: '0',
                        right: '0',
                        maxWidth: '320px'
                      }}
                    >
                      <Calendar
                        mode="single"
                        selected={formData.booking_date || undefined}
                        onSelect={(date) => {
                          if (date) {
                            handleInputChange('booking_date', date);
                            // Brief delay to ensure state updates
                            setTimeout(() => {
                              setIsCalendarOpen(false);
                            }, 150);
                          }
                        }}
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Time Slot Selection */}
            {formData.booking_date && (
              <div>
                <Label>Available Time Slots *</Label>
                {isLoadingSlots ? (
                  <div className="flex items-center space-x-2 p-4 border rounded-md">
                    <Clock className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-gray-600">Loading available slots...</span>
                  </div>
                ) : availableTimeSlots.length > 0 ? (
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                      id="time-slot-button"
                      onClick={() => setIsTimeSlotOpen(!isTimeSlotOpen)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {formData.booking_time ? 
                        availableTimeSlots.find(slot => slot.time === formData.booking_time)?.display || 'Select a time slot' 
                        : 'Select a time slot'
                      }
                    </Button>
                    
                    {isTimeSlotOpen && (
                      <>
                        {/* Background overlay for mobile */}
                        <div 
                          className="fixed inset-0 z-[99] bg-black bg-opacity-20 md:hidden"
                          onClick={() => setIsTimeSlotOpen(false)}
                        />
                        {/* Time slot dropdown - positioned absolutely below button */}
                        <div 
                          className="time-slot-container absolute z-[100] bg-white border border-gray-300 rounded-lg shadow-xl p-0 mt-1"
                          style={{
                            top: 'calc(100% + 4px)',
                            left: '0',
                            right: '0',
                            maxWidth: '100%',
                            width: '100%'
                          }}
                        >
                          <div className="max-h-60 overflow-y-auto">
                            {availableTimeSlots.map((slot, index) => (
                              <button
                                key={`${slot.time}-${index}`}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                                  !slot.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                disabled={!slot.available}
                                onClick={() => {
                                  if (slot.available) {
                                    handleInputChange('booking_time', slot.time);
                                    setIsTimeSlotOpen(false);
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{slot.display}</span>
                                  {!slot.available && <Badge variant="secondary">Booked</Badge>}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800">No available time slots found for this date.</p>
                    <p className="text-sm text-yellow-700">Please try selecting a different date.</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number_of_students">Number of Students *</Label>
                <Input
                  id="number_of_students"
                  type="number"
                  min="1"
                  value={formData.number_of_students}
                  onChange={(e) => handleInputChange('number_of_students', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="grade_level">Grade Level</Label>
                <Input
                  id="grade_level"
                  placeholder="e.g., Grade 3-5"
                  value={formData.grade_level}
                  onChange={(e) => handleInputChange('grade_level', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="preferred_coach">Preferred Coach</Label>
              <Input
                id="preferred_coach"
                placeholder="Any specific coach preference"
                value={formData.preferred_coach}
                onChange={(e) => handleInputChange('preferred_coach', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="special_requirements">Special Requirements</Label>
              <Textarea
                id="special_requirements"
                placeholder="Any special requirements or notes"
                value={formData.special_requirements}
                onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* School Information - MOVED TO MIDDLE */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">School Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="school_name">School Name *</Label>
              <Input
                id="school_name"
                value={formData.school_name}
                onChange={(e) => handleInputChange('school_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="school_address_line1">Address Line 1 *</Label>
              <Input
                id="school_address_line1"
                value={formData.school_address_line1}
                onChange={(e) => handleInputChange('school_address_line1', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="school_address_line2">Address Line 2</Label>
              <Input
                id="school_address_line2"
                value={formData.school_address_line2}
                onChange={(e) => handleInputChange('school_address_line2', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="school_city">City *</Label>
                <Input
                  id="school_city"
                  value={formData.school_city}
                  onChange={(e) => handleInputChange('school_city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="school_province">Province *</Label>
                <Input
                  id="school_province"
                  value={formData.school_province}
                  onChange={(e) => handleInputChange('school_province', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="school_postal_code">Postal Code *</Label>
                <Input
                  id="school_postal_code"
                  value={formData.school_postal_code}
                  onChange={(e) => handleInputChange('school_postal_code', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Information - MOVED TO BOTTOM */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Teacher Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacher_first_name">First Name *</Label>
                <Input
                  id="teacher_first_name"
                  value={formData.teacher_first_name}
                  onChange={(e) => handleInputChange('teacher_first_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="teacher_last_name">Last Name *</Label>
                <Input
                  id="teacher_last_name"
                  value={formData.teacher_last_name}
                  onChange={(e) => handleInputChange('teacher_last_name', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacher_email">Email Address *</Label>
                <Input
                  id="teacher_email"
                  type="email"
                  value={formData.teacher_email}
                  onChange={(e) => handleInputChange('teacher_email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="teacher_phone">Phone Number *</Label>
                <Input
                  id="teacher_phone"
                  type="tel"
                  value={formData.teacher_phone}
                  onChange={(e) => handleInputChange('teacher_phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button 
            type="submit" 
            className="w-full md:w-auto px-8 py-3 text-lg" 
            disabled={isSubmitting || !formData.booking_date || !formData.booking_time}
          >
            {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
          </Button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">Booking confirmed successfully!</p>
            <p className="text-green-700 text-sm">You will receive a confirmation email shortly.</p>
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
