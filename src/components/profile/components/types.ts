import type { NavyRank, NavyRate } from "@/constants/navy"

export interface ProfileFormData {
  firstName: string
  lastName: string
  rank: string  // Stores the rank code (E1, E2, etc.) while UI displays the name (Seaman Recruit, etc.)
  rate: string  // Rate code like "AB", "CS", etc.
  bio: string
  duty_station: string
  years_of_service: string
  specializations: string
  awards: string
  exam_info: {
    name: string
    date: string
    target_rank: string | null
  }
}

export interface FormSectionProps {
  formData: ProfileFormData
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>
  isLoading?: boolean
} 