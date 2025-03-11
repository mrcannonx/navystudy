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
    // Log the current auth state for debugging
    clientInstance.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('[AuthClient] Error getting session:', error);
      } else if (data.session) {
        console.log('[AuthClient] Active session found:', {
          userId: data.session.user.id,
          hasAccessToken: !!data.session.access_token
        });
      } else {
        console.warn('[AuthClient] No active session found');
      }
    });
    
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
  
  // Log initial auth state
  clientInstance.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('[AuthClient] Error getting initial session:', error);
    } else if (data.session) {
      console.log('[AuthClient] Initial session found:', {
        userId: data.session.user.id,
        hasAccessToken: !!data.session.access_token
      });
    } else {
      console.warn('[AuthClient] No initial session found');
    }
  });
  
  // Set up auth state change listener
  clientInstance.auth.onAuthStateChange((event, session) => {
    console.log('[AuthClient] Auth state changed:', {
      event,
      userId: session?.user.id,
      hasAccessToken: !!session?.access_token
    });
  });
  
  return clientInstance;
}