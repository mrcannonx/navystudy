import type { Profile } from './types'
import type { User } from '@supabase/supabase-js'

/**
 * Creates a minimal profile object with default values
 * @param userId The user ID to associate with the profile
 * @param userData Optional user data to extract metadata from
 * @returns A minimal profile object
 */
export function createMinimalProfile(userId: string, userData?: User): Profile {
  return {
    id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    username: null,
    full_name: userData?.user_metadata?.full_name || null,
    avatar_url: null,
    bio: null,
    preferences: {},
    rank: null,
    rate: null,
    duty_station: null,
    years_of_service: null,
    specializations: null,
    awards: null,
    is_admin: false,
    navy_rank_url: null,
    insignia_id: null,
    insignia_url: null,
    navy_rank_id: null,
    exam_info: null
  }
}

/**
 * Utility for consistent auth-related logging
 */
export const authLogger = {
  info: (message: string, data?: any) => 
    console.log(`[AuthContext] ${message}`, data !== undefined ? data : ''),
  
  warn: (message: string, data?: any) => 
    console.warn(`[AuthContext] ${message}`, data !== undefined ? data : ''),
  
  error: (message: string, data?: any) => 
    console.error(`[AuthContext] ${message}`, data !== undefined ? data : '')
}

/**
 * Stores the last authentication timestamp globally to detect tab focus events
 */
export let lastAuthTimestamp = 0

/**
 * Determines if an auth event is likely a tab focus event
 * @param event The auth event type
 * @param currentUserId The current user ID in state
 * @param sessionUserId The user ID from the session
 * @returns Whether this is likely a tab focus event
 */
export function isTabFocusEvent(
  event: string,
  currentUserId: string | null,
  sessionUserId: string | null
): boolean {
  // Log the inputs for debugging
  console.log(`[AuthContext] isTabFocusEvent check:`, {
    event,
    currentUserId,
    sessionUserId,
    lastAuthTimestamp,
    currentTime: Date.now(),
    timeSinceLastAuth: Date.now() - lastAuthTimestamp,
    threshold: 30000
  })

  if (event !== 'SIGNED_IN') return false
  if (currentUserId === null) return false
  if (sessionUserId !== currentUserId) return false
  
  const currentTime = Date.now()
  const timeSinceLastAuth = currentTime - lastAuthTimestamp
  
  // If the time since the last auth event is short, it's likely a tab focus
  const isTabFocus = timeSinceLastAuth < 30000 // 30 seconds threshold
  
  if (isTabFocus) {
    console.log(`[AuthContext] Tab focus event detected`, {
      timeSinceLastAuth,
      threshold: 30000
    })
  }
  
  return isTabFocus
}

/**
 * Updates the last auth timestamp
 */
export function updateAuthTimestamp(): void {
  lastAuthTimestamp = Date.now()
}

/**
 * Stores the profile update timestamp in session storage
 */
export function storeProfileUpdateTimestamp(): void {
  window.sessionStorage.setItem('lastProfileUpdateTime', Date.now().toString())
}

/**
 * Checks if a profile was recently updated (within the last 5 seconds)
 * @returns Whether the profile was recently updated
 */
export function wasProfileRecentlyUpdated(): boolean {
  const lastUpdateTime = window.sessionStorage.getItem('lastProfileUpdateTime')
  if (!lastUpdateTime) return false
  
  const currentTime = Date.now()
  return (currentTime - parseInt(lastUpdateTime)) < 5000
}