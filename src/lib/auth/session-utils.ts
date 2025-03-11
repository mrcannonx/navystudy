import { SupabaseClient, User } from '@supabase/supabase-js';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error?: string;
}

export async function verifyAuthState(supabase: SupabaseClient, user: User | null): Promise<AuthState> {
  if (!user || !supabase) {
    return {
      isAuthenticated: false,
      user: null,
      error: 'No authenticated user'
    };
  }

  return {
    isAuthenticated: true,
    user
  };
}

export async function verifyUserProfile(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Failed to verify user profile:', {
        error: profileError,
        userId,
        errorCode: profileError.code,
        errorMessage: profileError.message,
        details: profileError.details
      });
      throw new Error('User profile not found');
    }

    console.log('User profile verified:', {
      userId,
      profileId: profile.id
    });

    return true;
  } catch (error) {
    console.error('Profile verification failed:', error);
    throw error;
  }
}
