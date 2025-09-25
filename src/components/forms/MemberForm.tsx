import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Calendar, Users, FileText, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "@/components/ui/simple-select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { membersService } from "@/lib/services/members";
import { validateEmail, validatePhone, validateRequired, formatPhone } from "@/lib/validation";
import type { Member, CreateMemberData } from "@/lib/types/members";

interface MemberFormProps {
  mode: 'create' | 'edit';
  member?: Member;
  isPublic?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  showBackButton?: boolean;
  title?: string;
  description?: string;
}

export function MemberForm({ 
  mode, 
  member, 
  isPublic = false, 
  onSuccess, 
  onCancel,
  showBackButton = true,
  title,
  description
}: MemberFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [membershipNumber, setMembershipNumber] = useState("");
  const [clubs, setClubs] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Memoize static districts list for performance
  const districts = useMemo(() => membersService.getAllDistricts(), []);

  // Initialize form data based on mode
  const [formData, setFormData] = useState<CreateMemberData | Partial<Member>>(() => {
    if (mode === 'edit' && member) {
      return {
        ...member,
        birthdate: member.birthdate ? member.birthdate.split('T')[0] : '',
        membership_expires_at: member.membership_expires_at ? member.membership_expires_at.split('T')[0] : '',
        last_payment_date: member.last_payment_date ? member.last_payment_date.split('T')[0] : '',
      };
    }
    return {
      name: "",
      mem_number: "",
      email: "",
      phone: "",
      address: "",
      community: "",
      type: isPublic ? "Regular" : "",
      birthdate: "",
      gender: undefined,
      district: "",
      club: "",
      guardian_name_phone: "",
      guardian_email: "",
      notes: "",
      current_membership_status: isPublic ? "pending" : "inactive"
    };
  });

  // Generate membership number for create mode (admin only)
  useEffect(() => {
    if (mode === 'create' && !isPublic) {
      const generateNumber = async () => {
        try {
          const number = await membersService.generateMembershipNumber();
          setMembershipNumber(number);
          setFormData(prev => ({ ...prev, mem_number: number }));
        } catch (error) {
          console.error('Error generating membership number:', error);
          toast({
            title: "Error",
            description: "Failed to generate membership number",
            variant: "destructive"
          });
        }
      };
      generateNumber();
    }
  }, [mode, isPublic]);

  // Load clubs for dropdown (memoized to prevent unnecessary calls)
  useEffect(() => {
    let isMounted = true;
    
    const loadClubs = async () => {
      try {
        const { data, error } = await membersService.getClubs();
        if (!error && isMounted) {
          setClubs(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading clubs:', error);
        }
      }
    };
    
    loadClubs();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    const nameValidation = validateRequired(formData.name || '', "Name");
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message!;
    }

    const emailValidation = validateEmail(formData.email || '');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message!;
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.message!;
      }
    }

    // Guardian email validation (optional but must be valid if provided)
    if (formData.guardian_email) {
      const guardianEmailValidation = validateEmail(formData.guardian_email);
      if (!guardianEmailValidation.isValid) {
        newErrors.guardian_email = guardianEmailValidation.message!;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        phone: formData.phone ? formatPhone(formData.phone) : formData.phone,
        age: formData.birthdate ? calculateAge(formData.birthdate) : formData.age,
        // Handle empty date fields - convert empty strings to null for PostgreSQL
        birthdate: formData.birthdate || null,
        membership_expires_at: formData.membership_expires_at || null,
        last_payment_date: formData.last_payment_date || null,
        provincial_expiry_date: formData.provincial_expiry_date || null
      };

      let result;
      if (mode === 'create') {
        result = await membersService.createMember(dataToSave as CreateMemberData);
      } else {
        result = await membersService.updateMember(member!.id, dataToSave);
      }

      if (result.error) {
        throw new Error(result.error.message || `Failed to ${mode} member`);
      }

      toast({
        title: "Success",
        description: mode === 'create' 
          ? `Member ${formData.name} created successfully${membershipNumber ? ` with number ${membershipNumber}` : ''}` 
          : `Member ${formData.name} updated successfully`,
      });

      if (onSuccess) {
        onSuccess();
      } else if (isPublic) {
        navigate('/membership-success');
      } else {
        navigate('/admin/members');
      }
    } catch (error) {
      console.error(`Error ${mode}ing member:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} member`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Memoize input change handler to prevent unnecessary re-renders
  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else if (isPublic) {
      navigate('/membership');
    } else {
      navigate('/admin/members');
    }
  };

  const defaultTitle = mode === 'create' 
    ? (isPublic ? 'Join Table Tennis Saskatchewan' : 'Add New Member')
    : `Edit Member: ${member?.name}`;

  const defaultDescription = mode === 'create'
    ? (isPublic ? 'Complete your membership registration to join our community' : 'Create a new member account with auto-generated membership number')
    : 'Update member information and settings';

  // Animation variants for smooth transitions
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className={`min-h-screen ${isPublic ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50' : 'bg-gradient-to-br from-gray-50 to-green-50'} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            {showBackButton && (
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="hover:bg-green-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {!isPublic && (
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
                <img
                  src="/logo.png"
                  alt="Table Tennis Saskatchewan"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title || defaultTitle}
          </h1>
          <p className="text-gray-600">
            {description || defaultDescription}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Personal Information */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Membership Number (Admin only, display only) */}
              {!isPublic && mode === 'edit' && member && (
                <div className="space-y-2">
                  <Label>Membership Number</Label>
                  <Input
                    value={member.mem_number}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground">Membership number cannot be changed</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(306) 555-0123"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate">Birth Date</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={formData.birthdate || ''}
                    onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <SimpleSelect
                    value={formData.gender || ''}
                    onValueChange={(value) => handleInputChange('gender', value as 'M' | 'F')}
                    placeholder="Select gender"
                    options={[
                      { value: 'M', label: 'Male' },
                      { value: 'F', label: 'Female' }
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Member Type</Label>
                  <SimpleSelect
                    value={formData.type || ''}
                    onValueChange={(value) => handleInputChange('type', value)}
                    placeholder="Select member type"
                    options={[
                      { value: 'Regular', label: 'Regular' },
                      { value: 'Student', label: 'Student' },
                      { value: 'Senior', label: 'Senior (65+)' },
                      { value: 'Junior', label: 'Junior (Under 18)' },
                      { value: 'Family', label: 'Family' }
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter full address"
                />
              </div>
            </CardContent>
            </Card>
          </motion.div>

          {/* Club & Location Information */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Club & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="club">Preferred Club</Label>
                  <SimpleSelect
                    value={formData.club || ''}
                    onValueChange={(value) => handleInputChange('club', value === 'none' ? '' : value)}
                    placeholder="Select club"
                    options={[
                      { value: 'none', label: 'None' },
                      ...clubs.map(club => ({ value: club, label: club }))
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <SimpleSelect
                    value={formData.district || ''}
                    onValueChange={(value) => handleInputChange('district', value === 'none' ? '' : value)}
                    placeholder="Select district"
                    options={[
                      { value: 'none', label: 'None' },
                      ...districts.map(district => ({ value: district, label: district }))
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community">Community</Label>
                  <Input
                    id="community"
                    value={formData.community || ''}
                    onChange={(e) => handleInputChange('community', e.target.value)}
                    placeholder="Enter community"
                  />
                </div>

                {/* Admin-only status field */}
                {!isPublic && (
                  <div className="space-y-2">
                    <Label htmlFor="status">Membership Status</Label>
                    <SimpleSelect
                      value={formData.current_membership_status || ''}
                      onValueChange={(value) => handleInputChange('current_membership_status', value)}
                      placeholder="Select status"
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'expired', label: 'Expired' }
                      ]}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            </Card>
          </motion.div>

          {/* Guardian Information (for minors) */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Guardian Information
                  <span className="text-sm font-normal text-gray-500">(if under 18)</span>
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guardian_name_phone">Guardian Name & Phone</Label>
                  <Input
                    id="guardian_name_phone"
                    value={formData.guardian_name_phone || ''}
                    onChange={(e) => handleInputChange('guardian_name_phone', e.target.value)}
                    placeholder="Guardian name and phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardian_email">Guardian Email</Label>
                  <Input
                    id="guardian_email"
                    type="email"
                    value={formData.guardian_email || ''}
                    onChange={(e) => handleInputChange('guardian_email', e.target.value)}
                    placeholder="Guardian email address"
                    className={errors.guardian_email ? "border-red-500" : ""}
                  />
                  {errors.guardian_email && <p className="text-sm text-red-500">{errors.guardian_email}</p>}
                </div>
              </div>
            </CardContent>
            </Card>
          </motion.div>

          {/* Admin-only fields */}
          {!isPublic && (
            <motion.div variants={cardVariants}>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Membership Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="membership_expires_at">Membership Expires</Label>
                    <Input
                      id="membership_expires_at"
                      type="date"
                      value={formData.membership_expires_at || ''}
                      onChange={(e) => handleInputChange('membership_expires_at', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_payment_date">Last Payment Date</Label>
                    <Input
                      id="last_payment_date"
                      type="date"
                      value={formData.last_payment_date || ''}
                      onChange={(e) => handleInputChange('last_payment_date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provincial_paid_year">Provincial Year</Label>
                    <Input
                      id="provincial_paid_year"
                      type="number"
                      value={formData.provincial_paid_year || ''}
                      onChange={(e) => handleInputChange('provincial_paid_year', parseInt(e.target.value) || undefined)}
                      placeholder="2024"
                    />
                  </div>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notes */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes {!isPublic && '(Admin Only)'}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={isPublic ? "Any additional information or special requests" : "Any additional notes about this member"}
                  rows={3}
                />
              </div>
            </CardContent>
            </Card>
          </motion.div>

          {/* Form Actions */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {mode === 'create' ? (isPublic ? 'Complete Registration' : 'Create Member') : 'Update Member'}
                    </div>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={loading}
                  size="lg"
                  className="flex-1 sm:flex-initial"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
            </Card>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
