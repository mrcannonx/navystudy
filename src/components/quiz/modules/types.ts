import type { StudySettings } from './study-settings-types';

export type { StudySettings };

export interface QuestionHistory {
  questionId: string;
  lastAnswered: Date;
  timesCorrect: number;
  timesIncorrect: number;
  nextReviewDate: Date;
}

export interface Quiz {
  id: string
  title: string
  description: string
  topic?: string
  questions: Array<{
    id: string;
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
  }>
  totalQuestions: number
  created_at: string
}

export interface QuizStatistics {
  streak: number
  longestStreak: number
  daysStudiedThisWeek: number
  totalQuestions: number
  questionsAnswered: number
  correctAnswers: number
  averageScore: number
  timeSpent: number
  lastStudied: string | null
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
}
