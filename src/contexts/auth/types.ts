import type { User } from "@supabase/supabase-js"
import type { NavyRank, NavyRate } from "@/constants/navy"

interface NavyRankInsignia {
  id: string
  image_url: string | null
}

interface ExamInfo {
  name: string
  date: string
  target_rank: string | null
  target_rank_image_url: string | null
}

export interface Profile {
  id: string
  created_at: string
  updated_at: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  preferences: any
  rank: NavyRank | null
  rate: NavyRate | null
  rate_title?: string | null
  duty_station: string | null
  years_of_service: string | null
  specializations: string | null
  awards: string | null
  navy_rank_url: string | null
  navy_rank_id: string | null
  insignia_id: string | null
  is_admin: boolean
  exam_info: {
    name: string
    date: string
    target_rank: string | null
    target_rank_image_url?: string | null
  } | null
  navy_rank?: NavyRankInsignia | null
  insignia?: {
    id: string
    image_url: string
    active: boolean
  } | null
  insignia_url?: string | null
}

export type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User; profile: Profile }>
  signUp: (email: string, password: string) => Promise<{ type: 'SUCCESS' | 'EXISTING_USER' | 'ERROR', message?: string }>
  signOut: () => Promise<void>
  onProfileUpdate: () => Promise<boolean>
  updateUserProfile: (data: Partial<Profile>) => Promise<boolean>
  refreshProfile: () => Promise<void>
}
