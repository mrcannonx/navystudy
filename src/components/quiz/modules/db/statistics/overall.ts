import { supabase } from "@/lib/supabase"

// Special UUID for overall quiz statistics
export const QUIZ_OVERALL_STATS_ID = '00000000-0000-0000-0000-000000000001'

interface QuizStatisticsUpdate {
  quizzesCompleted: number
  timeSpent: number
  completedQuizIds: string[]
}

export async function updateQuizStatistics(userId: string, update: QuizStatisticsUpdate) {
  try {
    const currentStats = await fetchQuizStatistics(userId)
    
    // Get user's timezone from profile preferences
    const { data: profile, error: tzError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (tzError) throw tzError
    // Default to UTC if no timezone is set
    const timezone = profile?.preferences?.settings?.general?.timezone || 'UTC'

    // Get dates in user's timezone
    const now = new Date()
    const today = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    const lastQuizDate = new Date(currentStats.lastCompleted || now)
    const lastQuizLocal = new Date(lastQuizDate.toLocaleString('en-US', { timeZone: timezone }))

    // Calculate days between last quiz and today in user's timezone
    const daysDiff = Math.floor(
      (today.getTime() - lastQuizLocal.getTime()) / (1000 * 60 * 60 * 24)
    )

    let newStreak = currentStats.streak || 0

    // Format dates to compare only the date part (YYYY-MM-DD)
    const todayStr = today.toISOString().split('T')[0]
    const lastQuizStr = lastQuizLocal.toISOString().split('T')[0]

    if (todayStr === lastQuizStr) {
      // Same day in user's timezone, keep streak
      newStreak = currentStats.streak || 0
    } else if (daysDiff === 1) {
      // Next day in user's timezone, increment streak
      newStreak = (currentStats.streak || 0) + 1
    } else {
      // More than one day passed in user's timezone, reset streak
      newStreak = 1
    }

    const { error } = await supabase
      .from("quiz_statistics")
      .upsert({
        user_id: userId,
        quiz_id: QUIZ_OVERALL_STATS_ID,
        statistics: {
          quizzesCompleted: update.quizzesCompleted,
          timeSpent: update.timeSpent,
          completedQuizIds: update.completedQuizIds,
          streak: newStreak,
          lastCompleted: now.toISOString() // Store in UTC
        },
        updated_at: now.toISOString()
      })

    if (error) throw error
    
    return newStreak
  } catch (error) {
    console.error('Error updating quiz statistics:', error)
    throw error
  }
}

export async function fetchQuizStatistics(userId: string) {
  try {
    const { data: rawData, error } = await supabase
      .from("quiz_statistics")
      .select("statistics")
      .eq("user_id", userId)
      .eq("quiz_id", QUIZ_OVERALL_STATS_ID)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error('Error fetching quiz statistics:', error)
      throw error
    }

    if (!rawData || !rawData.statistics) {
      const initialStats = {
        quizzesCompleted: 0,
        timeSpent: 0,
        completedQuizIds: [],
        streak: 0,
        lastCompleted: new Date().toISOString()
      }

      const { error: insertError } = await supabase
        .from("quiz_statistics")
        .insert({
          user_id: userId,
          quiz_id: QUIZ_OVERALL_STATS_ID,
          statistics: initialStats,
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error creating initial quiz statistics:', insertError)
        throw insertError
      }

      return initialStats
    }

    return rawData.statistics
  } catch (error) {
    console.error('Error in fetchQuizStatistics:', error)
    throw error
  }
}
