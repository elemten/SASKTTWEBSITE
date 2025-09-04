import { createClient } from '@supabase/supabase-js'

// Check if Supabase is configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client if Supabase is not configured
const createMockClient = () => ({
  from: (table: string) => ({
    insert: (data: any) => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
    update: (data: any) => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithOtp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  functions: {
    invoke: (functionName: string, options?: any) => 
      Promise.resolve({ 
        data: { slots: [], success: false }, 
        error: { message: 'Supabase not configured' } 
      })
  }
})

// Only create real client if both URL and key are provided
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()

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
