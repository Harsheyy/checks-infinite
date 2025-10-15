import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid module-level errors
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey,
        urlValue: supabaseUrl,
        keyValue: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}...` : 'undefined'
      })
      throw new Error('Missing Supabase environment variables')
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabaseClient
}

// Server-side client with service role key (for API routes if needed)
let supabaseAdminClient: ReturnType<typeof createClient> | null = null

export function getSupabaseAdminClient() {
  if (!supabaseAdminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase environment variables for admin client')
    }
    
    supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  
  return supabaseAdminClient
}

// Database configuration
export const DATABASE_CONFIG = {
  table: process.env.SUPABASE_TABLE || 'CheckSTR_Holding',
  contract: process.env.CHECKS_CONTRACT || '0x036721e5a769cc48b3189efbb9cce4471e8a48b1'
} as const