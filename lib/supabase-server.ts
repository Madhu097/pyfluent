import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side Supabase client (for server components / API routes)
export const createServerClient = () => {
    return createClient(supabaseUrl, supabaseAnonKey)
}
