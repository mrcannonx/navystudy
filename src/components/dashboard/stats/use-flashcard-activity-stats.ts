import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { supabase } from "@/lib/supabase"
import { useStatistics } from "@/contexts/statistics-context"
import { ActivityStats } from "./types"

export function useFlashcardActivityStats() {
  const { user } = useAuth()
  const { flashcardStats: contextFlashcardStats } = useStatistics() || {}
  const [flashcardStats, setFlashcardStats] = useState<ActivityStats>({
    totalQuestions: 0,
    timeSpent: 0,
    avgScore: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch flashcard stats from API
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    let mounted = true

    const fetchFlashcardStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch flashcards data
        const { data: flashcardsData, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', user.id)
          .order('last_studied_at', { ascending: false })
        
        if (flashcardsError) throw flashcardsError
          
        // Fetch confidence ratings from user_activities table
        const { data: sessionRatings, error: ratingsError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_type', 'flashcard')
          .eq('activity_type', 'flashcard_study')
          .not('activity_data', 'is', null)
        
        if (ratingsError) throw ratingsError
        
        // Extract confidence ratings from activity data
        const confidenceRatings = sessionRatings?.filter(session =>
          session.activity_data &&
          session.activity_data.metrics &&
          session.activity_data.metrics.confidenceRating !== undefined
        ).map(session => ({
          id: session.id,
          user_id: session.user_id,
          flashcard_id: session.content_id,
          rating: session.activity_data.metrics.confidenceRating
        })) || [];

        if (flashcardsData && mounted) {
          // Calculate total cards across all decks
          const totalCards = flashcardsData.reduce((total, deck) => {
            const cardsArray = Array.isArray(deck.cards) ? deck.cards : [];
            return total + cardsArray.length;
          }, 0);
          
          // Calculate cards studied (based on completed count)
          const cardsStudied = flashcardsData.reduce((total, deck) => 
            total + (deck.completed_count || 0), 0)
          
          // Calculate time spent (estimate 1 minute per completed session)
          const timeSpent = cardsStudied
          
          // Calculate retention rate from mastered cards
          const masteredCount = flashcardsData.reduce((total, deck) => {
            const masteredArray = Array.isArray(deck.mastered_cards) ? deck.mastered_cards : [];
            return total + masteredArray.length;
          }, 0)
          
          // Calculate retention rate
          const avgRetention = totalCards > 0 ? (masteredCount / totalCards) * 100 : 0
          
          // Use confidence ratings as alternative measure if available
          let confidenceScore = avgRetention
          if (confidenceRatings && confidenceRatings.length > 0) {
            const highConfidenceCount = confidenceRatings.filter(rating => 
              rating.rating === 'easy' || rating.rating === '3' || 
              rating.rating === '4' || rating.rating === '5'
            ).length
            
            confidenceScore = confidenceRatings.length > 0 
              ? (highConfidenceCount / confidenceRatings.length) * 100 
              : avgRetention
          }

          setFlashcardStats({
            totalQuestions: cardsStudied,
            timeSpent: timeSpent,
            avgScore: Math.round(confidenceScore)
          })
        }
      } catch (err) {
        console.error('Error fetching flashcard stats:', err)
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchFlashcardStats()

    return () => {
      mounted = false
    }
  }, [user])

  // Use context data if available
  useEffect(() => {
    if (contextFlashcardStats) {
      const cardsStudied = contextFlashcardStats.cardsStudied || 0
      const timeSpent = contextFlashcardStats.timeSpent || 0
      
      // Calculate retention based on confidence ratings
      const confidenceValues = Object.values(contextFlashcardStats.confidenceRatings || {})
      const highConfidenceCount = confidenceValues.filter((v): boolean => {
        if (typeof v === 'string') {
          return v === 'easy' || v === '3' || v === '4' || v === '5';
        }
        if (typeof v === 'number') {
          return v === 3 || v === 4 || v === 5;
        }
        return false;
      }).length
      
      const retentionRate = confidenceValues.length > 0
        ? (highConfidenceCount / confidenceValues.length) * 100
        : flashcardStats.avgScore // Keep current value if no ratings
      
      console.log('[LearningStats] Using flashcard stats from context:', {
        cardsStudied,
        timeSpent,
        retentionRate,
        streak: contextFlashcardStats.streak
      })
      
      setFlashcardStats({
        totalQuestions: cardsStudied,
        timeSpent: timeSpent,
        avgScore: Math.round(retentionRate)
      })
    }
  }, [contextFlashcardStats, flashcardStats.avgScore])

  return { flashcardStats, isLoading, error }
}