import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table types
export interface SPEDSubmission {
  id?: string
  created_at?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  school: string
  address_line1: string
  address_line2?: string
  city: string
  province: string
  postal_code: string
  sessions: string
  students: string
  grade?: string
  preferred_times: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  admin_notes?: string
}

export interface ClinicsSubmission {
  id?: string
  created_at?: string
  name: string
  email: string
  phone?: string
  organization: string
  location: string
  participants: string
  preferred_date: string
  duration: string
  message?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  admin_notes?: string
}
