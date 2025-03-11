export interface ActivityStats {
  totalQuestions: number
  timeSpent: number
  avgScore: number
}

export interface AnalyticsData {
  totalTimeSpent: number
  totalQuestionsAnswered: number
  totalCorrectAnswers: number
  sessionCount: number
  streak?: number
  totalCards?: number
}

export interface QuizStatsProps {
  streak: number
  totalQuestions: number
  totalPossible: number
  timeSpent: number
  avgScore: number
}

export interface FlashcardStatsProps {
  streak: number
  cardsStudied: number
  totalCards: number
  timeSpent: number
  avgScore: number
}

export interface CombinedStats {
  quiz: QuizStatsProps
  flashcard: FlashcardStatsProps
}