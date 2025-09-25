import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { membersService } from "@/lib/services/members";
import { validateEmail, validatePhone, validateRequired, formatPhone } from "@/lib/validation";
import type { Member, CreateMemberData } from "@/lib/types/members";

interface AddMemberFormProps {
  clubs: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface EditMemberFormProps {
  member: Member;
  clubs: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddMemberForm({ clubs, onSuccess, onCancel }: AddMemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [membershipNumber, setMembershipNumber] = useState("");
  const [formData, setFormData] = useState<CreateMemberData>({
    name: "",
    mem_number: "",
    email: "",
    phone: "",
    address: "",
    community: "",
    type: "",
    birthdate: "",
    gender: undefined,
    district: "",
    club: "",
    guardian_name_phone: "",
    guardian_email: "",
    notes: "",
    current_membership_status: "inactive"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Generate membership number when form opens
  useEffect(() => {
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
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    const nameValidation = validateRequired(formData.name, "Name");
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message!;
    }

    const emailValidation = validateEmail(formData.email);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Format phone number before saving
      const dataToSave = {
        ...formData,
        phone: formData.phone ? formatPhone(formData.phone) : undefined,
        age: formData.birthdate ? calculateAge(formData.birthdate) : undefined,
        // Handle empty date fields - convert empty strings to null for PostgreSQL
        birthdate: formData.birthdate || null
      };

      const { data, error } = await membersService.createMember(dataToSave);

      if (error) {
        throw new Error(error.message || 'Failed to create member');
      }

      toast({
        title: "Success",
        description: `Member ${formData.name} created successfully with number ${membershipNumber}`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create member",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const handleInputChange = (field: keyof CreateMemberData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Membership Number (Hidden from user) */}
      <input type="hidden" value={membershipNumber} />
      
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
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
            value={formData.email}
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
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(306) 555-0123"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="club">Club</Label>
          <Select value={formData.club} onValueChange={(value) => handleInputChange('club', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select club" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map(club => (
                <SelectItem key={club} value={club}>{club}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Membership Status</Label>
          <Select 
            value={formData.current_membership_status} 
            onValueChange={(value) => handleInputChange('current_membership_status', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value as 'M' | 'F')}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthdate">Birth Date</Label>
          <Input
            id="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={(e) => handleInputChange('birthdate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            placeholder="Enter district"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community">Community</Label>
          <Input
            id="community"
            value={formData.community}
            onChange={(e) => handleInputChange('community', e.target.value)}
            placeholder="Enter community"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Member Type</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            placeholder="e.g., Regular, Student, Senior"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter full address"
        />
      </div>

      {/* Guardian Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Guardian Information (if applicable)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardian_name_phone">Guardian Name & Phone</Label>
            <Input
              id="guardian_name_phone"
              value={formData.guardian_name_phone}
              onChange={(e) => handleInputChange('guardian_name_phone', e.target.value)}
              placeholder="Guardian name and phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian_email">Guardian Email</Label>
            <Input
              id="guardian_email"
              type="email"
              value={formData.guardian_email}
              onChange={(e) => handleInputChange('guardian_email', e.target.value)}
              placeholder="Guardian email address"
              className={errors.guardian_email ? "border-red-500" : ""}
            />
            {errors.guardian_email && <p className="text-sm text-red-500">{errors.guardian_email}</p>}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any additional notes about this member"
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {loading ? "Creating Member..." : "Create Member"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function EditMemberForm({ member, clubs, onSuccess, onCancel }: EditMemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({
    ...member,
    birthdate: member.birthdate ? member.birthdate.split('T')[0] : '',
    membership_expires_at: member.membership_expires_at ? member.membership_expires_at.split('T')[0] : '',
    last_payment_date: member.last_payment_date ? member.last_payment_date.split('T')[0] : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Format phone number before saving and calculate age if birthdate changed
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

      const { data, error } = await membersService.updateMember(member.id, dataToSave);

      if (error) {
        throw new Error(error.message || 'Failed to update member');
      }

      toast({
        title: "Success",
        description: `Member ${formData.name} updated successfully`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update member",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const handleInputChange = (field: keyof Member, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Membership Number (Read-only) */}
      <div className="space-y-2">
        <Label>Membership Number</Label>
        <Input
          value={member.mem_number}
          disabled
          className="bg-gray-100"
        />
        <p className="text-xs text-muted-foreground">Membership number cannot be changed</p>
      </div>
      
      {/* Basic Information */}
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
          <Label htmlFor="club">Club</Label>
          <Select value={formData.club || ''} onValueChange={(value) => handleInputChange('club', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select club" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map(club => (
                <SelectItem key={club} value={club}>{club}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Membership Status</Label>
          <Select 
            value={formData.current_membership_status || ''} 
            onValueChange={(value) => handleInputChange('current_membership_status', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender || ''} onValueChange={(value) => handleInputChange('gender', value as 'M' | 'F')}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
            </SelectContent>
          </Select>
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
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={formData.district || ''}
            onChange={(e) => handleInputChange('district', e.target.value)}
            placeholder="Enter district"
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

        <div className="space-y-2">
          <Label htmlFor="type">Member Type</Label>
          <Input
            id="type"
            value={formData.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            placeholder="e.g., Regular, Student, Senior"
          />
        </div>

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
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter full address"
        />
      </div>

      {/* Guardian Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Guardian Information (if applicable)</h3>
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
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any additional notes about this member"
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {loading ? "Updating Member..." : "Update Member"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
