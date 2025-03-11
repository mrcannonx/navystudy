import { useState, useEffect, useRef, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from './types'
import { supabase } from '@/lib/supabase'
import { fetchProfile, updateProfile } from './profile-service'
import {
  authLogger,
  createMinimalProfile,
  isTabFocusEvent,
  updateAuthTimestamp,
  wasProfileRecentlyUpdated,
  storeProfileUpdateTimestamp,
  lastAuthTimestamp
} from './auth-utils'

/**
 * Hook to manage tab visibility state
 * @returns Whether the tab visibility change is being handled
 */
export function useTabVisibility() {
  const [isHandlingVisibilityChange, setIsHandlingVisibilityChange] = useState(false)
  
  useEffect(() => {
    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsHandlingVisibilityChange(true)
        authLogger.info('Tab hidden, disabling auth refresh')
      } else {
        authLogger.info('Tab visible again')
        // Small delay to ensure we don't process any stale auth events
        setTimeout(() => {
          setIsHandlingVisibilityChange(false)
          authLogger.info('Auth refresh re-enabled')
        }, 1000)
      }
    }
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Clean up the visibility change listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
  
  return isHandlingVisibilityChange
}

/**
 * Hook to manage loading state with a safety timeout
 * @param initialState Initial loading state
 * @param timeoutMs Timeout in milliseconds
 * @returns Loading state and functions to control it
 */
export function useLoadingWithTimeout(initialState = false, timeoutMs = 15000) {
  const [loading, setLoading] = useState(initialState)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const startLoading = useCallback((reason?: string) => {
    setLoading(true)
    
    if (reason) {
      authLogger.info(`Setting loading state: ${reason}`)
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      authLogger.info('Loading timeout triggered, forcing loading state off')
      setLoading(false)
      timeoutRef.current = null
    }, timeoutMs)
  }, [timeoutMs])
  
  const stopLoading = useCallback((reason?: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (reason) {
      authLogger.info(`Turning off loading state: ${reason}`)
    }
    
    setLoading(false)
  }, [])
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return { loading, startLoading, stopLoading }
}

/**
 * Hook to manage the initial session and user state
 * @returns User state and loading state
 */
export function useInitialSession() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const { loading, startLoading, stopLoading } = useLoadingWithTimeout(true)
  const userIdRef = useRef<string | null>(null)
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        authLogger.info('Session found:', {
          userId: session.user.id,
          email: session.user.email,
          accessToken: session.access_token ? 'present' : 'missing'
        })
        
        // Store the user ID in ref for comparison with future auth events
        userIdRef.current = session.user.id
        // Set the initial auth timestamp
        updateAuthTimestamp()
        
        setUser(session.user)
        
        // Set user state immediately
        setUser(session.user)
        
        // Start profile fetch in background
        const profilePromise = fetchProfile(session.user.id)
          .then(profile => {
            if (profile) {
              authLogger.info('Profile loaded:', {
                userId: profile.id,
                isAdmin: profile.is_admin,
                navy_rank: profile.navy_rank
              })
              setProfile(profile)
              return true
            } else {
              authLogger.warn('No profile returned during initial session check')
              // Create a minimal profile with just the user ID to allow the flow to continue
              setProfile(createMinimalProfile(session.user.id, session.user))
              return false
            }
          })
          .catch(error => {
            authLogger.error('Profile load failed:', error)
            // Create a minimal profile with just the user ID to allow the flow to continue
            setProfile(createMinimalProfile(session.user.id, session.user))
            return false
          })
        
        // Wait for profile fetch to complete
        await profilePromise
      } else {
        authLogger.info('No session found')
        userIdRef.current = null
        setUser(null)
        setProfile(null)
      }
      
      // Only set loading to false after both session and profile are handled
      stopLoading('initial session check complete')
    })
  }, [stopLoading])
  
  return { user, setUser, profile, setProfile, loading, startLoading, stopLoading, userIdRef }
}

/**
 * Hook to manage auth state changes
 * @param user Current user state
 * @param setUser Function to update user state
 * @param profile Current profile state
 * @param setProfile Function to update profile state
 * @param userIdRef Reference to the current user ID
 * @param isHandlingVisibilityChange Whether tab visibility change is being handled
 * @param startLoading Function to start loading state
 * @param stopLoading Function to stop loading state
 */
