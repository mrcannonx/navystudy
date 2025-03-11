import { createClient } from '@supabase/supabase-js'
import { QUIZ_OVERALL_STATS_ID } from '../db/statistics/overall'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // Use service role key for background job
)

export async function checkAndResetQuizStreaks() {
  try {
    // Get all users with their quiz statistics
    const { data: users, error: fetchError } = await supabase
      .from('quiz_statistics')
      .select('user_id, statistics, updated_at')
      .eq('quiz_id', QUIZ_OVERALL_STATS_ID)

    if (fetchError) throw fetchError

    const now = new Date()
    const updates = []

    for (const user of users || []) {
      const userTimezone = await getUserTimezone(user.user_id)
      const userLocalDate = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
      const lastQuizDate = new Date(user.statistics.lastCompleted)
      const lastQuizLocalDate = new Date(lastQuizDate.toLocaleString('en-US', { timeZone: userTimezone }))

      // Calculate days difference in user's timezone
      const daysDiff = Math.floor(
        (userLocalDate.getTime() - lastQuizLocalDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      // If more than 1 day has passed without completing a quiz, reset streak
      if (daysDiff > 1) {
        updates.push({
          user_id: user.user_id,
          quiz_id: QUIZ_OVERALL_STATS_ID,
          statistics: {
            ...user.statistics,
            streak: 0,
            // Keep other statistics intact
            quizzesCompleted: user.statistics.quizzesCompleted,
            timeSpent: user.statistics.timeSpent,
            completedQuizIds: user.statistics.completedQuizIds,
            lastCompleted: user.statistics.lastCompleted
          },
          updated_at: now.toISOString()
        })
      }
    }

    // Batch update all users who need streak reset
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('quiz_statistics')
        .upsert(updates)

      if (updateError) throw updateError
      
      console.log(`Reset quiz streaks for ${updates.length} users`)
    }

  } catch (error) {
    console.error('Error in checkAndResetQuizStreaks:', error)
    throw error
  }
}

async function getUserTimezone(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (error) throw error

    return data?.preferences?.settings?.general?.timezone || 'UTC' // Default to UTC if no timezone set
  } catch (error) {
    console.error('Error fetching user timezone:', error)
    return 'UTC' // Default to UTC on error
  }
}
