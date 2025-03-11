import { ProfileTable } from './profiles'
import { QuizTable } from './content/quizzes'
import { FlashcardTable } from './content/flashcards'
import { StudySessionTable } from './content/sessions'
import { RankTable } from './achievements/ranks'
import { NavyRankTable } from './achievements/navy_ranks'
import { InsigniaTable } from './achievements/insignias'
import { UserActivityTable } from './activities'

export * from './common'
export * from './settings'
export * from './profiles'
export * from './activities'
export * from './content/quizzes'
export * from './content/flashcards'
export * from './content/sessions'
export * from './achievements/ranks'
export * from './achievements/navy_ranks'
export * from './achievements/insignias'

export interface Database {
  public: {
    Tables: {
      profiles: ProfileTable
      quizzes: QuizTable
      flashcards: FlashcardTable
      ranks: RankTable
      navy_ranks: NavyRankTable
      insignias: InsigniaTable
      user_activities: UserActivityTable
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

// For backward compatibility - StudySession is now part of UserActivity
import { UserActivity } from './activities'
export type StudySession = UserActivity & {
  activity_type: 'study_session'
}
