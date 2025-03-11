export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ranks: {
        Row: {
          id: string
          created_at: string
          name: string
          imageUrl: string | null
          order: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          imageUrl?: string | null
          order: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          imageUrl?: string | null
          order?: number
        }
      }
      reminder_settings: {
        Row: {
          id: string
          user_id: string
          created_at: string
          email_enabled: boolean
          notification_time: string
          frequency: 'daily' | 'weekly' | 'monthly'
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          email_enabled?: boolean
          notification_time: string
          frequency: 'daily' | 'weekly' | 'monthly'
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          email_enabled?: boolean
          notification_time?: string
          frequency?: 'daily' | 'weekly' | 'monthly'
        }
      }
    }
  }
} 