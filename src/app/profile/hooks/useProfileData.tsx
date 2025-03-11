"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/contexts/toast-context"

export function useProfileData() {
  const { user, profile, loading, onProfileUpdate } = useAuth()
  const router = useRouter()
  const { addToast } = useToast()
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [loading, user, router])
  
  return {
    user,
    profile,
    loading,
    updateProfile: onProfileUpdate,
    addToast,
    router
  }
}