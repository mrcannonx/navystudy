"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth"
import { useToast } from "@/contexts/toast-context"
import { InteractiveButton } from "@/components/ui/interactive-button"
import { InteractiveInput } from "@/components/ui/interactive-input"
import { InteractiveTextarea } from "@/components/ui/interactive-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { User, Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavyRate } from "@/constants/navy"

const NAVY_RATES = [
  "ABE", "ABF", "ABH", "AC", "AD", "AE", "AG", "AM", "AME", "AO", "AS", "ATI", 
  "ATO", "AWF", "AWO", "AWR", "AWS", "AWV", "AZ", "BM", "BU", "CE", "CM", "CS", 
  "CSS", "CTI", "CTM", "CTR", "CTT", "CWT", "DC", "EA", "EM", "EMN", "EN", "EO", 
  "EOD", "ET", "ETN", "ETV", "FC", "FCA", "FT", "GM", "GSE", "GSM", "HM", "HT", 
  "IC", "IS", "IT", "ITE", "ITN", "ITR", "LN", "LS", "LSS", "MA", "MC", "MM", 
  "MMA", "MMN", "MN", "MR", "MT", "MU", "ND", "OS", "PR", "PS", "QM", "RP", "RS", 
  "RW", "SB", "SO", "STG", "STS", "SW", "TM", "UT", "YN", "YNS"
].map(rate => rate.toUpperCase())

interface ProfileSettingsProps {
  onComplete?: () => void
}

export function ProfileSettings({ onComplete }: ProfileSettingsProps) {
  const { user, profile, updateUserProfile } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    username: profile?.username || "",
    full_name: profile?.full_name || "",
    avatar_url: profile?.avatar_url || "",
    bio: profile?.bio || "",
    rate: profile?.rate || "",
  })

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    try {
      setUploadingAvatar(true)

      // Validate file type (only JPEG or PNG)
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a JPEG or PNG image file')
      }

      // Validate file size (max 1MB)
      const ONE_MB = 1 * 1024 * 1024 // 1MB in bytes
      if (file.size > ONE_MB) {
        throw new Error('Image size must be less than 1MB')
      }

      // Create a unique file path with user ID as folder
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (!fileExt || !['jpg', 'jpeg', 'png'].includes(fileExt)) {
        throw new Error('Invalid file extension')
      }

      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Delete old avatar if exists
      if (formData.avatar_url) {
        const oldFilePath = formData.avatar_url.split('/').pop()
        if (oldFilePath) {
          await supabase.storage
            .from('profile_images')
            .remove([`${user.id}/${oldFilePath}`])
        }
      }

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get the public URL using the full path
      const {
        data: { publicUrl },
      } = supabase.storage.from('profile_images').getPublicUrl(fileName)

      // Create a new image object to verify the URL works
      const img = new Image()
      img.src = publicUrl

      // Wait for the image to load or fail
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Failed to load image'))
        // Set a timeout in case the image takes too long to load
        setTimeout(() => reject(new Error('Image load timeout')), 10000)
      })

      // Update form data with new avatar URL
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))

      addToast({
        title: "Success",
        description: "Avatar uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Add an error handler for image loading
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Error loading image:', e)
    addToast({
      title: "Error",
      description: "Failed to load avatar image",
      variant: "destructive",
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRateChange = (value: string) => {
    // Ensure rate is stored in uppercase
    setFormData((prev) => ({ ...prev, rate: value.toUpperCase() }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate rate if one is selected
      if (formData.rate && !NAVY_RATES.includes(formData.rate.toUpperCase())) {
        throw new Error('Invalid rate selected')
      }

      // Prepare the data for submission
      const updateData = {
        ...formData,
        rate: formData.rate ? formData.rate.toUpperCase() as NavyRate : null,
        username: formData.username,
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        bio: formData.bio
      }

      await updateUserProfile(updateData)
      addToast({
        title: "Success",
        description: "Profile updated successfully",
      })
      onComplete?.()
    } catch (error) {
      console.error("Error updating profile:", error)
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          {formData.avatar_url ? (
            <img
              src={formData.avatar_url}
              alt="Profile"
              onError={handleImageError}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-75 transition-opacity"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center group-hover:opacity-75 transition-opacity">
              <User className="h-12 w-12 text-blue-600" />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/jpeg,image/png"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className={cn(
              "absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-md",
              "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              "transition-transform group-hover:scale-110",
              uploadingAvatar && "opacity-75 cursor-not-allowed"
            )}
          >
            {uploadingAvatar ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Click to upload a new avatar
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">Username</label>
        <InteractiveInput
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
        <InteractiveInput
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="rate" className="text-sm font-medium">Rate</label>
        <Select value={formData.rate} onValueChange={handleRateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select your rate" />
          </SelectTrigger>
          <SelectContent>
            {NAVY_RATES.map((rate) => (
              <SelectItem key={rate} value={rate}>
                {rate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
        <InteractiveTextarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows={4}
        />
      </div>

      <InteractiveButton type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </InteractiveButton>
    </form>
  )
}
