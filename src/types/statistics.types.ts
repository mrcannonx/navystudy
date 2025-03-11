import { QuizStatistics } from "@/components/quiz/modules/types"

export interface StudyStatistics {
  cardsStudied: number
  timeSpent: number
  lastStudied: string
  streak: number
  studiedCardIds: string[]
  confidenceRatings: {
    [key: string]: number
  }
  type_distribution: {
    basic: number
    cloze: number
    reversed: number
  }
  difficulty_distribution: {
    easy: number
    medium: number
    hard: number
  }
  topic_progress: any[]
  average_complexity: number
}

export interface StatisticsContextType {
  quizStats: QuizStatistics | null
  flashcardStats: StudyStatistics | null
  refreshStatistics: () => Promise<void>
  loading: {
    quiz: boolean
    flashcard: boolean
    analytics: boolean
  }
  errors: {
    quiz: Error | null
    flashcard: Error | null
    analytics: Error | null
  }
  retry: {
    quiz: () => Promise<void>
    flashcard: () => Promise<void>
    analytics: () => Promise<void>
  }
}

export interface UserQuizStats {
  total_attempts: number
  avg_score: number
  total_time: number
  completion_rate: number
}
