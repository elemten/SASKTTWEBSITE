import { supabase } from '../supabase';
import type { Member, CreateMemberData, MemberAnalytics, MemberFilters } from '../types/members';

export class MembersService {
  private tableName = 'all_members';

  // Generate unique membership number in format TTS-YYYY-###
  async generateMembershipNumber(): Promise<string> {
    try {
      const currentYear = new Date().getFullYear();
      const prefix = `TTS-${currentYear}-`;
      
      // Get the highest existing number for this year
      const { data, error } = await supabase
        .from(this.tableName)
        .select('mem_number')
        .like('mem_number', `${prefix}%`)
        .order('mem_number', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error getting last membership number:', error);
        // Fallback to 001 if we can't query
        return `${prefix}001`;
      }

      let nextNumber = 1;
      if (data && data.length > 0) {
        // Extract the number part from the last membership number
        const lastNumber = data[0].mem_number;
        const numberPart = lastNumber.split('-')[2];
        nextNumber = parseInt(numberPart) + 1;
      }

      // Format with leading zeros (001, 002, etc.)
      const formattedNumber = nextNumber.toString().padStart(3, '0');
      return `${prefix}${formattedNumber}`;
    } catch (error) {
      console.error('Error generating membership number:', error);
      // Fallback number
      return `TTS-${new Date().getFullYear()}-001`;
    }
  }

