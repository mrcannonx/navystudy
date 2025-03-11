import { User } from '@supabase/supabase-js'
import type { Profile } from './types'
import { supabase } from '@/lib/supabase'

export async function signIn(email: string, password: string): Promise<{ user: User; profile: Profile }> {
  const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (signInError) throw signInError
  if (!authData.user) throw new Error('No user returned')

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      id, created_at, updated_at, username, full_name, avatar_url,
      bio, preferences, "rank", rate, duty_station,
      years_of_service, specializations, awards, is_admin, navy_rank_id, insignia_url,
      insignia_id, exam_info
    `)
    .eq('id', authData.user.id)
    .single()

  if (profileError) throw profileError

  // Fetch navy rank data separately if navy_rank_id exists
  let activeNavyRank = null;
  if (profile?.navy_rank_id) {
    const { data: navyRankData, error: navyRankError } = await supabase
      .from('navy_ranks')
      .select('id, image_url, active')
      .eq('id', profile.navy_rank_id)
      .single();
      
    if (!navyRankError && navyRankData) {
      activeNavyRank = navyRankData;
    }
  }

  return {
    user: authData.user,
    profile: {
      ...profile,
      navy_rank: activeNavyRank,
      navy_rank_url: activeNavyRank?.image_url || null,
      rate_title: profile.rate || null, // Add missing required property
      insignia_url: profile.insignia_url || null, // Ensure this property is present
      insignia_id: profile.insignia_id || null, // Add missing required property
      exam_info: profile.exam_info || null // Add missing required property
    }
  }
}

export async function signUp(email: string, password: string) {
  try {
    // Check if user already exists
    const { data: existingUser } = await fetch('/api/auth/check-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(res => res.json())

    if (existingUser) {
      return { type: 'EXISTING_USER' as const, message: 'User already exists' }
    }

    // Proceed with sign up
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to sign up')
    }

    return { type: 'SUCCESS' as const }
  } catch (error) {
    console.error('[AuthService] Sign up failed:', error)
    return {
      type: 'ERROR' as const,
      message: error instanceof Error ? error.message : 'Failed to sign up'
    }
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
