import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { QuizStatistics } from "./types"

interface UserQuizStats {
  total_attempts: number
  avg_score: number
  total_time: number
  completion_rate: number
}

export async function fetchQuizStatistics(userId: string): Promise<QuizStatistics> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  // Get weekly quiz activities
  console.log('[QuizStats] Fetching weekly quiz activities:', {
    userId,
    dateRange: {
      from: weekAgo.toISOString(),
      to: today.toISOString()
    }
  })

  const { data: weeklyAttempts, error: weeklyError } = await supabase
    .from('user_activities')
    .select('created_at, activity_data')
    .eq('user_id', userId)
    .eq('content_type', 'quiz')
    .eq('activity_type', 'quiz_completion')
    .gte('created_at', weekAgo.toISOString())
    .lte('created_at', today.toISOString())

  if (weeklyError) {
    console.error('[QuizStats] Error fetching weekly activities:', {
      error: weeklyError,
      code: weeklyError.code,
      details: weeklyError.details,
      hint: weeklyError.hint
    })
    throw weeklyError
  }

  console.log('[QuizStats] Weekly activities fetched:', {
    count: weeklyAttempts?.length || 0
  })

  // Calculate overall statistics from quiz activities
  let totalTimeSpent = 0
  let totalQuestions = 0
  let totalCorrect = 0

  console.log('[QuizStats] Fetching all quiz activities:', {
    userId
  })

  const { data: allAttempts, error: attemptsError } = await supabase
    .from('user_activities')
    .select('activity_data')
    .eq('user_id', userId)
    .eq('content_type', 'quiz')
    .eq('activity_type', 'quiz_completion')

  if (attemptsError) {
    console.error('[QuizStats] Error fetching all sessions:', {
      error: attemptsError,
      code: attemptsError.code,
      details: attemptsError.details,
      hint: attemptsError.hint
    })
    throw attemptsError
  }

  console.log('[QuizStats] All sessions fetched:', {
    count: allAttempts?.length || 0
  })

  if (allAttempts) {
    for (const attempt of allAttempts) {
      const data = attempt.activity_data
      totalTimeSpent += data.timeSpent || 0
      
      // Check for both field naming conventions to handle both old and new data formats
      totalQuestions += data.totalQuestions || data.questionsAnswered || 0
      totalCorrect += data.correctCount || data.correctAnswers || 0
      
      console.log('[QuizStats] Processing activity data:', {
        timeSpent: data.timeSpent,
        questionsAnswered: data.questionsAnswered,
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        correctCount: data.correctCount
      })
    }
  }

  const averageScore = totalQuestions > 0 
    ? (totalCorrect / totalQuestions) * 100 
    : 0

  // Calculate unique study days from attempts
  const uniqueDays = new Set(
    weeklyAttempts?.map(attempt => {
      const date = new Date(attempt.created_at)
      return date.toISOString().split('T')[0]
    }) || []
  )
  const daysStudiedThisWeek = uniqueDays.size

  // Calculate streaks
  const sortedDays = Array.from(uniqueDays).sort()
  let currentStreak = 0
  let longestStreak = 0
  let streak = 0
  let lastDate: Date | null = null

  for (const dateStr of sortedDays) {
    const currentDate = new Date(dateStr)
    
    if (!lastDate) {
      streak = 1
    } else {
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        streak++
      } else {
        longestStreak = Math.max(longestStreak, streak)
        streak = 1
      }
    }
    
    lastDate = currentDate
  }
  
  currentStreak = streak
  longestStreak = Math.max(longestStreak, currentStreak)

  // Get the latest quiz activity for last studied date
  console.log('[QuizStats] Fetching latest quiz activity:', {
    userId,
    query: {
      select: 'created_at',
      filters: {
        user_id: userId,
        content_type: 'quiz',
        activity_type: 'quiz_completion'
      },
      order: 'created_at.desc',
      limit: 1
    }
  })

  const { data: latestAttempts, error: latestError } = await supabase
    .from('user_activities')
    .select('created_at')
    .eq('user_id', userId)
    .eq('content_type', 'quiz')
    .eq('activity_type', 'quiz_completion')
    .order('created_at', { ascending: false })
    .limit(1)

  if (latestError) {
    console.error('[QuizStats] Error fetching latest activity:', {
      error: latestError,
      code: latestError.code,
      details: latestError.details,
      hint: latestError.hint
    })
  } else {
    const lastStudied = latestAttempts?.[0]?.created_at || null
    console.log('[QuizStats] Latest activity fetched:', {
      lastStudied,
      resultsFound: latestAttempts?.length > 0
    })
  }

  return {
    streak: currentStreak,
    longestStreak,
    daysStudiedThisWeek,
    totalQuestions,
    questionsAnswered: totalQuestions,
    correctAnswers: totalCorrect,
    averageScore,
    timeSpent: totalTimeSpent,
    lastStudied: latestAttempts?.[0]?.created_at || null
  }
}

export async function updateQuizStatistics(
  user: User,
  totalQuestions: number,
  questionsAnswered: number,
  correctAnswers: number,
  timeSpent: number
): Promise<void> {
  const now = new Date().toISOString()
  
  const activityData = {
    user_id: user.id,
    content_type: 'quiz',
    activity_type: 'quiz_completion',
    content_title: 'Quiz',
    activity_data: {
      score: questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0,
      timeSpent: timeSpent,
      correctCount: correctAnswers,
      incorrectCount: questionsAnswered - correctAnswers,
      totalQuestions: totalQuestions
    },
    created_at: now,
    completed_at: now
  }

  console.log('[QuizStats] Creating new quiz activity:', {
    userId: user.id,
    data: {
      ...activityData,
      activity_data: {
        ...activityData.activity_data,
        score: Math.round(activityData.activity_data.score * 100) / 100 // Format score for logging
      }
    }
  })
  
  // Create a new quiz activity record
  const { error: activityError } = await supabase
    .from('user_activities')
    .insert(activityData)

  if (activityError) {
    console.error('[QuizStats] Error creating quiz activity:', {
      error: activityError,
      code: activityError.code,
      details: activityError.details,
      hint: activityError.hint,
      userId: user.id
    })
    throw activityError
  }

  console.log('[QuizStats] Quiz activity created successfully')
}
