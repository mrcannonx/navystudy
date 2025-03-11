"use client"

import { useState } from 'react'
import { supabase } from "@/lib/supabase"
import { useToast } from '@/components/ui/use-toast'

import { StudySessionAnalytics } from '@/types/study-session'

export interface StudyMetrics {
  timeSpent: number
  questionsAnswered: number
  correctAnswers: number
  confidenceRating?: number
}

export interface StudySessionData {
  timeSpent: number
  questionsAnswered: number
  correctAnswers: number
  topic: string
  score?: number
  completed?: string
  currentAnswers?: any[]
  answers?: boolean[] // Array of booleans indicating if each answer was correct
  isReviewSession?: boolean // Flag indicating if this is a review session
  sessionType?: 'initial' | 'review' // Type of session for analytics
  // Add these fields to support both naming conventions
  totalQuestions?: number // For compatibility with statistics-operations.ts
  correctCount?: number // For compatibility with statistics-operations.ts
  questions?: Array<{
    question: string
    correctAnswer: string
    options: string[]
    explanation: string
    wasCorrect?: boolean // Flag to indicate if this question was answered correctly
  }>
  metrics?: {
    timeSpent: number
    questionsAnswered: number
    correctAnswers: number
    confidenceRating?: number
  }
}

export function useStudyAnalytics() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Helper to show success/error messages
  const showToast = (type: 'success' | 'error', message: string) => {
    toast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      variant: type === 'success' ? 'default' : 'destructive',
    });
  };

  // Record a study session
  const recordStudySession = async (
    topic: string,
    data: StudySessionData
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        showToast('error', 'Please sign in to record study sessions')
        throw new Error('Please sign in to record study sessions')
      }

      // Record the study session in user_activities
      const { error: sessionError } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          content_id: topic, // topic parameter is now the quiz UUID
          content_type: 'quiz',
          activity_type: 'quiz_completion',
          content_title: data.topic || 'Quiz',
          activity_data: {
            questionsAnswered: Math.max(0, data.questionsAnswered),
            correctAnswers: Math.max(0, data.correctAnswers),
            timeSpent: Math.max(0, data.timeSpent),
            // Add these fields for compatibility with statistics-operations.ts
            totalQuestions: Math.max(0, data.totalQuestions || data.questionsAnswered),
            correctCount: Math.max(0, data.correctCount || data.correctAnswers),
            score: data.questionsAnswered > 0 ? (data.correctAnswers / data.questionsAnswered) * 100 : 0,
            completed: true,
            currentAnswers: data.currentAnswers || [],
            questions: data.questions || [],
            topic: data.topic,
            metrics: {
              timeSpent: Math.max(0, data.timeSpent),
              questionsAnswered: Math.max(0, data.questionsAnswered),
              correctAnswers: Math.max(0, data.correctAnswers),
              accuracy: data.questionsAnswered > 0 ? (data.correctAnswers / data.questionsAnswered) * 100 : 0,
              averageTimePerQuestion: data.questionsAnswered > 0 ? data.timeSpent / data.questionsAnswered : 0
            }
          },
          completed_at: new Date().toISOString()
        })

      if (sessionError) {
        console.error('Study session error details:', sessionError)
        throw sessionError
      }

      showToast('success', 'Quiz progress saved successfully')
    } catch (error) {
      console.error('Error saving quiz progress:', error)
      setError('Failed to save quiz progress')
      showToast('error', 'Failed to save quiz progress')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get analytics for a specific content item
  const getContentAnalytics = async (topic: string): Promise<StudySessionAnalytics[]> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return [] // Return empty array for unauthenticated users
      }

      // Get analytics data from user_activities
      const { data, error: fetchError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .in('activity_type', ['study_session', 'quiz_completion'])
        .eq('content_title', topic)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Transform activities data to match StudySessionAnalytics type
      const transformedData = (data || []).map(activity => ({
        id: activity.id,
        user_id: activity.user_id,
        session_date: activity.created_at,
        created_at: activity.created_at,
        time_spent: activity.activity_data?.time_spent || 0,
        questions_answered: activity.activity_data?.questions_answered || 0,
        correct_answers: activity.activity_data?.correct_answers || 0,
        topic: activity.activity_data?.topic || activity.content_title,
        content_type: 'quiz' as const,
        metrics: activity.activity_data?.metrics || {
          timeSpent: activity.activity_data?.time_spent || 0,
          questionsAnswered: activity.activity_data?.questions_answered || 0,
          correctAnswers: activity.activity_data?.correct_answers || 0,
          confidenceRating: undefined
        }
      }))

      return transformedData
    } catch (error) {
      console.error('Error fetching content analytics:', error)
      setError('Failed to fetch analytics')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get user's overall study statistics
  const getOverallStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return {
          totalTimeSpent: 0,
          totalQuestionsAnswered: 0,
          totalCorrectAnswers: 0,
          sessionCount: 0
        }
      }

      // Get data from user_activities table
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activities')
        .select('activity_data, created_at')
        .eq('user_id', user.id)
        .in('activity_type', ['study_session', 'quiz_completion'])

      if (activitiesError) throw activitiesError

      // Process data from user_activities
      const stats = (activitiesData || []).reduce((acc, activity) => {
        const activityData = activity.activity_data || {}
        
        // Get the time spent from the activity data (always in seconds)
        let timeSpent = activityData.timeSpent || activityData.time_spent || 0;
        
        // Ensure timeSpent is a valid number and positive
        if (typeof timeSpent !== 'number' || isNaN(timeSpent) || timeSpent < 0) {
          timeSpent = 0;
        }
        
        return {
          totalTimeSpent: acc.totalTimeSpent + timeSpent,
          totalQuestionsAnswered: acc.totalQuestionsAnswered + (activityData.questionsAnswered || activityData.questions_answered || 0),
          totalCorrectAnswers: acc.totalCorrectAnswers + (activityData.correctAnswers || activityData.correct_answers || 0),
          sessionCount: acc.sessionCount + 1
        }
      }, {
        totalTimeSpent: 0,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        sessionCount: 0
      })

      return stats
    } catch (error) {
      console.error('Error fetching overall stats:', error)
      setError('Failed to fetch statistics')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get study sessions within a date range
  const getSessionsByDateRange = async (startDate: Date, endDate: Date): Promise<StudySessionAnalytics[]> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return [] // Return empty array for unauthenticated users
      }

      // Get data from user_activities table
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .in('activity_type', ['study_session', 'quiz_completion'])
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      if (activitiesError) throw activitiesError

      // Transform activities data from user_activities table
      const transformedData = (activitiesData || []).map(activity => {
        // Handle both old and new data formats
        const isLegacyFormat = activity.activity_type === 'study_session';
        const activityData = activity.activity_data || {};
        
        return {
          id: activity.id,
          user_id: activity.user_id,
          session_date: activity.created_at,
          created_at: activity.created_at,
          time_spent: isLegacyFormat
            ? (activityData.time_spent || 0)
            : (activityData.timeSpent || 0),
          questions_answered: isLegacyFormat
            ? (activityData.questions_answered || 0)
            : (activityData.questionsAnswered || 0),
          correct_answers: isLegacyFormat
            ? (activityData.correct_answers || 0)
            : (activityData.correctAnswers || 0),
          topic: activityData.topic || activity.content_title || '',
          content_type: activity.content_type as 'quiz' | 'flashcard',
          metrics: activityData.metrics || {
            timeSpent: isLegacyFormat
              ? (activityData.time_spent || 0)
              : (activityData.timeSpent || 0),
            questionsAnswered: isLegacyFormat
              ? (activityData.questions_answered || 0)
              : (activityData.questionsAnswered || 0),
            correctAnswers: isLegacyFormat
              ? (activityData.correct_answers || 0)
              : (activityData.correctAnswers || 0),
            confidenceRating: undefined
          }
        };
      });

      return transformedData;
    } catch (error) {
      console.error('Error fetching sessions by date range:', error)
      setError('Failed to fetch sessions')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    recordStudySession,
    getContentAnalytics,
    getOverallStats,
    getSessionsByDateRange,
    isLoading,
    error
  }
}
