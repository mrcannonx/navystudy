import { createClient } from '@supabase/supabase-js'
import { OVERALL_STATS_ID } from '../db/statistics/overall'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // Use service role key for background job
)

export async function checkAndResetStreaks() {
  try {
    // Get all users with their statistics
    const { data: users, error: fetchError } = await supabase
      .from('flashcard_statistics')
      .select('user_id, statistics, updated_at')
      .eq('deck_id', OVERALL_STATS_ID)

    if (fetchError) throw fetchError

    const now = new Date()
    const updates = []

    for (const user of users || []) {
      const userTimezone = await getUserTimezone(user.user_id)
      const userLocalDate = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
      const lastStudyDate = new Date(user.statistics.lastStudied)
      const lastStudyLocalDate = new Date(lastStudyDate.toLocaleString('en-US', { timeZone: userTimezone }))

      // Calculate days difference in user's timezone
      const daysDiff = Math.floor(
        (userLocalDate.getTime() - lastStudyLocalDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      // If more than 1 day has passed without studying, reset streak
      if (daysDiff > 1) {
        updates.push({
          user_id: user.user_id,
          deck_id: OVERALL_STATS_ID,
          statistics: {
            ...user.statistics,
            streak: 0,
            // Keep other statistics intact
            cardsStudied: user.statistics.cardsStudied,
            timeSpent: user.statistics.timeSpent,
            studiedCardIds: user.statistics.studiedCardIds,
            lastStudied: user.statistics.lastStudied
          },
          updated_at: now.toISOString()
        })
      }
    }

    // Batch update all users who need streak reset
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('flashcard_statistics')
        .upsert(updates)

      if (updateError) throw updateError
      
      console.log(`Reset streaks for ${updates.length} users`)
    }

  } catch (error) {
    console.error('Error in checkAndResetStreaks:', error)
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
