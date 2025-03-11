"use client"

import { createContext, useEffect } from "react"
import { supabase } from '@/lib/supabase'
import type { User } from "@supabase/supabase-js"
import type { Profile, AuthContextType } from "./types"
import { signUp as authSignUp } from "./auth-service"
import { 
  useTabVisibility, 
  useInitialSession, 
  useAuthStateChange,
  useProfileOperations,
  useAuthOperations
} from "./auth-hooks"

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => { throw new Error('Not implemented') },
  signUp: async () => ({ type: 'ERROR', message: 'Not implemented' }),
  signOut: async () => {},
  onProfileUpdate: async () => false,
  updateUserProfile: async () => false,
  refreshProfile: async () => { throw new Error('Not implemented') }
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Handle tab visibility
  const isHandlingVisibilityChange = useTabVisibility()
  
  // Initialize session and user state
  const { 
    user, 
    setUser, 
    profile, 
    setProfile, 
    loading, 
    startLoading, 
    stopLoading, 
    userIdRef 
  } = useInitialSession()
  
  // Handle auth state changes
  useAuthStateChange(
    user,
    setUser,
    profile,
    setProfile,
    userIdRef,
    isHandlingVisibilityChange,
    startLoading,
    stopLoading
  )
  
  // Profile management operations
  const { onProfileUpdate, updateUserProfile, refreshProfile } = useProfileOperations(
    user,
    profile,
    setProfile,
    startLoading,
    stopLoading
  )
  
  // Auth operations
  const { signIn, signOut } = useAuthOperations(
    setUser,
    setProfile,
    startLoading,
    stopLoading
  )

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp: authSignUp,
      signOut,
      onProfileUpdate,
      updateUserProfile,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}
