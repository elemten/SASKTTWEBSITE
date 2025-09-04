import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface BookingFormData {
  teacher_first_name: string;
  teacher_last_name: string;
  teacher_email: string;
  teacher_phone: string;
  school_name: string;
  school_address_line1: string;
  school_address_line2?: string;
  school_city: string;
  school_province: string;
  school_postal_code: string;
  booking_date: Date | null;
  booking_time: string;
  number_of_sessions: number;
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

const SPEDBookingForm: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
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
    number_of_sessions: 1,
    number_of_students: 0,
    grade_level: '',
    preferred_coach: '',
    special_requirements: ''
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [totalCost, setTotalCost] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);
  const [timeSlotPosition, setTimeSlotPosition] = useState({ top: 0, left: 0 });

  // Calculate total cost when sessions change
  useEffect(() => {
    const cost = formData.number_of_sessions * 95; // $95 per hour
    setTotalCost(cost);
  }, [formData.number_of_sessions]);

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (formData.booking_date) {
      fetchAvailableTimeSlots(formData.booking_date);
    }
  }, [formData.booking_date]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isCalendarOpen && !target.closest('#date-picker-button') && !target.closest('.calendar-container')) {
        setIsCalendarOpen(false);
      }
      if (isTimeSlotOpen && !target.closest('#time-slot-button') && !target.closest('.time-slot-container')) {
        setIsTimeSlotOpen(false);
      }
    };

    if (isCalendarOpen || isTimeSlotOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCalendarOpen, isTimeSlotOpen]);

  const fetchAvailableTimeSlots = async (date: Date) => {
    console.log('Fetching time slots for date:', format(date, 'yyyy-MM-dd'));
    setIsLoadingSlots(true);
    try {
      // Call Supabase Edge Function for Google Calendar integration
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'getSlots',
          date: format(date, 'yyyy-MM-dd')
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Error fetching time slots:', error);
        const defaultSlots = getDefaultTimeSlots(date);
        console.log('Using default slots:', defaultSlots);
        setAvailableTimeSlots(defaultSlots);
      } else {
        console.log('Setting time slots from API:', data.slots);
        setAvailableTimeSlots(data.slots || []);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      // Fallback to predefined slots
      const defaultSlots = getDefaultTimeSlots(date);
      console.log('Using default slots (catch):', defaultSlots);
      setAvailableTimeSlots(defaultSlots);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const getDefaultTimeSlots = (date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const slots: TimeSlot[] = [];

    // Monday: 11am-12pm (1 hour)
    if (dayOfWeek === 1) {
      slots.push({ time: '11:00-12:00', display: '11:00 AM - 12:00 PM (1 hour)', available: true });
    }
    // Tuesday-Thursday: 11am-1:45pm (2.75 hours) - multiple slots
    else if (dayOfWeek >= 2 && dayOfWeek <= 4) {
      slots.push({ time: '11:00-12:30', display: '11:00 AM - 12:30 PM (1.5 hours)', available: true });
      slots.push({ time: '12:30-14:00', display: '12:30 PM - 2:00 PM (1.5 hours)', available: true });
      slots.push({ time: '11:00-13:45', display: '11:00 AM - 1:45 PM (2.75 hours)', available: true });
    }
    // Friday: 11am-4pm (5 hours) - multiple slots
    else if (dayOfWeek === 5) {
      slots.push({ time: '11:00-12:30', display: '11:00 AM - 12:30 PM (1.5 hours)', available: true });
      slots.push({ time: '12:30-14:00', display: '12:30 PM - 2:00 PM (1.5 hours)', available: true });
      slots.push({ time: '14:00-15:30', display: '2:00 PM - 3:30 PM (1.5 hours)', available: true });
      slots.push({ time: '15:30-17:00', display: '3:30 PM - 5:00 PM (1.5 hours)', available: true });
      slots.push({ time: '11:00-16:00', display: '11:00 AM - 4:00 PM (5 hours)', available: true });
    }

    return slots;
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalendarOpen = () => {
    const button = document.getElementById('date-picker-button');
    if (button) {
      const rect = button.getBoundingClientRect();
      setCalendarPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
    setIsCalendarOpen(true);
  };

  const handleTimeSlotOpen = () => {
    const button = document.getElementById('time-slot-button');
    if (button) {
      const rect = button.getBoundingClientRect();
      setTimeSlotPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
    setIsTimeSlotOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (!formData.booking_date || !formData.booking_time) {
        throw new Error('Please select a date and time slot');
      }

      // Create booking data
      const bookingData = {
        ...formData,
        booking_date: formData.booking_date.toISOString().split('T')[0],
        booking_time_start: formData.booking_time + ':00',
        booking_time_end: (parseInt(formData.booking_time.split(':')[0]) + 1).toString().padStart(2, '0') + ':00:00',
        rate_per_hour: 95.00,
        total_cost: totalCost,
        status: 'confirmed'
      };

      // Submit to Supabase
      const { data, error } = await supabase
        .from('confirmed_bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        setSubmitStatus('error');
        return;
      }

      // Create Google Calendar event using Supabase Edge Function
      const { data: calendarData, error: calendarError } = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'bookSlot',
          booking: {
            id: data.id,
            ...bookingData
          }
        }
      });

      if (calendarError) {
        console.error('Error creating calendar event:', calendarError);
      } else if (calendarData?.eventId) {
        // Update booking with Google Calendar event ID
        await supabase
          .from('confirmed_bookings')
          .update({
            google_calendar_event_id: calendarData.eventId,
            google_calendar_link: calendarData.eventLink
          })
          .eq('id', data.id);
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
        number_of_sessions: 1,
        number_of_students: 0,
        grade_level: '',
        preferred_coach: '',
        special_requirements: ''
      });
      setAvailableTimeSlots([]);

    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Your SPED Session</h2>
        <p className="text-gray-600">Complete the form below to book your Special Physical Education table tennis session</p>
      </div>

      {/* Location & Rate Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Location</h3>
              <p className="text-green-700 text-sm">Zion Lutheran Church<br />323 4th Avenue South<br />Saskatoon, SK</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Rate</h3>
              <p className="text-green-700 text-sm">$95 per hour</p>
              {totalCost > 0 && (
                <p className="text-green-800 font-bold">Total: ${totalCost}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Teacher Information */}
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

        {/* School Information */}
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

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Selection */}
            <div className="relative">
              <Label>Select Date *</Label>
              <div>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  type="button"
                  id="date-picker-button"
                  onClick={handleCalendarOpen}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.booking_date ? format(formData.booking_date, 'PPP') : 'Pick a date'}
                </Button>
                
                {isCalendarOpen && (
                  <div 
                    className="calendar-container fixed z-[100] bg-white border border-gray-200 rounded-md shadow-lg p-0"
                    style={{
                      top: `${calendarPosition.top}px`,
                      left: `${calendarPosition.left}px`
                    }}
                  >
                    <Calendar
                      mode="single"
                      selected={formData.booking_date || undefined}
                      onSelect={(date) => {
                        if (date) {
                          handleInputChange('booking_date', date);
                          setIsCalendarOpen(false);
                        }
                      }}
                      disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    />
                  </div>
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
                  <div>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                      id="time-slot-button"
                      onClick={handleTimeSlotOpen}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {formData.booking_time ? 
                        availableTimeSlots.find(slot => slot.time === formData.booking_time)?.display || 'Select a time slot' 
                        : 'Select a time slot'
                      }
                    </Button>
                    
                    {isTimeSlotOpen && (
                      <div 
                        className="time-slot-container fixed z-[100] bg-white border border-gray-200 rounded-md shadow-lg p-0 min-w-[300px]"
                        style={{
                          top: `${timeSlotPosition.top}px`,
                          left: `${timeSlotPosition.left}px`
                        }}
                      >
                        <div className="max-h-60 overflow-y-auto">
                          {availableTimeSlots.map((slot) => (
                            <button
                              key={slot.time}
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
                <Label htmlFor="number_of_sessions">Number of Sessions *</Label>
                <Select value={formData.number_of_sessions.toString()} onValueChange={(value) => handleInputChange('number_of_sessions', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Session</SelectItem>
                    <SelectItem value="2">2 Sessions</SelectItem>
                    <SelectItem value="3">3 Sessions</SelectItem>
                    <SelectItem value="4">4 Sessions</SelectItem>
                    <SelectItem value="5">5 Sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade_level">Grade Level</Label>
                <Input
                  id="grade_level"
                  placeholder="e.g., Grade 3-5"
                  value={formData.grade_level}
                  onChange={(e) => handleInputChange('grade_level', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="preferred_coach">Preferred Coach</Label>
                <Input
                  id="preferred_coach"
                  placeholder="Coach name (optional)"
                  value={formData.preferred_coach}
                  onChange={(e) => handleInputChange('preferred_coach', e.target.value)}
                />
              </div>
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
            <p className="text-green-800 font-medium">Booking Confirmed!</p>
            <p className="text-green-700">You will receive a confirmation email shortly.</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Booking Failed</p>
            <p className="text-red-700">Please try again or contact us for assistance.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SPEDBookingForm;