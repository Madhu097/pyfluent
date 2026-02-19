import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client singleton
let _client: ReturnType<typeof createSupabaseClient> | null = null

/**
 * Returns a shared Supabase client instance.
 * Using a singleton improves performance by preventing 
 * redundant connection handshakes.
 */
export const createClient = () => {
    if (typeof window !== 'undefined') {
        if (!_client) {
            _client = createSupabaseClient(supabaseUrl, supabaseAnonKey)
        }
        return _client
    }
    // For server-side usage
    return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Alternative name for the same singleton client.
 */
export const getSupabase = createClient
