import { CommonFields, CreateInsertType, CreateUpdateType } from './common'
import { UserPreferences } from './settings'

export interface Profile extends CommonFields {
  updated_at: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  preferences: UserPreferences
}

export type ProfileTable = {
  Row: Profile
  Insert: CreateInsertType<Profile>
  Update: CreateUpdateType<Profile>
}
