// Form validation utilities

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid length (10 digits for North American numbers)
  if (cleanPhone.length !== 10) {
    return { isValid: false, message: 'Please enter a valid 10-digit phone number' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): { isValid: boolean; message?: string } => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

export const formatPhone = (phone: string): string => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  }
  
  return phone; // Return as-is if not 10 digits
};
