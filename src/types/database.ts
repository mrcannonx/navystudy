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
      subscription_plans: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          price_monthly: number
          price_yearly: number
          features: Json
          stripe_monthly_price_id: string | null
          stripe_yearly_price_id: string | null
          trial_days: number
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          price_monthly: number
          price_yearly: number
          features?: Json
          stripe_monthly_price_id?: string | null
          stripe_yearly_price_id?: string | null
          trial_days?: number
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          price_monthly?: number
          price_yearly?: number
          features?: Json
          stripe_monthly_price_id?: string | null
          stripe_yearly_price_id?: string | null
          trial_days?: number
          active?: boolean
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          plan_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: string
          trial_end_date: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          payment_method: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          plan_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status: string
          trial_end_date?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          payment_method?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          plan_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: string
          trial_end_date?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          payment_method?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          preferences: Json
          rank: string | null
          rate: string | null
          rate_title: string | null
          duty_station: string | null
          years_of_service: string | null
          specializations: string | null
          awards: string | null
          navy_rank_id: string | null
          insignia_url: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferences?: Json
          rank?: string | null
          rate?: string | null
          rate_title?: string | null
          duty_station?: string | null
          years_of_service?: string | null
          specializations?: string | null
          awards?: string | null
          navy_rank_id?: string | null
          insignia_url?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferences?: Json
          rank?: string | null
          rate?: string | null
          rate_title?: string | null
          duty_station?: string | null
          years_of_service?: string | null
          specializations?: string | null
          awards?: string | null
          navy_rank_id?: string | null
          insignia_url?: string | null
          is_admin?: boolean
        }
      }
      summarizer: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          content: string
          format: string
          original_text: string
          tags: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          content: string
          format: string
          original_text: string
          tags?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          content?: string
          format?: string
          original_text?: string
          tags?: string[]
        }
      }
      quizzes: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          questions: Json
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          questions: Json
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          questions?: Json
          user_id?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          cards: Json
          user_id: string
          metadata?: Json
          last_studied_at?: string
          completed_count?: number
          current_cycle?: number
          shown_cards_in_cycle?: string
          progress?: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          cards: Json
          user_id: string
          metadata?: Json
          last_studied_at?: string
          completed_count?: number
          current_cycle?: number
          shown_cards_in_cycle?: string
          progress?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          cards?: Json
          user_id?: string
          metadata?: Json
          last_studied_at?: string
          completed_count?: number
          current_cycle?: number
          shown_cards_in_cycle?: string
          progress?: Json
        }
      }
      navy_ranks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          rank: string
          image_url: string | null
          description: string | null
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          rank: string
          image_url?: string | null
          description?: string | null
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          rank?: string
          image_url?: string | null
          description?: string | null
          active?: boolean
        }
      }
      daily_active_users: {
        Row: {
          id: string
          user_id: string
          date: string
          session_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          session_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          session_count?: number
          created_at?: string
        }
      }
      user_retention: {
        Row: {
          id: string
          user_id: string
          first_seen_date: string
          last_seen_date: string
          visit_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_seen_date: string
          last_seen_date: string
          visit_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_seen_date?: string
          last_seen_date?: string
          visit_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      platform_usage: {
        Row: {
          id: string
          user_id: string
          device_type: string
          browser: string
          platform: string
          session_start: string
          session_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_type: string
          browser: string
          platform: string
          session_start?: string
          session_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_type?: string
          browser?: string
          platform?: string
          session_start?: string
          session_end?: string | null
          created_at?: string
        }
      }
      learning_path_progress: {
        Row: {
          id: string
          user_id: string
          path_id: string
          current_step: number
          total_steps: number
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          path_id: string
          current_step?: number
          total_steps: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          path_id?: string
          current_step?: number
          total_steps?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: 'quiz_completion' | 'flashcard_study' | 'content_creation'
          content_id: string | null
          content_type: 'quiz' | 'flashcard' | null
          content_title: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: 'quiz_completion' | 'flashcard_study' | 'content_creation'
          content_id?: string | null
          content_type?: 'quiz' | 'flashcard' | null
          content_title?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: 'quiz_completion' | 'flashcard_study' | 'content_creation'
          content_id?: string | null
          content_type?: 'quiz' | 'flashcard' | null
          content_title?: string | null
          created_at?: string
        }
      }
      insignias: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          rate: string
          image_url: string | null
          description: string | null
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          rate: string
          image_url?: string | null
          description?: string | null
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          rate?: string
          image_url?: string | null
          description?: string | null
          active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type Profile = Tables<'profiles'>
export type Quiz = Tables<'quizzes'>
export type Flashcard = Tables<'flashcards'>
export type NavyRank = Tables<'navy_ranks'>
export type Insignia = Tables<'insignias'>
export type Summarizer = Tables<'summarizer'>
export type SubscriptionPlan = Tables<'subscription_plans'>
export type UserSubscription = Tables<'user_subscriptions'>
// For backward compatibility
export type SavedSummary = Summarizer
export type Chevron = NavyRank
