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
  school_address_line2: string;
  school_city: string;
  school_province: string;
  school_postal_code: string;
  booking_date: Date | null;
  booking_time: string;
  number_of_sessions: number;
  number_of_students: number;
  grade_level: string;
  preferred_coach: string;
  special_requirements: string;
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

    if (dayOfWeek === 1) { // Monday
      slots.push({ time: '11:00', display: '11:00 AM - 12:00 PM', available: true });
    } else if (dayOfWeek >= 2 && dayOfWeek <= 4) { // Tuesday-Thursday
      slots.push(
        { time: '11:00', display: '11:00 AM - 12:00 PM', available: true },
        { time: '12:00', display: '12:00 PM - 1:00 PM', available: true },
        { time: '13:00', display: '1:00 PM - 2:00 PM', available: true }
      );
    } else if (dayOfWeek === 5) { // Friday
      slots.push(
        { time: '11:00', display: '11:00 AM - 12:00 PM', available: true },
        { time: '12:00', display: '12:00 PM - 1:00 PM', available: true },
        { time: '13:00', display: '1:00 PM - 2:00 PM', available: true },
        { time: '14:00', display: '2:00 PM - 3:00 PM', available: true },
        { time: '15:00', display: '3:00 PM - 4:00 PM', available: true }
      );
    }

    return slots;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validate that the selected time slot is still available
      const selectedSlot = availableTimeSlots.find(slot => slot.time === formData.booking_time);
      if (!selectedSlot || !selectedSlot.available) {
        setSubmitStatus('error');
        return;
      }

      // Create booking data
      const bookingData = {
        ...formData,
        booking_date: formData.booking_date?.toISOString().split('T')[0],
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
    <div className="max-w-4xl mx-auto space-y-8" data-booking-form style={{ scrollBehavior: 'smooth' }}>
      {/* Location and Rate Information */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">Location</h3>
                <p className="text-green-700">Zion Lutheran Church<br />323 4th Avenue South<br />Saskatoon, SK</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">Rate</h3>
                <p className="text-green-700">$95 per hour</p>
                {totalCost > 0 && (
                  <p className="text-green-800 font-bold">Total: ${totalCost}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>SPED Class Booking Form</CardTitle>
          <CardDescription>
            Book your Special Physical Education table tennis sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Teacher Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Teacher Information</h3>
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
                  <Label htmlFor="teacher_phone">Phone *</Label>
                  <Input
                    id="teacher_phone"
                    type="tel"
                    value={formData.teacher_phone}
                    onChange={(e) => handleInputChange('teacher_phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* School Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">School Information</h3>
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
                  <Select value={formData.school_province} onValueChange={(value) => handleInputChange('school_province', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                    </SelectContent>
                  </Select>
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
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Booking Details</h3>
              
              {/* Date Selection */}
              <div>
                <Label>Select Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.booking_date ? format(formData.booking_date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4} avoidCollisions={true} sticky="always">
                    <Calendar
                      mode="single"
                      selected={formData.booking_date || undefined}
                      onSelect={(date) => {
                        console.log('Date selected:', date);
                        if (date) {
                          handleInputChange('booking_date', date);
                        }
                      }}
                      disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slot Selection */}
              {formData.booking_date && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <Label className="text-green-800 font-semibold">Available Time Slots *</Label>
                  {isLoadingSlots ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-4 w-4 animate-spin text-green-600" />
                      <span className="text-green-700">Loading available slots...</span>
                    </div>
                  ) : availableTimeSlots.length > 0 ? (
                    <div className="mt-2">
                      <Select value={formData.booking_time} onValueChange={(value) => {
                        console.log('Time slot selected:', value);
                        handleInputChange('booking_time', value);
                      }}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map((slot) => (
                            <SelectItem 
                              key={slot.time} 
                              value={slot.time}
                              disabled={!slot.available}
                            >
                              <div className="flex items-center space-x-2">
                                <span>{slot.display}</span>
                                {!slot.available && <Badge variant="secondary">Booked</Badge>}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-green-600 mt-2">
                        Found {availableTimeSlots.length} available time slots
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800">No available time slots found for this date.</p>
                      <p className="text-sm text-yellow-700">Please try selecting a different date.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    onChange={(e) => handleInputChange('number_of_students', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="grade_level">Grade Level</Label>
                  <Input
                    id="grade_level"
                    value={formData.grade_level}
                    onChange={(e) => handleInputChange('grade_level', e.target.value)}
                    placeholder="e.g., Grade 3-5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preferred_coach">Preferred Coach</Label>
                <Input
                  id="preferred_coach"
                  value={formData.preferred_coach}
                  onChange={(e) => handleInputChange('preferred_coach', e.target.value)}
                  placeholder="Coach name (optional)"
                />
              </div>

              <div>
                <Label htmlFor="special_requirements">Special Requirements</Label>
                <Textarea
                  id="special_requirements"
                  value={formData.special_requirements}
                  onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                  placeholder="Any special requirements or notes"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !formData.booking_date || !formData.booking_time}
            >
              {isSubmitting ? 'Creating Booking...' : `Confirm Booking - $${totalCost}`}
            </Button>

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
                <p className="text-red-700">There was an error creating your booking. Please try again.</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SPEDBookingForm;
