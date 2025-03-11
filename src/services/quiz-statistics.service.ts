import { QuizStatistics } from "@/components/quiz/modules/types"
import { supabase } from "@/lib/supabase"

export const fetchQuizStatistics = async (userId: string): Promise<QuizStatistics> => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  // Get weekly quiz sessions from user_activities
  const { data: weeklySessions, error: weeklyError } = await supabase
    .from('user_activities')
    .select(`
      created_at,
      activity_data
    `)
    .eq('user_id', userId)
    .eq('content_type', 'quiz')
    .eq('activity_type', 'quiz_completion')
    .not('activity_data', 'is', null)
    .gte('created_at', weekAgo.toISOString())
    .lte('created_at', today.toISOString())

  if (weeklyError) throw weeklyError

  // Get all quiz sessions for overall stats
  const { data: allSessions, error: allSessionsError } = await supabase
    .from('user_activities')
    .select(`
      created_at,
      activity_data
    `)
    .eq('user_id', userId)
    .eq('content_type', 'quiz')
    .eq('activity_type', 'quiz_completion')
    .not('activity_data', 'is', null)

  if (allSessionsError) throw allSessionsError

  const sessions = weeklySessions || []

  // Calculate unique study days from sessions
  const uniqueDays = new Set(
    sessions.map(a => new Date(a.created_at).toISOString().split('T')[0])
  )
  const daysStudiedThisWeek = uniqueDays.size

  // Calculate streaks from sessions
  let currentStreak = 0
  let longestStreak = 0
  if (sessions.length > 0) {
    const sortedDates = Array.from(uniqueDays)
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime())

    let streak = 0
    let currentDate = today
    
    for (const date of sortedDates) {
      const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 1) {
        streak++
        currentDate = date
      } else {
        longestStreak = Math.max(longestStreak, streak)
        streak = 1
        currentDate = date
      }
    }
    
    currentStreak = streak
    longestStreak = Math.max(longestStreak, currentStreak)
  }

  // Calculate overall statistics from all sessions
  const totalTimeSpent = (allSessions || []).reduce((total, record) =>
    total + (record.activity_data.timeSpent || 0), 0
  )
  const totalQuestions = (allSessions || []).reduce((total, record) =>
    total + (record.activity_data.questionsAnswered || 0), 0
  )
  const totalCorrect = (allSessions || []).reduce((total, record) =>
    total + (record.activity_data.correctAnswers || 0), 0
  )
  const averageScore = totalQuestions > 0
    ? (totalCorrect / totalQuestions) * 100
    : 0

  // Get the latest session for last studied date
  const { data: latestSessions } = await supabase
    .from('user_activities')
    .select(`
      created_at
    `)
    .eq('user_id', userId)
    .eq('content_type', 'quiz')
    .eq('activity_type', 'quiz_completion')
    .not('activity_data', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)

  const latestSession = latestSessions?.[0]

  return {
    streak: currentStreak,
    longestStreak,
    daysStudiedThisWeek,
    totalQuestions,
    questionsAnswered: totalQuestions,
    correctAnswers: totalCorrect,
    averageScore,
    timeSpent: totalTimeSpent,
    lastStudied: latestSession?.created_at || null
  }
}
