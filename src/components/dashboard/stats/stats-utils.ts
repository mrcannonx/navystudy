import { ActivityStats, AnalyticsData, CombinedStats } from "./types"
import { StatisticsContextType } from "@/types/statistics.types"

/**
 * Combines stats from different sources (API and context) to create a unified stats object
 */
export function combineStats(
  analytics: AnalyticsData | null,
  quizStats: ActivityStats,
  flashcardStats: ActivityStats,
  contextQuizStats: StatisticsContextType["quizStats"] | undefined,
  contextFlashcardStats: StatisticsContextType["flashcardStats"] | undefined
): CombinedStats {
  // Get streak from context if available
  const streak = contextFlashcardStats?.streak || (analytics?.streak ?? 0)
  
  // Calculate total cards - prioritize context data
  const totalFlashcards = contextFlashcardStats?.studiedCardIds?.length || flashcardStats.totalQuestions || 0
  
  // Get quiz data from context if available, otherwise use what we have
  const contextQuizQuestions = contextQuizStats?.totalQuestions || 0
  const contextQuizAnswered = contextQuizStats?.questionsAnswered || 0
  const contextQuizTime = contextQuizStats?.timeSpent || 0
  const contextQuizScore = contextQuizStats?.averageScore || 0
  
  // Always create stats object with available data
  return {
    quiz: {
      streak: streak,
      totalQuestions: contextQuizAnswered || quizStats.totalQuestions,
      totalPossible: contextQuizQuestions || analytics?.totalCards || 0,
      timeSpent: contextQuizTime || quizStats.timeSpent,
      avgScore: contextQuizScore || quizStats.avgScore
    },
    flashcard: {
      streak: streak,
      cardsStudied: contextFlashcardStats?.cardsStudied || flashcardStats.totalQuestions,
      totalCards: totalFlashcards,
      timeSpent: contextFlashcardStats?.timeSpent || flashcardStats.timeSpent,
      avgScore: flashcardStats.avgScore
    }
  }
}

/**
 * Calculates high confidence count from confidence ratings
 */
export function calculateHighConfidenceCount(confidenceValues: any[]): number {
  return confidenceValues.filter((v): boolean => {
    if (typeof v === 'string') {
      return v === 'easy' || v === '3' || v === '4' || v === '5'
    }
    if (typeof v === 'number') {
      return v === 3 || v === 4 || v === 5
    }
    return false
  }).length
}

/**
 * Calculates retention rate based on confidence values
 */
export function calculateRetentionRate(
  confidenceValues: any[], 
  fallbackRate: number
): number {
  return confidenceValues.length > 0
    ? (calculateHighConfidenceCount(confidenceValues) / confidenceValues.length) * 100
    : fallbackRate
}