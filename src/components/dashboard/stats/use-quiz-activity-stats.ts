import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { supabase } from "@/lib/supabase"
import { useStatistics } from "@/contexts/statistics-context"
import { ActivityStats } from "./types"

export function useQuizActivityStats() {
  const { user } = useAuth()
  const { quizStats: contextQuizStats } = useStatistics() || {}
  const [quizStats, setQuizStats] = useState<ActivityStats>({
    totalQuestions: 0,
    timeSpent: 0,
    avgScore: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch quiz stats from API
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    let mounted = true

    const fetchQuizStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch quiz activities from user_activities table
        const { data: quizSessions, error: fetchError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_type', 'quiz')
          .eq('activity_type', 'quiz_completion')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        if (quizSessions && mounted) {
          // Get total questions and correct answers from all sessions
          const totalQuizQuestions = quizSessions.reduce((total, session) =>
            total + (session.activity_data?.questionsAnswered || 0), 0)
          
          const totalCorrectAnswers = quizSessions.reduce((total, session) =>
            total + (session.activity_data?.correctAnswers || 0), 0)
          
          // Calculate total time spent
          const totalTimeSpent = quizSessions.reduce((total, session) =>
            total + (session.activity_data?.timeSpent || 0), 0)
          
          // Calculate average score
          const avgQuizScore = totalQuizQuestions > 0 
            ? (totalCorrectAnswers / totalQuizQuestions) * 100 
            : 0

          setQuizStats({
            totalQuestions: totalQuizQuestions,
            timeSpent: totalTimeSpent,
            avgScore: Math.round(avgQuizScore)
          })
        }
      } catch (err) {
        console.error('Error fetching quiz stats:', err)
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchQuizStats()

    return () => {
      mounted = false
    }
  }, [user])

  // Use context data if available
  useEffect(() => {
    if (contextQuizStats) {
      console.log('[LearningStats] Using quiz stats from context:', contextQuizStats)
      
      setQuizStats({
        totalQuestions: contextQuizStats.totalQuestions || 0,
        timeSpent: contextQuizStats.timeSpent || 0,
        avgScore: contextQuizStats.averageScore || 0
      })
    }
  }, [contextQuizStats])

  return { quizStats, isLoading, error }
}