export function useAuthStateChange(
  user: User | null,
  setUser: (user: User | null) => void,
  profile: Profile | null,
  setProfile: (profile: Profile | null) => void,
  userIdRef: React.RefObject<string | null>,
  isHandlingVisibilityChange: boolean,
  startLoading: (reason?: string) => void,
  stopLoading: (reason?: string) => void
) {
  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // If we're handling a visibility change, ignore auth events
      if (isHandlingVisibilityChange) {
        authLogger.info('Ignoring auth event during visibility change:', event)
        return
      }
      
      authLogger.info('Auth state change:', {
        event,
        userId: session?.user?.id,
        currentUserId: userIdRef.current
      })
      
      // Detect if this is a tab-focus SIGNED_IN event
      const isSameUser = session?.user?.id === userIdRef.current
      const tabFocusEvent = isTabFocusEvent(
        event, 
        userIdRef.current || null, 
        session?.user?.id || null
      )
      
      // Update the timestamp for real auth events
      if (event !== 'SIGNED_IN' || !tabFocusEvent) {
        updateAuthTimestamp()
      }
      
      authLogger.info('Auth analysis:', {
        isSameUser,
        isTabFocusEvent: tabFocusEvent,
        visibilityState: document.visibilityState
      })
      
      // Skip loading state for tab focus events or when tab is hidden
      if (tabFocusEvent || document.visibilityState === 'hidden') {
        authLogger.info('Tab focus event or hidden tab detected, skipping loading state')
        return // Exit early, don't do anything for tab focus or hidden tab
      }
      
      // Real auth events below this point
      const isRealSignIn = event === 'SIGNED_IN'
      const isRealSignOut = event === 'SIGNED_OUT'
      const isUserUpdate = event === 'USER_UPDATED'
      const isPasswordRecovery = event === 'PASSWORD_RECOVERY'
      const isInitialSession = event === 'INITIAL_SESSION'
      
      // Log detailed information about the event
      authLogger.info('Auth event details:', {
        event,
        isRealSignIn,
        isRealSignOut,
        isUserUpdate,
        isPasswordRecovery,
        isInitialSession,
        isSameUser,
        tabFocusEvent,
        currentUserIdRef: userIdRef.current,
        sessionUserId: session?.user?.id,
        timestamp: new Date().toISOString(),
        timeSinceLastAuth: Date.now() - lastAuthTimestamp
      })
      
      // For USER_UPDATED events, we don't need to fetch the profile again if we just updated it
      // This prevents the cascading effect of profile updates
      if (isUserUpdate && isSameUser && wasProfileRecentlyUpdated()) {
        authLogger.info('Recent profile update detected, skipping profile fetch')
        return // Skip profile fetch for recent updates
      }
      
      // For INITIAL_SESSION events, check if we already have the same user
      if (isInitialSession && isSameUser && user) {
        authLogger.info('Duplicate INITIAL_SESSION for same user detected, skipping processing')
        return // Skip processing for duplicate initial session events
      }
      
      // Show loading for all real auth events
      authLogger.info('Real auth event detected, showing loading state')
      startLoading('auth event processing')
      
      try {
        authLogger.info('Processing auth event:', event)
        
        if (session?.user) {
          // Update user ref for future comparisons
          userIdRef.current = session.user.id
          authLogger.info('Updated userIdRef to:', session.user.id)
          
          // Update React state with user info
          setUser(session.user)
          authLogger.info('Updated user state')
          
          // Only fetch profile for sign in or if we don't have a profile yet
          if (isRealSignIn || !profile || isPasswordRecovery) {
            // Start profile fetch in background
            authLogger.info('Fetching profile for user:', session.user.id)
            fetchProfile(session.user.id)
              .then(newProfile => {
                if (newProfile) {
                  authLogger.info('Profile loaded during auth change:', {
                    userId: newProfile.id,
                    hasNavyRank: !!newProfile.navy_rank_url
                  })
                  setProfile(newProfile)
                } else {
                  authLogger.warn('No profile returned during auth change')
                  // Create a minimal profile with just the user ID to allow the flow to continue
                  setProfile(createMinimalProfile(session.user.id, session.user))
                }
              })
              .catch(error => {
                authLogger.error('Profile load failed during auth change:', error)
                // Create a minimal profile with just the user ID to allow the flow to continue
                setProfile(createMinimalProfile(session.user.id, session.user))
              })
          }
        } else if (isRealSignOut) {
          authLogger.info('Processing sign out')
          userIdRef.current = null
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        authLogger.error('Error during auth state change:', error)
      } finally {
        // Always turn off loading for real auth events
        stopLoading('auth event processing complete')
      }
    })
    
    return () => {
      // Clean up the auth subscription
      subscription.unsubscribe()
    }
  }, [
    user, 
    setUser, 
    profile, 
    setProfile, 
    userIdRef, 
    isHandlingVisibilityChange, 
    startLoading, 
    stopLoading
  ])
}

/**
 * Hook to manage profile operations
 * @param user Current user
 * @param profile Current profile
 * @param setProfile Function to update profile state
 * @param startLoading Function to start loading state
 * @param stopLoading Function to stop loading state
 * @returns Profile management functions
 */
