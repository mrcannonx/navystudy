import { createClient } from '@supabase/supabase-js';

// Singleton instance to prevent multiple client warnings
let clientInstance: ReturnType<typeof createClient> | null = null;

// Create a Supabase client with authentication
export function createAuthClient(userId?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Missing Supabase environment variables');
  }

  // For server-side usage with admin privileges (bypassing RLS)
  if (typeof window === 'undefined') {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!serviceRoleKey) {
      console.error('Missing Supabase service role key');
      throw new Error('Missing Supabase service role key');
    }
    
    // Create a new admin client for server-side operations
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: userId ? {
          // Set auth context for RLS policies
          'X-Client-Info': 'server',
          // This header tells Supabase to use this ID for RLS policies
          'X-Supabase-Auth-Id': userId
        } : {
          'X-Client-Info': 'server',
        },
      },
    });
  }
  
  // For client-side usage, reuse the same instance to prevent warnings
  if (clientInstance) {
    return clientInstance;
  }
  
  // Create a new client instance for client-side operations
  clientInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'career-roadmap-client',
      },
    },
  });
  
  return clientInstance;
}