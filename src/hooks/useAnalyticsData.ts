import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth"
import { useStudyAnalytics } from "@/hooks/use-study-analytics"
import { useStatistics } from "@/contexts/statistics-context"
import { AnalyticsStats } from "@/types/analytics"

interface ActivityStats {
  lastActivity: string | null;
  averageScore: number;
}

interface AnalyticsData {
  analytics: AnalyticsStats | null;
  activityStats: ActivityStats | null;
  isLoading: boolean;
  error: string | null;
}

export function useAnalyticsData(): AnalyticsData {
  const { user } = useAuth()
  const { getOverallStats } = useStudyAnalytics()
  const { quizStats, flashcardStats, loading } = useStatistics()
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null)
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use the statistics from context to supplement the analytics data
  useEffect(() => {
    if (!loading.quiz && !loading.flashcard && quizStats && flashcardStats) {
      // Create a basic analytics object using the data from context
      // Ensure all time values are in seconds for consistency
      const quizTime = quizStats.timeSpent || 0;
      const flashcardTime = flashcardStats.timeSpent || 0;
      
      const contextAnalytics: AnalyticsStats = {
        totalTimeSpent: quizTime + flashcardTime,
        totalQuestionsAnswered: quizStats.questionsAnswered || 0,
        totalCorrectAnswers: quizStats.correctAnswers || 0,
        sessionCount: 0, // We'll update this from the API
        totalStudyTime: quizTime + flashcardTime
      }
      
      // Calculate retention rate (as a value between 0 and 1)
      const retentionRate = contextAnalytics.totalQuestionsAnswered > 0
        ? contextAnalytics.totalCorrectAnswers / contextAnalytics.totalQuestionsAnswered
        : 0
      
      // Default review efficiency to 0 if we can't calculate it yet
      const reviewEfficiency = 0;
          
      // Set the new analytics with context data
      setAnalytics(prev => {
        if (!prev) return {
          ...contextAnalytics,
          retentionRate,
          reviewEfficiency
        }
        
        // Merge with existing data, preferring context data for certain fields
        // but keeping API-provided sessionCount and reviewEfficiency if available
        return {
          ...prev,
          totalQuestionsAnswered: contextAnalytics.totalQuestionsAnswered,
          totalCorrectAnswers: contextAnalytics.totalCorrectAnswers,
          totalTimeSpent: contextAnalytics.totalTimeSpent,
          totalStudyTime: contextAnalytics.totalTimeSpent,
          retentionRate,
          // Keep existing reviewEfficiency if it exists
          reviewEfficiency: prev.reviewEfficiency !== undefined ? prev.reviewEfficiency : reviewEfficiency
        }
      })
      
      // Set activity stats using last studied date and average score
      setActivityStats(prev => {
        const lastActivity = quizStats.lastStudied || flashcardStats.lastStudied || prev?.lastActivity || null
        // Make sure averageScore is a percentage (0-100)
        const averageScore = (quizStats.averageScore || 0) * 100;
        
        return {
          lastActivity,
          averageScore: Math.min(100, Math.round(averageScore))
        }
      })
    }
  }, [quizStats, flashcardStats, loading])

  useEffect(() => {
    let mounted = true;
    
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        const stats = await getOverallStats()
        if (stats && mounted) {
          // Prevent division by zero and normalize values
          const retentionRate = stats.totalQuestionsAnswered > 0
            ? Math.min(1, stats.totalCorrectAnswers / stats.totalQuestionsAnswered)
            : 0
          
          // Calculate review efficiency as questions per session normalized to 0-1
          // Assume an optimal session should have at least 10 questions
          // This gives a more intuitive scaling where:
          // - Less than 5 questions per session = low efficiency (<50%)
          // - 10 questions per session = optimal efficiency (100%)
          // - More than 10 questions per session is still capped at 100%
          const avgQuestionsPerSession = stats.sessionCount > 0
            ? stats.totalQuestionsAnswered / stats.sessionCount
            : 0
            
          const reviewEfficiency = Math.min(1, avgQuestionsPerSession / 10)
          
          // Ensure totalStudyTime is set correctly
          // All time values are stored as seconds in the database
          setAnalytics(prev => ({
            ...prev,
            ...stats,
            totalStudyTime: stats.totalTimeSpent,
            retentionRate,
            reviewEfficiency
          }))
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
        // Don't set error if we already have context data
        if (!analytics) {
          setError('Failed to fetch analytics data')
        }
      }
    }

    const fetchActivityStats = async () => {
      if (!user) return;
      
      try {
        // Get the most recent activity
        const { data: recentActivities, error: recentError } = await supabase
          .from('user_activities')
          .select(`
            created_at
          `)
          .eq('user_id', user.id)
          .eq('activity_type', 'quiz_completion')
          .not('activity_data', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1)

        if (recentError) throw recentError

        // Calculate average score from user activities
        const { data: sessions, error: sessionsError } = await supabase
          .from('user_activities')
          .select(`
            activity_data
          `)
          .eq('user_id', user.id)
          .eq('activity_type', 'quiz_completion')
          .not('activity_data', 'is', null)
          .order('created_at', { ascending: false })
          .limit(100)

        if (sessionsError) throw sessionsError

        if (mounted) {
          const lastActivity = recentActivities?.[0]?.created_at || null
          
          let averageScore = 0
          if (sessions && sessions.length > 0) {
            const scores = sessions.map(session => session.activity_data?.score || 0)
            averageScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          }

          // Merge with existing data
          setActivityStats(prev => {
            // If we have lastActivity from context, use it if it's more recent
            const contextLastActivity = prev?.lastActivity || null
            const finalLastActivity = lastActivity && contextLastActivity
              ? new Date(lastActivity) > new Date(contextLastActivity) ? lastActivity : contextLastActivity
              : lastActivity || contextLastActivity

            return {
              lastActivity: finalLastActivity,
              averageScore: averageScore || prev?.averageScore || 0
            }
          })
        }
      } catch (err) {
        console.error('Error fetching activity stats:', err)
        // Don't set error if we already have context data
        if (!activityStats) {
          setError('Failed to fetch activity statistics')
        }
      }
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        await Promise.all([fetchAnalytics(), fetchActivityStats()])
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Only fetch if we need to (user exists and not already loaded from context)
    if (user) {
      fetchData()
    } else {
      setIsLoading(false)
    }
    
    return () => {
      mounted = false
    }
  }, [user])

  return { analytics, activityStats, isLoading: isLoading && loading.analytics, error }
}
