"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import type { Profile } from "@/contexts/auth/types"
import { useToast } from "@/contexts/toast-context"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { NAVY_RANKS, NAVY_RATES, type NavyRank, type NavyRate } from "@/constants/navy"
import {
  AvatarUpload,
  BasicInformation,
  NavyInformation,
  AdditionalInformation,
  ExamInformation,
  type ProfileFormData
} from "./components"

export function ProfileForm() {
  const { user, profile, updateUserProfile } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: profile?.full_name?.split(' ')[0] || '',
    lastName: profile?.full_name?.split(' ')[1] || '',
    rank: profile?.rank || '',
    rate: profile?.rate || '',
    bio: profile?.bio || '',
    duty_station: profile?.duty_station || '',
    years_of_service: profile?.years_of_service || '',
    specializations: profile?.specializations || '',
    awards: profile?.awards || '',
    exam_info: profile?.exam_info || {
      name: '',
      date: '',
      target_rank: null
    }
  })

  useEffect(() => {
    if (profile) {
      const [firstName = "", lastName = ""] = (profile.full_name || "").split(" ")
      setFormData({
        firstName,
        lastName,
        rank: profile.rank || "",
        rate: profile.rate || "",
        bio: profile.bio || "",
        duty_station: profile.duty_station || "",
        years_of_service: profile.years_of_service || "",
        specializations: profile.specializations || "",
        awards: profile.awards || "",
        exam_info: profile.exam_info || {
          name: '',
          date: '',
          target_rank: null
        }
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    // Set a safety timeout to prevent the button from being stuck in loading state
    const saveTimeout = setTimeout(() => {
      console.log('[Profile Update] Safety timeout triggered, forcing save state off')
      setIsSaving(false)
    }, 15000) // 15 second safety timeout

    try {
      if (!user) {
        throw new Error('No user found')
      }

      // Prepare profile update data
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      
      // Get current preferences to preserve other settings
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single()

      if (fetchError) {
        console.error('[Profile Update Error] Failed to fetch current preferences:', fetchError)
        throw fetchError
      }

      // Clean up exam info before saving
      const cleanExamInfo = {
        name: formData.exam_info.name.trim(),
        date: formData.exam_info.date,
        target_rank: formData.exam_info.target_rank
      }

      // Merge exam_info with existing preferences
      const updatedPreferences = {
        ...(currentProfile?.preferences || {}),
        exam_info: cleanExamInfo
      }

      // Validate rank and rate
      // formData.rank contains the rank code (E1, E2, etc.) which needs to match a valid rank code
      const isValidRank = formData.rank === "" || NAVY_RANKS.some(rank => rank.code === formData.rank);
      const isValidRate = formData.rate === "" || NAVY_RATES.includes(formData.rate as NavyRate);
      
      if (!isValidRank) {
        console.warn(`[Profile Update Warning] Invalid rank: ${formData.rank}`);
      }
      
      if (!isValidRate) {
        console.warn(`[Profile Update Warning] Invalid rate: ${formData.rate}`);
      }
      
      // Prepare profile data - only include fields that exist in the database
      const profileData: Partial<Profile> = {
        full_name: fullName,
        rate: isValidRate ? (formData.rate as NavyRate || null) : null,
        bio: formData.bio,
        duty_station: formData.duty_station,
        years_of_service: formData.years_of_service,
        specializations: formData.specializations,
        awards: formData.awards,
        preferences: updatedPreferences
      }
      
      // Only add rank if it's valid - it will be converted to navy_rank_id in the service
      if (isValidRank && formData.rank) {
        // Add debugging to see what's happening
        console.log('[Profile Update] Selected rank code:', formData.rank);
        
        // The rank code (E1, E2, etc.) is stored in the navy_ranks table with rank_code field
        // Pass the rank code directly which will be processed by profile-service.ts
        (profileData as any).rank = formData.rank;
      }

      console.log('[Profile Update] Using updateUserProfile to update profile')
      
      try {
        // Use the AuthContext's updateUserProfile method
        const updateSuccess = await updateUserProfile(profileData)
        
        clearTimeout(saveTimeout) // Clear the safety timeout
        
        if (!updateSuccess) {
          throw new Error('Failed to update profile')
        }
        
        // Show success toast
        addToast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        })
        
        // Navigate back to profile page
        setIsSaving(false)
        router.push('/profile')
      } catch (updateError) {
        clearTimeout(saveTimeout) // Clear the safety timeout
        throw updateError
      }
    } catch (error) {
      clearTimeout(saveTimeout) // Clear the safety timeout
      console.error('[Profile Update Error] Update failed:', error)
      setError(error instanceof Error ? error.message : 'Profile update failed')
      setIsSaving(false)
      
      // Show error toast with more specific message if available
      addToast({
        title: 'Error',
        description: error instanceof Error 
          ? `Failed to update profile: ${error.message}`
          : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (!user || !profile) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <AvatarUpload />
      <BasicInformation formData={formData} setFormData={setFormData} />
      <NavyInformation formData={formData} setFormData={setFormData} />
      <AdditionalInformation formData={formData} setFormData={setFormData} />
      <ExamInformation formData={formData} setFormData={setFormData} />

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Changes...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}
