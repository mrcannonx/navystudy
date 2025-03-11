import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { useToast } from "@/contexts/toast-context"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"

export function AvatarUpload() {
  const { user, profile, onProfileUpdate } = useAuth()
  const { addToast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  // Add image error handling
  const handleImageError = () => {
    console.error('[AvatarUpload] Failed to load image:', avatarUrl)
    setImageError(true)
    setAvatarUrl(null)
  }

  // Reduce timeout to 15 seconds and add upload progress tracking
  useEffect(() => {
    let uploadTimeout: NodeJS.Timeout | null = null;
    
    if (isUploading) {
      uploadTimeout = setTimeout(() => {
        console.log('[AvatarUpload] Safety timeout triggered, forcing upload state off');
        setIsUploading(false);
        addToast({
          title: "Upload timeout",
          description: "The upload is taking longer than expected. Please try again.",
          variant: "destructive",
        });
      }, 15000); // 15 second safety timeout
    }
    
    return () => {
      if (uploadTimeout) {
        clearTimeout(uploadTimeout);
      }
    };
  }, [isUploading, addToast]);
  
  // Update local avatar URL when profile changes
  useEffect(() => {
    if (profile?.avatar_url) {
      console.log('[AvatarUpload] Profile avatar URL updated:', profile.avatar_url)
      setImageError(false) // Reset error state
      setAvatarUrl(profile.avatar_url)
    } else {
      console.log('[AvatarUpload] Profile has no avatar URL')
    }
  }, [profile?.avatar_url])

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
      setImageError(false)
      console.log('[AvatarUpload] Starting upload process for file:', file.name, 'size:', file.size)

      // Delete existing avatar first if it exists
      if (profile?.avatar_url) {
        const oldPath = new URL(profile.avatar_url).pathname.split('/').pop()
        if (oldPath) {
          const oldFilePath = `${user.id}/${oldPath}`
          console.log('[AvatarUpload] Deleting old avatar:', oldFilePath)
          await supabase.storage
            .from('profile_images')
            .remove([oldFilePath])
        }
      }

      // Optimize and upload new image
      const optimizedFile = await optimizeImage(file)
      const fileExt = optimizedFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      console.log('[AvatarUpload] Uploading new file to path:', filePath)
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('profile_images')
        .upload(filePath, optimizedFile, {
          cacheControl: '3600',
          upsert: false // Set to false to ensure we don't silently overwrite
        })

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath)

      // Update profile and auth user
      await Promise.all([
        supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        }),
        supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id)
      ])

      // Update local state immediately
      setAvatarUrl(publicUrl)
      
      // Notify success
      addToast({
        title: "Success",
        description: "Profile picture updated successfully",
      })

      // Trigger profile refresh
      await onProfileUpdate()

    } catch (error) {
      console.error('[AvatarUpload] Error:', error)
      setImageError(true)
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile picture",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Clear the input value
      const input = document.getElementById('avatar-upload') as HTMLInputElement
      if (input) input.value = ''
    }
  }

  // Helper function to optimize image
  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800
        let width = img.width
        let height = img.height

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width
            width = maxSize
          } else {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          0.8
        )
      }
      img.onerror = () => resolve(file)
      img.src = URL.createObjectURL(file)
    })
  }

  // Add a useEffect to handle image URL updates
  useEffect(() => {
    if (profile?.avatar_url) {
      console.log('[AvatarUpload] Updating avatar URL from profile:', profile.avatar_url)
      setAvatarUrl(profile.avatar_url)
    } else {
      setAvatarUrl(null)
    }
  }, [profile?.avatar_url])

  if (!user || !profile) return null

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={avatarUrl || undefined}
            onError={() => {
              console.error('[AvatarUpload] Failed to load image:', avatarUrl)
              console.error('[AvatarUpload] Image error details:', {
                url: avatarUrl,
                timestamp: new Date().toISOString(),
                userId: user.id
              })
              setImageError(true)
              // Don't set avatarUrl to null here, as it might be a temporary network issue
              // Instead, keep the URL but show the fallback
            }}
            onLoad={() => {
              console.log('[AvatarUpload] Avatar image loaded successfully:', avatarUrl)
              setImageError(false)
            }}
            alt={profile?.full_name || 'Profile avatar'}
          />
          <AvatarFallback>
            {profile?.full_name
              ? profile.full_name.split(" ").map((n, i) => n[0]).join("")
              : user?.email?.[0].toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        {isUploading ? (
          <div className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full cursor-pointer"
          >
            <Camera className="h-4 w-4" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">Profile Picture</h3>
        <p className="text-sm text-muted-foreground">
          {isUploading ? "Uploading... Please wait" : "Click the camera icon to update your profile picture"}
        </p>
      </div>
    </div>
  )
} 
