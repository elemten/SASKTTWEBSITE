import { createClient } from '@supabase/supabase-js'

// For Vite, we'll use the browser client for server-side operations
// In a production app, you'd want to use proper server-side authentication
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Export singleton instance
export const supabaseServer = createServerSupabaseClient()
