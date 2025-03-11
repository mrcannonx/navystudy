import { supabase } from "@/lib/supabase"

interface StudySession {
  created_at: string;
  activity_data: {
    timeSpent: number;
    questionsAnswered: number;
    correctAnswers: number;
    score: number;
    completed: boolean;
  };
}

export function calculateStreak(attempts: StudySession[]): number {
  if (!attempts.length) return 0
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const uniqueDates = new Set(
    attempts.map(a => new Date(a.created_at).toISOString().split('T')[0])
  )
  const sortedDates = Array.from(uniqueDates)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime())
  
  let streak = 0
  let currentDate = today
  
  for (const date of sortedDates) {
    date.setHours(0, 0, 0, 0)
    
    const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) {
      streak++
      currentDate = date
    } else {
      break
    }
  }
  
  return streak
}

export function calculateLongestStreak(attempts: StudySession[]): number {
  if (!attempts.length) return 0
  
  const uniqueDates = new Set(
    attempts.map(a => new Date(a.created_at).toISOString().split('T')[0])
  )
  const sortedDates = Array.from(uniqueDates)
    .map(d => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => a - b)
  
  let currentStreak = 1
  let longestStreak = 1
  
  for (let i = 1; i < sortedDates.length; i++) {
    const diffDays = Math.floor((sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }
  
  return longestStreak
}

export async function fetchStatistics(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  // Get weekly quiz activities
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
    .not('activity_data', 'eq', '{}')
    .gte('created_at', weekAgo.toISOString())
    .lte('created_at', today.toISOString())

  if (weeklyError) {
    console.error('Error fetching weekly sessions:', weeklyError)
    return null
  }

  // Get all quiz activities for overall stats
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
    .not('activity_data', 'eq', '{}')

  if (allSessionsError) {
    console.error('Error fetching all sessions:', allSessionsError)
    return null
  }

  // Filter sessions with valid data in JavaScript
  const validWeeklySessions = (weeklySessions || []).filter(session => {
    const data = session.activity_data
    return data &&
           typeof data.score === 'number' && data.score >= 0 &&
           typeof data.timeSpent === 'number' && data.timeSpent >= 0 &&
           typeof data.questionsAnswered === 'number' && data.questionsAnswered >= 0 &&
           typeof data.correctAnswers === 'number' && data.correctAnswers >= 0
  })

  const validAllSessions = (allSessions || []).filter(session => {
    const data = session.activity_data
    return data &&
           typeof data.score === 'number' && data.score >= 0 &&
           typeof data.timeSpent === 'number' && data.timeSpent >= 0 &&
           typeof data.questionsAnswered === 'number' && data.questionsAnswered >= 0 &&
           typeof data.correctAnswers === 'number' && data.correctAnswers >= 0
  })

  const sessions = validWeeklySessions as StudySession[]
  const allSessionsData = validAllSessions as StudySession[]

  // Calculate overall statistics from all sessions
  const totalTimeSpent = allSessionsData.reduce((total, record) =>
    total + (record.activity_data?.timeSpent || 0), 0
  )
  const totalQuestions = allSessionsData.reduce((total, record) =>
    total + (record.activity_data?.questionsAnswered || 0), 0
  )
  const totalCorrect = allSessionsData.reduce((total, record) =>
    total + (record.activity_data?.correctAnswers || 0), 0
  )
  const averageScore = totalQuestions > 0
    ? (totalCorrect / totalQuestions) * 100
    : 0

  const daysStudiedThisWeek = new Set(
    sessions.map(s => new Date(s.created_at).toISOString().split('T')[0])
  ).size

  const currentStreak = calculateStreak(sessions)
  const longestStreak = calculateLongestStreak(sessions)

  // Get the latest session for last studied date
  const { data: latestSession } = await supabase
    .from('user_activities')
    .select(`
      created_at
    `)
    .eq('user_id', userId)
    .eq('content_type', 'quiz')
    .eq('activity_type', 'quiz_completion')
    .not('activity_data', 'is', null)
    .not('activity_data', 'eq', '{}')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return {
    streak: currentStreak,
    longestStreak,
    daysStudiedThisWeek,
    totalQuestions,
    questionsAnswered: totalQuestions,
    correctAnswers: totalCorrect,
    averageScore,
    timeSpent: totalTimeSpent,
    lastStudied: latestSession?.created_at || null,
  }
}