  // Get all members with optional filtering and pagination
  async getMembers(filters: MemberFilters = {}) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('current_membership_status', filters.status);
      }

      if (filters.club && filters.club !== 'all') {
        query = query.eq('club', filters.club);
      }

      if (filters.district && filters.district !== 'all') {
        query = query.eq('district', filters.district);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,mem_number.ilike.%${filters.search}%`);
      }

      // Apply pagination
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching members:', error);
        return { data: [], error };
      }

      return { data: data as Member[], error: null };
    } catch (error) {
      console.error('Error in getMembers:', error);
      return { data: [], error };
    }
  }

  // Get member by ID
  async getMemberById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching member:', error);
        return { data: null, error };
      }

      return { data: data as Member, error: null };
    } catch (error) {
      console.error('Error in getMemberById:', error);
      return { data: null, error };
    }
  }

  // Get member by membership number
  async getMemberByMemNumber(memNumber: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('mem_number', memNumber)
        .single();

      if (error) {
        console.error('Error fetching member by mem_number:', error);
        return { data: null, error };
      }

      return { data: data as Member, error: null };
    } catch (error) {
      console.error('Error in getMemberByMemNumber:', error);
      return { data: null, error };
    }
  }

  // Create new member
  async createMember(memberData: CreateMemberData) {
    try {
      // Clean the data before sending to Supabase
      const cleanedData = { ...memberData };
      
      // Convert empty strings to null for date fields
      Object.keys(cleanedData).forEach(key => {
        if (['birthdate'].includes(key)) {
          if (cleanedData[key as keyof CreateMemberData] === '') {
            cleanedData[key as keyof CreateMemberData] = null as any;
          }
        }
      });

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([cleanedData])
        .select()
        .single();

      if (error) {
        console.error('Error creating member:', error);
        // Provide more specific error messages
        let errorMessage = 'Failed to create member';
        if (error.message.includes('invalid input syntax for type date')) {
          errorMessage = 'Invalid date format. Please check all date fields.';
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'A member with this email or membership number already exists.';
        } else if (error.message.includes('violates check constraint')) {
          errorMessage = 'Invalid data format. Please check gender and other fields.';
        }
        return { data: null, error: { ...error, message: errorMessage } };
      }

      return { data: data as Member, error: null };
    } catch (error) {
      console.error('Error in createMember:', error);
      return { data: null, error: { message: 'An unexpected error occurred while creating the member.' } };
    }
  }

  // Update member
  async updateMember(id: string, memberData: Partial<Member>) {
    try {
      // Clean the data before sending to Supabase
      const cleanedData = { ...memberData };
      
      // Remove undefined values and convert empty strings to null for date fields
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key as keyof Member] === undefined) {
          delete cleanedData[key as keyof Member];
        }
        // Handle date fields specifically
        if (['birthdate', 'membership_expires_at', 'last_payment_date', 'provincial_expiry_date'].includes(key)) {
          if (cleanedData[key as keyof Member] === '') {
            cleanedData[key as keyof Member] = null as any;
          }
        }
      });

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ ...cleanedData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating member:', error);
        // Provide more specific error messages
        let errorMessage = 'Failed to update member';
        if (error.message.includes('invalid input syntax for type date')) {
          errorMessage = 'Invalid date format. Please check all date fields.';
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'A member with this email or membership number already exists.';
        } else if (error.message.includes('violates check constraint')) {
          errorMessage = 'Invalid data format. Please check gender and other fields.';
        }
        return { data: null, error: { ...error, message: errorMessage } };
      }

      return { data: data as Member, error: null };
    } catch (error) {
      console.error('Error in updateMember:', error);
      return { data: null, error: { message: 'An unexpected error occurred while updating the member.' } };
    }
  }

  // Delete member
  async deleteMember(id: string) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting member:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Error in deleteMember:', error);
      return { error };
    }
  }

  // Get member analytics
  async getMemberAnalytics(): Promise<{ data: MemberAnalytics | null, error: any }> {
    try {
      // Get total counts
      const { data: allMembers, error: membersError } = await supabase
        .from(this.tableName)
        .select('current_membership_status, club, district, created_at, membership_expires_at');

      if (membersError) {
        console.error('Error fetching analytics:', membersError);
        return { data: null, error: membersError };
      }

      const members = allMembers || [];
      
      // Calculate analytics
      const totalMembers = members.length;
      const activeMembers = members.filter(m => m.current_membership_status === 'active').length;
      const expiredMembers = members.filter(m => m.current_membership_status === 'expired').length;
      const pendingMembers = members.filter(m => m.current_membership_status === 'pending').length;
      const inactiveMembers = members.filter(m => m.current_membership_status === 'inactive').length;

      // Members by club
      const clubCounts = members.reduce((acc, member) => {
        const club = member.club || 'Unknown';
        acc[club] = (acc[club] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const membersByClub = Object.entries(clubCounts).map(([club, count]) => ({
        club,
        count
      }));

      // Members by district
      const districtCounts = members.reduce((acc, member) => {
        const district = member.district || 'Unknown';
        acc[district] = (acc[district] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const membersByDistrict = Object.entries(districtCounts).map(([district, count]) => ({
        district,
        count
      }));

      // Recent joins (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentJoins = members.filter(m => 
        m.created_at && new Date(m.created_at) > thirtyDaysAgo
      ).length;

      // Expiring this month
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const expiringThisMonth = members.filter(m => 
        m.membership_expires_at && 
        new Date(m.membership_expires_at) <= endOfMonth &&
        new Date(m.membership_expires_at) >= now
      ).length;

      const analytics: MemberAnalytics = {
        totalMembers,
        activeMembers,
        expiredMembers,
        pendingMembers,
        membersByStatus: {
          active: activeMembers,
          inactive: inactiveMembers,
          expired: expiredMembers,
          pending: pendingMembers
        },
        membersByClub,
        membersByDistrict,
        recentJoins,
        expiringThisMonth
      };

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error in getMemberAnalytics:', error);
      return { data: null, error };
    }
  }

  // Get unique clubs for filter dropdown
  async getClubs() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('club')
        .not('club', 'is', null)
        .order('club');

      if (error) {
        console.error('Error fetching clubs:', error);
        return { data: [], error };
      }

      const uniqueClubs = [...new Set(data.map(item => item.club))];
      return { data: uniqueClubs, error: null };
    } catch (error) {
      console.error('Error in getClubs:', error);
      return { data: [], error };
    }
  }

  // Get unique districts for filter dropdown
  async getDistricts() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('district')
        .not('district', 'is', null)
        .order('district');

      if (error) {
        console.error('Error fetching districts:', error);
        return { data: [], error };
      }

      const uniqueDistricts = [...new Set(data.map(item => item.district))].filter(Boolean);
      return { data: uniqueDistricts, error: null };
    } catch (error) {
      console.error('Error in getDistricts:', error);
      return { data: [], error };
    }
  }

  // Get all Saskatchewan districts (static list for forms)
  getAllDistricts() {
    return [
      "1-Estevan",
      "2-Weyburn", 
      "3-Assiniboia",
      "4-Maple Creek",
      "5-Swift Current",
      "6-Kindersley",
      "7-Rosetown",
      "8-Saskatoon",
      "9-Battleford",
      "10-Meadow Lake",
      "11-Lloydminster",
      "12-Prince Albert",
      "13-Humboldt",
      "14-Yorkton",
      "15-Melville",
      "16-Regina",
      "17-Indian Head",
      "18-Moose Jaw"
    ];
  }

  // Real-time subscription for members table
  subscribeToMembers(callback: (payload: any) => void) {
    return supabase
      .channel('members-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: this.tableName 
        }, 
        callback
      )
      .subscribe();
  }
}

// Export singleton instance
export const membersService = new MembersService();
