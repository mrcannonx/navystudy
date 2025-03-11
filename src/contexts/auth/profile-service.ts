import { User } from '@supabase/supabase-js'
import type { Profile } from './types'
import { supabase } from '@/lib/supabase'
import { NAVY_RANKS, type NavyRank } from '@/constants/navy'

// Performance monitoring utility
const measurePerformance = <T>(operation: string, fn: (...args: any[]) => Promise<T>): ((...args: any[]) => Promise<T>) => {
  return async (...args: any[]) => {
    const startTime = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - startTime;
      console.log(`[Performance] ${operation} took ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance] ${operation} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  };
};

export async function updateUserClaims(user: User): Promise<void> {
  // This function appears to be imported but not used in the original context
  // Keeping it as a placeholder in case it's needed for future use
  console.log('[ProfileService] updateUserClaims called for user:', user.id)
}

// Cache for navy rank URLs to reduce database queries
const navyRankCache: Record<string, string | null> = {};

// Cache timeout in milliseconds (5 minutes)
const CACHE_TIMEOUT = 5 * 60 * 1000;
let lastCacheClear = Date.now();

// Clear cache if it's older than the timeout
function checkCacheAge() {
  const now = Date.now();
  if (now - lastCacheClear > CACHE_TIMEOUT) {
    console.log('[ProfileService] Clearing navy rank cache due to age');
    Object.keys(navyRankCache).forEach(key => delete navyRankCache[key]);
    lastCacheClear = now;
  }
}

// Original function
async function _fetchProfile(userId: string): Promise<Profile | null> {
  try {
    console.log('[ProfileService] Fetching profile for user:', userId);
    
    // Check cache age
    checkCacheAge();
    
    console.log('[ProfileService] Executing database query for profile');
    
    // Use a more efficient query with specific columns
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select(`
      id, created_at, updated_at, username, full_name, avatar_url,
      bio, preferences, rate, duty_station, rank_id,
      years_of_service, specializations, awards, is_admin, navy_rank_id, insignia_id
      `)
      .eq('id', userId)
      .single()
      
    console.log('[ProfileService] Query completed, result:', profileData ? 'data received' : 'no data');
    
    // Create a profile object
    const profile = profileData ? {
      ...profileData
    } : null

    if (error) {
      console.error('[ProfileService] Database fetch error:', error);
      
      // Check if the error is because the profile doesn't exist
      // Handle both structured errors and empty error objects
      const isNoRowsError =
        (error.code === 'PGRST116' && error.message?.includes('no rows')) ||
        (Object.keys(error).length === 0) ||
        (error.message?.includes('JSON object requested') && error.message?.includes('no rows'));
        
      if (isNoRowsError) {
        console.log('[ProfileService] Profile not found, creating a minimal profile');
        
        // Create a minimal profile record in the database
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            username: null,
            full_name: null,
            avatar_url: null,
            bio: null,
            preferences: {},
            rank_id: null,
            rate: null,
            duty_station: null,
            years_of_service: null,
            specializations: null,
            awards: null,
            insignia_id: null,
            is_admin: false,
            email: null
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('[ProfileService] Failed to create minimal profile:', insertError);
          return null;
        }
        
        return {
          ...newProfile,
          username: null,
          full_name: null,
          avatar_url: null,
          bio: null,
          rank: null,
          rate: null,
          duty_station: null,
          years_of_service: null,
          specializations: null,
          awards: null,
          navy_rank_url: null,
          insignia_url: null
        };
      }
      
      throw error;
    }

    if (!profile) {
      console.error('[ProfileService] No profile found for user:', userId);
      return null;
    }

    // Fetch navy rank data separately if navy_rank_id exists
    let activeChevron = null;
    if (profile?.navy_rank_id) {
      const { data: navyRankData, error: navyRankError } = await supabase
        .from('navy_ranks')
        .select('id, image_url, active')
        .eq('id', profile.navy_rank_id)
        .single();
        
      if (!navyRankError && navyRankData) {
        activeChevron = navyRankData;
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

    // Get exam info from preferences
    const examInfo = profile.preferences?.exam_info || null;
    
    // If profile has exam_info with target_rank, get the chevron URL (from cache if possible)
    let targetRankChevronUrl = null;
    if (examInfo?.target_rank) {
      const cacheKey = `rank_${examInfo.target_rank}`;
      
      // Check if we have this navy rank in cache
      if (navyRankCache[cacheKey] !== undefined) {
        console.log('[ProfileService] Using cached navy rank URL for rank:', examInfo.target_rank);
        targetRankChevronUrl = navyRankCache[cacheKey];
      } else {
        try {
          console.log('[ProfileService] Fetching navy rank for rank:', examInfo.target_rank);
          
          // Get the navy rank from navy_rank_levels using the rank name
          console.log('[ProfileService] Looking up target rank in navy_rank_levels:', examInfo.target_rank);
          const { data: targetRankData, error: navyRankError } = await supabase
            .from('navy_rank_levels')
            .select('image_url')
            .eq("name", examInfo.target_rank)
            .single();

          if (navyRankError) {
            console.warn('[ProfileService] Error fetching target rank navy rank:', navyRankError);
          } else if (targetRankData) {
            targetRankChevronUrl = targetRankData.image_url;
            // Cache the result
            navyRankCache[cacheKey] = targetRankChevronUrl;
          } else {
            // Cache the null result too
            navyRankCache[cacheKey] = null;
          }
        } catch (navyRankError) {
          console.warn('[ProfileService] Exception fetching target rank navy rank:', navyRankError);
        }
      }
    }

    // Map navy_rank_id to a NavyRank value if available
    let rankValue: NavyRank | null = null;
    if (profile.navy_rank_id) {
      // Fetch the rank code directly from the navy_ranks table
      try {
        const { data: rankData } = await supabase
          .from("navy_ranks")
          .select('rank_code')
          .eq('id', profile.navy_rank_id)
          .single();
          
        if (rankData && rankData.rank_code) {
          // Check if the rank code is a valid NavyRank
          const rankCode = rankData.rank_code.toUpperCase();
          // Find the rank object in NAVY_RANKS array
          const rankObject = NAVY_RANKS.find(rank => rank.code === rankCode);
          if (rankObject) {
            rankValue = rankObject.code;
            console.log('[ProfileService] Mapped navy_rank_id to rank:', rankValue);
          }
        }
      } catch (error) {
        console.warn('[ProfileService] Error fetching rank code:', error);
      }
    }
    
    // Get the user's auth metadata to ensure we have the latest avatar_url
    const { data: authData } = await supabase.auth.getUser();
    const userMetadata = authData?.user?.user_metadata || {};
    
    const enrichedProfile = {
      ...profile,
      // Prioritize avatar_url from auth metadata if available
      avatar_url: userMetadata.avatar_url || profile.avatar_url,
      rank: rankValue, // Use the mapped rank value
      navy_rank: activeChevron,
      navy_rank_url: activeChevron?.image_url || null,
      insignia: insigniaData,
      insignia_url: insigniaData?.image_url || null,
      exam_info: examInfo ? {
        ...examInfo,
        target_rank_image_url: targetRankChevronUrl
      } : null
    };
    
    console.log('[ProfileService] Profile fetch successful for user:', userId, {
      hasAvatarUrl: !!enrichedProfile.avatar_url,
      avatarUrl: enrichedProfile.avatar_url ? 'present' : 'missing',
      fullName: enrichedProfile.full_name || 'not set',
      hasRank: !!enrichedProfile.rank,
      hasNavyRank: !!enrichedProfile.navy_rank_url
    });
    
    return enrichedProfile;
  } catch (error) {
    console.error('[ProfileService] Profile fetch failed:', error);
    return null;
  }
}

// Original function
async function _updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
  console.log('[ProfileService] Starting profile update for user:', userId, 'with data:', profileData)
  
  const dbUpdateData: any = { ...profileData }
  
  // Safety check: if navy_rank_id is being set directly, verify it exists
  if (dbUpdateData.navy_rank_id !== undefined) {
    try {
      const { data: rankExists, error: rankError } = await supabase
        .from("navy_ranks")
        .select('id')
        .eq('id', dbUpdateData.navy_rank_id)
        .single();
        
      if (!rankExists || rankError) {
        console.warn('[ProfileService] Invalid navy_rank_id provided:', dbUpdateData.navy_rank_id);
        delete dbUpdateData.navy_rank_id;
      }
    } catch (error) {
      console.warn('[ProfileService] Error verifying navy_rank_id:', error);
      delete dbUpdateData.navy_rank_id;
    }
  }

  // Handle rank mapping if present
  if (dbUpdateData.rank) {
    try {
      console.log('[ProfileService] Mapping rank to navy_rank_id:', dbUpdateData.rank);
      
      // Get the corresponding navy rank from navy_rank_levels table using the rank code
      console.log('[ProfileService] Looking up rank code in navy_rank_levels:', dbUpdateData.rank);
      const { data: navyRankData, error: navyRankError } = await supabase
        .from("navy_rank_levels")
        .select('id')
        .eq('name', dbUpdateData.rank)  // The name field in navy_rank_levels contains E1, E2, etc.
        .single();

      if (navyRankError) {
        console.warn('[ProfileService] Error fetching navy rank:', navyRankError);
        // Don't delete navy_rank_id here, we'll set it to null later if needed
      } else if (navyRankData) {
        console.log('[ProfileService] Setting navy_rank_id to:', navyRankData.id);
        dbUpdateData.navy_rank_id = navyRankData.id;
      } else {
        console.warn('[ProfileService] No active navy rank found for rank:', dbUpdateData.rank);
        // Set navy_rank_id to null explicitly to clear any existing value
        dbUpdateData.navy_rank_id = null;
      }
    } catch (error) {
      console.warn('[ProfileService] Error in rank mapping process:', error);
      delete dbUpdateData.navy_rank_id;
    }
  }
  
  // Clean up fields that shouldn't be sent to the database
  delete dbUpdateData.rank;
  delete dbUpdateData.navy_rank;
  delete dbUpdateData.navy_rank_url;
  delete dbUpdateData.insignia;
  delete dbUpdateData.insignia_url;
  delete dbUpdateData.exam_info;
  
  // Remove any null foreign keys
  if (dbUpdateData.navy_rank_id === null) {
    delete dbUpdateData.navy_rank_id;
  }
  if (dbUpdateData.insignia_id === null) {
    delete dbUpdateData.insignia_id;
  }

  console.log('[ProfileService] Final update data:', dbUpdateData);

  try {
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(dbUpdateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('[ProfileService] Profile update failed:', updateError);
      throw updateError;
    }

    if (!updatedProfile) {
      throw new Error('Profile update returned no data');
    }

    return await _enrichProfileData(updatedProfile);
  } catch (error) {
    console.error('[ProfileService] Profile update failed:', error);
    throw error;
  }
}

// Original function
async function _enrichProfileData(profile: Profile): Promise<Profile> {
  // Fetch navy rank data separately if navy_rank_id exists
  let activeChevron = null;
  if (profile.navy_rank_id) {
    const { data: navyRankData, error: navyRankError } = await supabase
      .from('navy_ranks')
      .select('id, image_url, active')
      .eq('id', profile.navy_rank_id)
      .single();
      
    if (!navyRankError && navyRankData) {
      activeChevron = navyRankData;
    }
  }
  
  // Fetch insignia data separately if insignia_id exists
  let insigniaData = null;
  if (profile.insignia_id) {
    const { data: insignia, error: insigniaError } = await supabase
      .from('insignias')
      .select('id, image_url, active')
      .eq('id', profile.insignia_id)
      .single();
      
    if (!insigniaError && insignia) {
      insigniaData = insignia;
    }
  }

  // Get exam info from preferences
  const examInfo = profile.preferences?.exam_info || null
  
  // If profile has exam_info with target_rank, fetch the chevron
  let targetRankChevronUrl = null
  if (examInfo?.target_rank) {
    // Check if we have this chevron in cache
    const cacheKey = `rank_${examInfo.target_rank}`;
    
    if (navyRankCache[cacheKey] !== undefined) {
      console.log('[ProfileService] Using cached navy rank URL for rank:', examInfo.target_rank);
      targetRankChevronUrl = navyRankCache[cacheKey];
    } else {
      console.log('[ProfileService] Fetching navy rank for target rank:', examInfo.target_rank)
      try {
        // Get the navy rank from navy_rank_levels using the rank name
        console.log('[ProfileService] Looking up target rank in navy_rank_levels:', examInfo.target_rank);
        const { data: targetRankData, error: navyRankError } = await supabase
          .from('navy_rank_levels')
          .select('image_url')
          .eq("name", examInfo.target_rank)
          .single()

        if (navyRankError) {
          console.warn('[ProfileService] Error fetching target rank navy rank:', navyRankError)
        } else if (targetRankData) {
          targetRankChevronUrl = targetRankData.image_url
          // Cache the result
          navyRankCache[cacheKey] = targetRankChevronUrl;
          console.log('[ProfileService] Found target rank navy rank URL')
        } else {
          // Cache the null result too
          navyRankCache[cacheKey] = null;
        }
      } catch (navyRankError) {
        // Just log the error but continue - this is not critical
        console.warn('[ProfileService] Exception fetching target rank navy rank:', navyRankError)
      }
    }
  }

  // Map navy_rank_id to a NavyRank value if available
  let rankValue: NavyRank | null = null;
  if (profile.navy_rank_id) {
    // Fetch the rank code directly from the navy_ranks table
    try {
      const { data: rankData } = await supabase
        .from("navy_ranks")
        .select('rank_code')
        .eq('id', profile.navy_rank_id)
        .single();
        
      if (rankData && rankData.rank_code) {
        // Check if the rank code is a valid NavyRank
        const rankCode = rankData.rank_code.toUpperCase();
        // Find the rank object in NAVY_RANKS array
        const rankObject = NAVY_RANKS.find(rank => rank.code === rankCode);
        if (rankObject) {
          rankValue = rankObject.code;
          console.log('[ProfileService] Mapped navy_rank_id to rank:', rankValue);
        }
      }
    } catch (error) {
      console.warn('[ProfileService] Error fetching rank code:', error);
    }
  }
  
  // Get the user's auth metadata to ensure we have the latest avatar_url
  const { data: authData } = await supabase.auth.getUser();
  const userMetadata = authData?.user?.user_metadata || {};
  
  const enrichedProfile = {
    ...profile,
    // Prioritize avatar_url from auth metadata if available
    avatar_url: userMetadata.avatar_url || profile.avatar_url,
    rank: rankValue, // Use the mapped rank value
    navy_rank: activeChevron,
    navy_rank_url: activeChevron?.image_url || null,
    insignia: insigniaData,
    insignia_url: insigniaData?.image_url || null,
    exam_info: examInfo ? {
      ...examInfo,
      target_rank_image_url: targetRankChevronUrl
    } : null
  };
  
  console.log('[ProfileService] Profile enrichment complete:', {
    id: enrichedProfile.id,
    hasNavyRank: !!enrichedProfile.navy_rank_url,
    hasExamInfo: !!enrichedProfile.exam_info
  })
  
  return enrichedProfile
}

// Export the performance-monitored versions of functions
export const fetchProfile = measurePerformance('fetchProfile', _fetchProfile);
export const updateProfile = measurePerformance('updateProfile', _updateProfile);
const enrichProfileData = measurePerformance('enrichProfileData', _enrichProfileData);
