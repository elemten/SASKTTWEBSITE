// TypeScript types for all_members table
export interface Member {
  id: string;
  name: string;
  mem_number: string;
  email: string;
  phone?: string;
  address?: string;
  community?: string;
  link?: string;
  type?: string;
  birthdate?: string;
  age?: number;
  gender?: 'M' | 'F';
  district?: string;
  club?: string;
  guardian_name_phone?: string;
  guardian_email?: string;
  notes?: string;
  er?: string;
  provincial_paid_year?: number;
  provincial_expiry_date?: string;
  is_active_member?: boolean;
  created_at?: string;
  updated_at?: string;
  current_membership_status?: 'active' | 'inactive' | 'expired' | 'pending';
  last_payment_date?: string;
  membership_expires_at?: string;
}

// For creating new members
export interface CreateMemberData {
  name: string;
  mem_number: string;
  email: string;
  phone?: string;
  address?: string;
  community?: string;
  type?: string;
  birthdate?: string;
  gender?: 'M' | 'F';
  district?: string;
  club?: string;
  guardian_name_phone?: string;
  guardian_email?: string;
  notes?: string;
  current_membership_status?: 'active' | 'inactive' | 'expired' | 'pending';
}

// For member analytics
export interface MemberAnalytics {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  pendingMembers: number;
  membersByStatus: {
    active: number;
    inactive: number;
    expired: number;
    pending: number;
  };
  membersByClub: Array<{
    club: string;
    count: number;
  }>;
  membersByDistrict: Array<{
    district: string;
    count: number;
  }>;
  recentJoins: number; // Members joined in last 30 days
  expiringThisMonth: number;
}

// Search and filter options
export interface MemberFilters {
  status?: string;
  club?: string;
  district?: string;
  search?: string;
  page?: number;
  limit?: number;
}
