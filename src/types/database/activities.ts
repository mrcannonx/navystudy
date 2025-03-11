import { CommonFields, CreateInsertType, CreateUpdateType, Json } from './common'

export type ActivityData = {
  questions_answered?: number
  correct_answers?: number
  time_spent?: number
  topic?: string
  metrics?: {
    timeSpent: number
    questionsAnswered: number
    correctAnswers: number
    confidenceRating?: number
  }
}

export type SessionData = {
  score: number
  timeSpent: number
  questionsAnswered: number
  correctAnswers: number
  completed: boolean
  currentAnswers: Json[]
  topic: string | null
  metrics: {
    timeSpent?: number
    questionsAnswered?: number
    correctAnswers?: number
    confidenceRating?: number
    [key: string]: any
  }
  attemptData?: Json
}

export interface UserActivity extends CommonFields {
  user_id: string
  activity_type: 'quiz_completion' | 'flashcard_study' | 'study_session'
  content_title: string
  content_id: string | null
  content_type: 'quiz' | 'flashcard' | null
  activity_data: ActivityData | SessionData | null
  completed_at: string | null
}

export type UserActivityTable = {
  Row: UserActivity
  Insert: CreateInsertType<UserActivity>
  Update: CreateUpdateType<UserActivity>
}
