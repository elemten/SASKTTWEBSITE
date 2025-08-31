import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Export a singleton instance for convenience
export const supabase = createClient()
