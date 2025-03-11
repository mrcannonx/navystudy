"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth"
import { useToast } from "@/contexts/toast-context"
import { supabase } from "@/lib/supabase"
import type { User as AuthUser } from "@supabase/supabase-js"
import type { Profile } from "@/contexts/auth/types"

export function useAvatarUpload(user: AuthUser | null, profile: Profile | null) {
  const { onProfileUpdate } = useAuth()
  const { addToast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file || !user) return

      if (file.size > 2 * 1024 * 1024) {
        addToast({
          title: "Error",
          description: "Image must be less than 2MB",
          variant: "destructive",
        })
        return
      }

      setIsUploading(true)

      // Delete old avatar if it exists
      if (profile?.avatar_url) {
        const oldFilePath = profile.avatar_url.split('/').pop()
        if (oldFilePath) {
          console.log('[handleAvatarUpload] Deleting old avatar:', oldFilePath)
          const { error: deleteError } = await supabase.storage
            .from('profile_images')
            .remove([`${user.id}/${oldFilePath}`])
          
          if (deleteError) {
            console.error('[handleAvatarUpload] Error deleting old avatar:', deleteError)
            // Continue with upload even if delete fails
          }
        }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      console.log('[handleAvatarUpload] Uploading new avatar:', filePath)
      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath)

      console.log('[handleAvatarUpload] New avatar public URL:', publicUrl)

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (updateError) throw updateError

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (profileError) throw profileError

      const success = await onProfileUpdate()
      if (!success) {
        throw new Error('Failed to update avatar')
      }

      addToast({
        title: "Success",
        description: "Profile picture updated successfully",
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile picture",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return { handleAvatarUpload, isUploading }
}