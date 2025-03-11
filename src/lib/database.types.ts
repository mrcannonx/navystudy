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
      career_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          current_rating: string
          current_rank: string
          target_rating: string
          target_rank: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          current_rating: string
          current_rank: string
          target_rating?: string
          target_rank: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          current_rating?: string
          current_rank?: string
          target_rating?: string
          target_rank?: string
          created_at?: string
          updated_at?: string
        }
      }
      career_milestones: {
        Row: {
          id: string
          career_plan_id: string
          title: string
          description: string | null
          milestone_type: string
          required_qualifications: Json | null
          current_qualifications: Json | null
          estimated_completion: string | null
          is_completed: boolean
          order_position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          career_plan_id: string
          title: string
          description?: string | null
          milestone_type: string
          required_qualifications?: Json | null
          current_qualifications?: Json | null
          estimated_completion?: string | null
          is_completed?: boolean
          order_position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          career_plan_id?: string
          title?: string
          description?: string | null
          milestone_type?: string
          required_qualifications?: Json | null
          current_qualifications?: Json | null
          estimated_completion?: string | null
          is_completed?: boolean
          order_position?: number
          created_at?: string
          updated_at?: string
        }
      }
      // Add other existing tables here as needed
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