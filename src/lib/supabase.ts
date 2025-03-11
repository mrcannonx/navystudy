import { createClient } from '@supabase/supabase-js'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a singleton instance that can be imported across modules
let supabase: ReturnType<typeof createPagesBrowserClient<Database, 'public'>>;

// Only create the client if the environment variables are set
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createPagesBrowserClient<Database, 'public'>({
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
      options: {
        global: {
          headers: {
            'x-application-name': 'RankStudy'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Create a mock client for development
    supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: null }),
            in: () => ({ single: () => ({ data: null, error: null }) }),
          }),
        }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ data: null, error: null }) }),
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    } as any;
  }
} else {
  console.warn('Supabase environment variables not set. Using mock client.');
  // Create a mock client for development
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: null }),
          in: () => ({ single: () => ({ data: null, error: null }) }),
        }),
      }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  } as any;
}

export { supabase };

type ProfileResponse = Database['public']['Tables']['profiles']['Row'] & {
  navy_rank: { image_url: string } | null
  insignia: { image_url: string } | null
  rate_title?: string | null
  rank_id?: string | null
  insignia_id?: string | null
  navy_rank_id?: string | null
}

// Profile management functions
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, created_at, updated_at, username, full_name, avatar_url, bio, preferences, rate, duty_station, years_of_service, specializations, awards, is_admin, navy_rank_id, insignia_id, rank_id')
      .eq('id', userId)
      .single()

    if (error) throw error
    if (!data) return null

    const profile = data as unknown as ProfileResponse
    
    // Fetch navy rank data separately if navy_rank_id exists
    let navyRankData = null;
    if (profile?.navy_rank_id) {
      const { data: navyRank, error: navyRankError } = await supabase
        .from('navy_ranks')
        .select('id, image_url, active')
        .eq('id', profile.navy_rank_id)
        .single();
        
      if (!navyRankError && navyRank) {
        navyRankData = navyRank;
      }
    }
    
    // Fetch insignia data separately if insignia_id exists
    let insigniaData = null;
    if (profile?.insignia_id) {
      const { data: insignia, error: insigniaError } = await supabase
        .from('insignias')
        .select('id, image_url, active')
        .eq('id', profile.insignia_id)
        .single();
        
      if (!insigniaError && insignia) {
        insigniaData = insignia;
      }
    }
    
    // Map rank_id to a NavyRank value if available
    let rankValue = null;
    if (profile?.rank_id) {
      try {
        const { data: rankData, error: rankError } = await supabase
          .from("navy_rank_levels")
          .select('name')
          .eq('id', profile.rank_id)
          .single();
          
        if (!rankError && rankData && rankData.name) {
          rankValue = rankData.name;
        }
      } catch (error) {
        console.warn('Error fetching rank:', error);
      }
    }
    
    return {
      ...profile,
      rank: rankValue, // Use the mapped rank value
      navy_rank: navyRankData,
      navy_rank_url: navyRankData?.image_url || null,
      insignia: insigniaData,
      insignia_url: insigniaData?.image_url || null,
      rate_title: profile.rate || null
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function updateProfile(
  userId: string, 
  updates: Partial<Database['public']['Tables']['profiles']['Row']>
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, created_at, updated_at, username, full_name, avatar_url, bio, preferences, rate, duty_station, years_of_service, specializations, awards, is_admin, navy_rank_id, insignia_id, rank_id')
      .single()

    if (error) throw error
    if (!data) return null

    const profile = data as unknown as ProfileResponse
    
    // Fetch navy rank data separately if navy_rank_id exists
    let navyRankData = null;
    if (profile?.navy_rank_id) {
      const { data: navyRank, error: navyRankError } = await supabase
        .from('navy_ranks')
        .select('id, image_url, active')
        .eq('id', profile.navy_rank_id)
        .single();
        
      if (!navyRankError && navyRank) {
        navyRankData = navyRank;
      }
    }
    
    // Fetch insignia data separately if insignia_id exists
    let insigniaData = null;
    if (profile?.insignia_id) {
      const { data: insignia, error: insigniaError } = await supabase
        .from('insignias')
        .select('id, image_url, active')
        .eq('id', profile.insignia_id)
        .single();
        
      if (!insigniaError && insignia) {
        insigniaData = insignia;
      }
    }
    
    // Map rank_id to a NavyRank value if available
    let rankValue = null;
    if (profile?.rank_id) {
      try {
        const { data: rankData, error: rankError } = await supabase
          .from("navy_rank_levels")
          .select('name')
          .eq('id', profile.rank_id)
          .single();
          
        if (!rankError && rankData && rankData.name) {
          rankValue = rankData.name;
        }
      } catch (error) {
        console.warn('Error fetching rank:', error);
      }
    }
    
    return {
      ...profile,
      rank: rankValue, // Use the mapped rank value
      navy_rank: navyRankData,
      navy_rank_url: navyRankData?.image_url || null,
      insignia: insigniaData,
      insignia_url: insigniaData?.image_url || null,
      rate_title: profile.rate || null
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getProfileByUsername(username: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, created_at, updated_at, username, full_name, avatar_url, bio, preferences, rate, duty_station, years_of_service, specializations, awards, is_admin, navy_rank_id, insignia_id, rank_id')
      .eq('username', username)
      .single()

    if (error) throw error
    if (!data) return null

    const profile = data as unknown as ProfileResponse
    
    // Fetch navy rank data separately if navy_rank_id exists
    let navyRankData = null;
    if (profile?.navy_rank_id) {
      const { data: navyRank, error: navyRankError } = await supabase
        .from('navy_ranks')
        .select('id, image_url, active')
        .eq('id', profile.navy_rank_id)
        .single();
        
      if (!navyRankError && navyRank) {
        navyRankData = navyRank;
      }
    }
    
    // Fetch insignia data separately if insignia_id exists
    let insigniaData = null;
    if (profile?.insignia_id) {
      const { data: insignia, error: insigniaError } = await supabase
        .from('insignias')
        .select('id, image_url, active')
        .eq('id', profile.insignia_id)
        .single();
        
      if (!insigniaError && insignia) {
        insigniaData = insignia;
      }
    }
    
    // Map rank_id to a NavyRank value if available
    let rankValue = null;
    if (profile?.rank_id) {
      try {
        const { data: rankData, error: rankError } = await supabase
          .from("navy_rank_levels")
          .select('name')
          .eq('id', profile.rank_id)
          .single();
          
        if (!rankError && rankData && rankData.name) {
          rankValue = rankData.name;
        }
      } catch (error) {
        console.warn('Error fetching rank:', error);
      }
    }
    
    return {
      ...profile,
      rank: rankValue, // Use the mapped rank value
      navy_rank: navyRankData,
      navy_rank_url: navyRankData?.image_url || null,
      insignia: insigniaData,
      insignia_url: insigniaData?.image_url || null,
      rate_title: profile.rate || null
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
