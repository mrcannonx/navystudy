import type { NavyRank, NavyRate } from "@/constants/navy"
import type { User } from "@supabase/supabase-js"

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  rank: NavyRank | null
  rate: NavyRate | null
  bio: string | null
  duty_station: string | null
  years_of_service: string | null
  specializations: string | null
  awards: string | null
  created_at: string
  updated_at: string
  navy_rank_url: string | null
}

export interface ProfileFormData {
  firstName: string
  lastName: string
  rank: NavyRank | ""
  rate: NavyRate | ""
  bio: string
  duty_station: string
  years_of_service: string
  specializations: string
  awards: string
}

export interface ProfileHeaderProps {
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}

export interface ProfileAvatarProps {
  profile: Profile
  formData?: ProfileFormData
  isEditing: boolean
  isUploading: boolean
  onAvatarUploadAction: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export interface ProfileDetailsProps {
  user: User
  profile: Profile
  formData?: ProfileFormData
  isEditing: boolean
  isSaving: boolean
  onSubmitAction: (e: React.FormEvent) => Promise<void>
  setFormDataAction: (value: ProfileFormData | ((prev: ProfileFormData) => ProfileFormData)) => void
} 