export function useProfileOperations(
  user: User | null,
  profile: Profile | null,
  setProfile: (profile: Profile | null) => void,
  startLoading: (reason?: string) => void,
  stopLoading: (reason?: string) => void
) {
  /**
   * Updates the user's profile after changes
   */
  const onProfileUpdate = useCallback(async (): Promise<boolean> => {
    if (!user) {
      authLogger.error('Cannot update profile: No user found')
      return false
    }
    
    startLoading('profile update')
    
    try {
      authLogger.info('Attempting to update profile for user:', user.id)
      
      const profile = await fetchProfile(user.id)
      
      if (profile) {
        authLogger.info('Profile fetched successfully:', {
          userId: profile.id,
          hasNavyRank: !!profile.navy_rank_url,
          hasAvatarUrl: !!profile.avatar_url
        })
        
        setProfile(profile)
        authLogger.info('Profile state updated')
        return true
      } else {
        authLogger.warn('No profile returned during update')
        // Create a minimal profile with just the user ID to allow the flow to continue
        setProfile(createMinimalProfile(user.id, user))
        authLogger.info('Created minimal profile due to missing data')
        return true
      }
    } catch (error) {
      authLogger.error('Profile update failed:', error)
      // Create a minimal profile with just the user ID to allow the flow to continue
      setProfile(createMinimalProfile(user.id, user))
      return true
    } finally {
      stopLoading('profile update complete')
    }
  }, [user, setProfile, startLoading, stopLoading])
  
  /**
   * Updates specific profile data
   */
  const updateUserProfile = useCallback(async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) {
      authLogger.error('Cannot update profile: No user found')
      return false
    }
    
    startLoading('profile data update')
    
    try {
      authLogger.info('Updating user profile for:', user.id)
      
      // Store the update time to prevent cascading profile fetches
      storeProfileUpdateTimestamp()
      
      // First update auth metadata if full_name is provided
      if (data.full_name && data.full_name !== user.user_metadata?.full_name) {
        authLogger.info('Updating auth metadata with new full name')
        
        const { error: updateUserError } = await supabase.auth.updateUser({
          data: { 
            full_name: data.full_name,
            // Include other metadata that might be useful
            rank: data.rank,
            rate: data.rate
          }
        })

        if (updateUserError) {
          authLogger.error('Auth metadata update failed:', updateUserError)
          // Continue with profile update even if metadata update fails
        } else {
          authLogger.info('Auth metadata updated successfully')
        }
      }
      
      authLogger.info('Updating profile data in database')
      const profile = await updateProfile(user.id, data)
      
      if (profile) {
        authLogger.info('Profile updated successfully:', {
          id: profile.id,
          hasNavyRank: !!profile.navy_rank_url,
          hasExamInfo: !!profile.exam_info
        })
        
        // Update the profile state directly to avoid another fetch
        setProfile(profile)
        
        // Update the timestamp again after successful update
        storeProfileUpdateTimestamp()
        
        return true
      } else {
        authLogger.error('No profile returned after update')
        return false
      }
    } catch (error) {
      authLogger.error('Profile update failed:', error)
      return false
    } finally {
      stopLoading('profile data update complete')
    }
  }, [user, setProfile, startLoading, stopLoading])
  
  /**
   * Refreshes the user's profile
   */
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!user) return
    
    startLoading('profile refresh')
    
    try {
      authLogger.info('Refreshing profile for user:', user.id)
      const profile = await fetchProfile(user.id)
      
      if (profile) {
        authLogger.info('Profile refreshed successfully')
        setProfile(profile)
      } else {
        authLogger.warn('No profile returned during refresh')
        // Create a minimal profile with just the user ID to allow the flow to continue
        setProfile(createMinimalProfile(user.id, user))
      }
    } catch (error) {
      authLogger.error('Profile refresh failed:', error)
      // Create a minimal profile with just the user ID to allow the flow to continue
      setProfile(createMinimalProfile(user.id, user))
    } finally {
      stopLoading('profile refresh complete')
    }
  }, [user, setProfile, startLoading, stopLoading])
  
  return { onProfileUpdate, updateUserProfile, refreshProfile }
}

/**
 * Hook to manage authentication operations
 * @param setUser Function to update user state
 * @param setProfile Function to update profile state
 * @param startLoading Function to start loading state
 * @param stopLoading Function to stop loading state
 * @returns Authentication functions
 */
export function useAuthOperations(
  setUser: (user: User | null) => void,
  setProfile: (profile: Profile | null) => void,
  startLoading: (reason?: string) => void,
  stopLoading: (reason?: string) => void
) {
  /**
   * Signs in a user with email and password
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      startLoading('sign in')
      authLogger.info('Attempting sign in:', { email })
      
      // Import dynamically to avoid circular dependencies
      const { signIn: authSignIn } = await import('./auth-service')
      const { user, profile } = await authSignIn(email, password)
      
      authLogger.info('Sign in successful:', {
        userId: user.id,
        email: user.email
      })

      setUser(user)
      setProfile(profile)

      return { user, profile }
    } catch (error) {
      authLogger.error('Sign in failed:', error)
      throw error
    } finally {
      stopLoading('sign in complete')
    }
  }, [setUser, setProfile, startLoading, stopLoading])
  
  /**
   * Signs out the current user
   */
  const signOut = useCallback(async () => {
    try {
      startLoading('sign out')
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } finally {
      stopLoading('sign out complete')
    }
  }, [setUser, setProfile, startLoading, stopLoading])
  
  return { signIn, signOut }
}