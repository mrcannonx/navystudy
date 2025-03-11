export type StudySessionAnalytics = {
  id: string
  user_id: string
  session_date: string
  questions_answered: number
  correct_answers: number
  time_spent: number
  topic: string
  created_at: string
  content_type: 'quiz' | 'flashcard'
  metrics: {
    timeSpent: number
    questionsAnswered: number
    correctAnswers: number
    confidenceRating?: number
  }
}
