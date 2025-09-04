import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';

interface BookingFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code: string;
  sessions: string;
  students: string;
  grade?: string;
  preferred_times: string;
  notes?: string;
}

const SmartBookingForm: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    school: '',
    address_line1: '',
    address_line2: '',
    city: '',
    province: '',
    postal_code: '',
    sessions: '',
    students: '',
    grade: '',
    preferred_times: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('sped_submissions')
        .insert([{
          ...formData,
          status: 'pending'
        }]);

      if (error) {
        console.error('Error submitting form:', error);
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          school: '',
          address_line1: '',
          address_line2: '',
          city: '',
          province: '',
          postal_code: '',
          sessions: '',
          students: '',
          grade: '',
          preferred_times: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>SPED Program Registration</CardTitle>
        <CardDescription>
          Register for our Special Education Table Tennis Program
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          {/* School Information */}
          <div>
            <Label htmlFor="school">School/Organization *</Label>
            <Input
              id="school"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              required
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address_line1">Address Line 1 *</Label>
            <Input
              id="address_line1"
              value={formData.address_line1}
              onChange={(e) => handleInputChange('address_line1', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input
              id="address_line2"
              value={formData.address_line2}
              onChange={(e) => handleInputChange('address_line2', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="province">Province *</Label>
              <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
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
                  <SelectItem value="NS">Nova Scotia</SelectItem>
                  <SelectItem value="NB">New Brunswick</SelectItem>
                  <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                  <SelectItem value="PE">Prince Edward Island</SelectItem>
                  <SelectItem value="YT">Yukon</SelectItem>
                  <SelectItem value="NT">Northwest Territories</SelectItem>
                  <SelectItem value="NU">Nunavut</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Program Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessions">Number of Sessions *</Label>
              <Select value={formData.sessions} onValueChange={(value) => handleInputChange('sessions', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Session</SelectItem>
                  <SelectItem value="2">2 Sessions</SelectItem>
                  <SelectItem value="3">3 Sessions</SelectItem>
                  <SelectItem value="4">4 Sessions</SelectItem>
                  <SelectItem value="5">5 Sessions</SelectItem>
                  <SelectItem value="6">6 Sessions</SelectItem>
                  <SelectItem value="8">8 Sessions</SelectItem>
                  <SelectItem value="10">10 Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="students">Number of Students *</Label>
              <Input
                id="students"
                type="number"
                min="1"
                value={formData.students}
                onChange={(e) => handleInputChange('students', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="grade">Grade Level</Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              placeholder="e.g., Grade 3-5, High School, etc."
            />
          </div>

          <div>
            <Label htmlFor="preferred_times">Preferred Times *</Label>
            <Textarea
              id="preferred_times"
              value={formData.preferred_times}
              onChange={(e) => handleInputChange('preferred_times', e.target.value)}
              placeholder="Please specify your preferred dates and times for the sessions"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special requirements, accessibility needs, or additional information"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">Registration submitted successfully! We'll contact you soon.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">There was an error submitting your registration. Please try again.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SmartBookingForm;
