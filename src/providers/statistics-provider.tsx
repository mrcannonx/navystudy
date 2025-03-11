import { createContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { QuizStatistics } from "@/components/quiz/modules/types"
import { StatisticsContextType, StudyStatistics } from "@/types/statistics.types"
import { fetchQuizStatistics } from "@/services/quiz-statistics.service"
import { fetchFlashcardStatistics } from "@/services/flashcard-statistics.service"

// Create the context
export const StatisticsContext = createContext<StatisticsContextType | null>(null)

// Provider component
export function StatisticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [quizStats, setQuizStats] = useState<QuizStatistics | null>(null)
  const [flashcardStats, setFlashcardStats] = useState<StudyStatistics | null>(null)
  const [loading, setLoading] = useState({
    quiz: true,
    flashcard: true,
    analytics: true
  })
  const [errors, setErrors] = useState<{
    quiz: Error | null
    flashcard: Error | null
    analytics: Error | null
  }>({
    quiz: null,
    flashcard: null,
    analytics: null
  })

  const refreshStatistics = async () => {
    if (!user) {
      console.log('[StatisticsProvider] No user, skipping statistics refresh')
      return
    }

    try {
      console.log('[StatisticsProvider] Starting statistics refresh for user:', user.id)
      
      // Start all loading states
      setLoading({
        quiz: true,
        flashcard: true,
        analytics: true
      })
      
      // Reset errors
      setErrors({
        quiz: null,
        flashcard: null,
        analytics: null
      })

      // Execute all fetches in parallel
      const [quizData, flashcardData] = await Promise.all([
        fetchQuizStatistics(user.id).catch((error: Error) => {
          console.error('[StatisticsProvider] Quiz stats error:', error)
          setErrors(prev => ({ ...prev, quiz: error }))
          return null
        }),
        fetchFlashcardStatistics(user.id).catch((error: Error) => {
          console.error('[StatisticsProvider] Flashcard stats error:', error)
          setErrors(prev => ({ ...prev, flashcard: error }))
          // Return default empty stats instead of null
          return {
            cardsStudied: 0,
            timeSpent: 0,
            lastStudied: '',
            streak: 0,
            studiedCardIds: [],
            confidenceRatings: {},
            type_distribution: {
              basic: 0,
              cloze: 0,
              reversed: 0
            },
            difficulty_distribution: {
              easy: 0,
              medium: 0,
              hard: 0
            },
            topic_progress: [],
            average_complexity: 0
          }
        })
      ])

      // Update states based on results
      if (quizData) {
        console.log('[StatisticsProvider] Updating quiz stats:', quizData)
        setQuizStats(quizData)
      }

      if (flashcardData) {
        console.log('[StatisticsProvider] Updating flashcard stats:', flashcardData)
        setFlashcardStats(flashcardData)
      }

    } catch (err) {
      console.error("[StatisticsProvider] Error loading statistics:", err)
    } finally {
      setLoading({
        quiz: false,
        flashcard: false,
        analytics: false
      })
    }
  }

  const retryQuizStats = async () => {
    if (!user) return
    setLoading(prev => ({ ...prev, quiz: true }))
    setErrors(prev => ({ ...prev, quiz: null }))
    try {
      const data = await fetchQuizStatistics(user.id)
      if (data) {
        setQuizStats(data)
      }
    } catch (error) {
      console.error('[StatisticsProvider] Error retrying quiz stats:', error)
      setErrors(prev => ({ ...prev, quiz: error instanceof Error ? error : new Error('Unknown error') }))
    } finally {
      setLoading(prev => ({ ...prev, quiz: false }))
    }
  }

  const retryFlashcardStats = async () => {
    if (!user?.id) return
    setLoading(prev => ({ ...prev, flashcard: true }))
    setErrors(prev => ({ ...prev, flashcard: null }))
    try {
      const data = await fetchFlashcardStatistics(user.id)
      if (data) {
        setFlashcardStats(data)
      }
    } catch (error) {
      console.error('[StatisticsProvider] Error retrying flashcard stats:', error)
      setErrors(prev => ({ ...prev, flashcard: error instanceof Error ? error : new Error('Unknown error') }))
    } finally {
      setLoading(prev => ({ ...prev, flashcard: false }))
    }
  }

  const retryAnalytics = async () => {
    if (!user?.id) return
    setLoading(prev => ({ ...prev, analytics: true }))
    setErrors(prev => ({ ...prev, analytics: null }))
    try {
      await refreshStatistics()
    } catch (error) {
      console.error('[StatisticsProvider] Error retrying analytics:', error)
      setErrors(prev => ({ ...prev, analytics: error instanceof Error ? error : new Error('Unknown error') }))
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }))
    }
  }

  useEffect(() => {
    if (user?.id) {
      refreshStatistics()
    }
  }, [user?.id])

  return (
    <StatisticsContext.Provider 
      value={{ 
        quizStats,
        flashcardStats,
        refreshStatistics,
        loading,
        errors,
        retry: {
          quiz: retryQuizStats,
          flashcard: retryFlashcardStats,
          analytics: retryAnalytics
        }
      }}
    >
      {children}
    </StatisticsContext.Provider>
  )
}
