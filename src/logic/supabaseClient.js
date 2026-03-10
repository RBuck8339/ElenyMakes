import { createClient } from '@supabase/supabase-js'

// These pull from your .env.local file or Netlify settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)