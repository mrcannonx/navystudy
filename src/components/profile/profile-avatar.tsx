"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Upload, Loader2 } from "lucide-react"
import type { ProfileAvatarProps } from "@/types/profile"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface NavyRankImage {
  id: string
  rank_code: string
  image_url: string | null
}

interface InsigniaImage {
  id: string
  rate: string
  image_url: string | null
}

export function ProfileAvatar({ 
  profile, 
  formData, 
  isEditing, 
  isUploading, 
  onAvatarUploadAction 
}: ProfileAvatarProps) {
  const [rankImage, setRankImage] = useState<NavyRankImage | null>(null)
  const [insigniaImage, setInsigniaImage] = useState<InsigniaImage | null>(null)
  const [avatarError, setAvatarError] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  useEffect(() => {
    // Reset error and loading state when avatar_url changes
    if (profile.avatar_url) {
      setAvatarError(false)
      setIsImageLoading(true)
    }
  }, [profile.avatar_url])

  useEffect(() => {
    // Log the profile data to check avatar_url
    console.log('[ProfileAvatar] Profile data:', {
      avatar_url: profile.avatar_url,
      avatar_url_type: typeof profile.avatar_url,
      avatar_url_length: profile.avatar_url ? profile.avatar_url.length : 0,
      full_name: profile.full_name,
      loading: isImageLoading,
      error: avatarError
    })
    
    // If avatar_url exists but is not being displayed, log more details
    if (profile.avatar_url && (avatarError || isImageLoading)) {
      console.log('[ProfileAvatar] Avatar URL details:', {
        url: profile.avatar_url,
        isValid: profile.avatar_url.startsWith('http'),
        timestamp: new Date().toISOString()
      })
    }
  }, [profile, isImageLoading, avatarError])

  useEffect(() => {
    const fetchChevron = async () => {
      if (!profile.rank) return
      
      try {
        const { data, error } = await supabase
          .from('navy_ranks')
          .select('id, rank_code, image_url')
          .eq('rank_code', profile.rank)
          .eq('active', true)
          .single()

        if (error) throw error
        setRankImage(data as NavyRankImage)
      } catch (error) {
        console.error('Error fetching chevron:', error)
      }
    }

    const fetchInsignia = async () => {
      if (!profile.rate) return
      
      try {
        const { data, error } = await supabase
          .from('insignias')
          .select('id, rate, image_url')
          .eq('rate', profile.rate)
          .eq('active', true)
          .single()

        if (error) throw error
        setInsigniaImage(data as InsigniaImage)
      } catch (error) {
        console.error('Error fetching insignia:', error)
      }
    }

    fetchChevron()
    fetchInsignia()
  }, [profile.rank, profile.rate])

  const handleAvatarError = () => {
    console.error('[ProfileAvatar] Failed to load avatar image:', profile.avatar_url)
    setAvatarError(true)
    setIsImageLoading(false)
  }

  const handleAvatarLoad = () => {
    console.log('[ProfileAvatar] Avatar loaded successfully')
    setIsImageLoading(false)
  }

  // Get initials from profile name if formData is not provided
  const getInitials = () => {
    if (formData) {
      return `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`
    }
    const nameParts = (profile.full_name || '').split(' ')
    return `${nameParts[0]?.[0] || ''}${nameParts[1]?.[0] || ''}`
  }

  return (
    <Card className="md:col-span-4 border-none shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              {isImageLoading && profile.avatar_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              <AvatarImage
                src={!avatarError ? profile.avatar_url || undefined : undefined}
                alt={profile.full_name || undefined}
                onError={handleAvatarError}
                onLoad={handleAvatarLoad}
              />
              <AvatarFallback className="bg-blue-600 text-2xl text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <Upload className="h-6 w-6 text-white" />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onAvatarUploadAction}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {profile.full_name}
          </h2>
          <div className="flex flex-col items-center gap-2">
            {(profile.rank || profile.rate) && (
              <div className="mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-muted-foreground">
                <span>{[profile.rank, profile.rate].filter(Boolean).join(' ')}</span>
              </div>
            )}
            <div className="flex items-center gap-4 mt-2">
              {rankImage?.image_url && (
                <div className="relative w-16 h-16">
                  <Image
                    src={rankImage.image_url}
                    alt={`${rankImage.rank_code} chevron`}
                    fill
                    className="object-contain"
                    sizes="64px"
                    priority
                  />
                </div>
              )}
              {insigniaImage?.image_url && (
                <div className="relative w-24 h-24">
                  <Image
                    src={insigniaImage.image_url}
                    alt={`${profile.rate} insignia`}
                    fill
                    className="object-contain"
                    sizes="96px"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 