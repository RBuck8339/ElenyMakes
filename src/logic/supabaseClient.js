import { createClient } from '@supabase/supabase-js'

// These pull from your .env.local file or Netlify settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Supabase Credentials Missing!
    URL Found: ${supabaseUrl ? 'YES' : 'NO'}
    Key Found: ${supabaseAnonKey ? 'YES' : 'NO'}
    Check your .env.local file.
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)