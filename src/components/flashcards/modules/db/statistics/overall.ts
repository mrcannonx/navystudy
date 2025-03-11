import { supabase } from "@/lib/supabase"
import { StudyStatistics, FlashcardStatistics, DatabaseRecord, StatisticsUpdate } from "./types"

// Special UUID for overall statistics
export const OVERALL_STATS_ID = '00000000-0000-0000-0000-000000000000'

export async function cleanupDuplicateOverallStatistics(userId: string) {
  try {
    const { data: records, error: fetchError } = await supabase
      .from('flashcard_statistics')
      .select('*')
      .eq('user_id', userId)
      .eq('deck_id', OVERALL_STATS_ID)
      .order('updated_at', { ascending: false })

    if (fetchError) throw fetchError

    if (records && records.length > 1) {
      const [mostRecent, ...outdated] = records
      
      const mergedStats = outdated.reduce((merged, record) => ({
        cardsStudied: Math.max(merged.cardsStudied, record.statistics.cardsStudied || 0),
        timeSpent: merged.timeSpent + (record.statistics.timeSpent || 0),
        lastStudied: mostRecent.statistics.lastStudied,
        streak: Math.max(merged.streak, record.statistics.streak || 0),
        studiedCardIds: Array.from(new Set([
          ...(merged.studiedCardIds || []),
          ...(record.statistics.studiedCardIds || [])
        ]))
      }), mostRecent.statistics)

      const { error: updateError } = await supabase
        .from('flashcard_statistics')
        .update({
          statistics: mergedStats,
          updated_at: new Date().toISOString()
        })
        .eq('id', mostRecent.id)

      if (updateError) throw updateError

      const outdatedIds = outdated.map(r => r.id)
      const { error: deleteError } = await supabase
        .from('flashcard_statistics')
        .delete()
        .in('id', outdatedIds)

      if (deleteError) throw deleteError

      return mergedStats
    }

    return records?.[0]?.statistics
  } catch (error) {
    console.error('Error cleaning up duplicate statistics:', error)
    throw error
  }
}

export async function fetchStatistics(userId: string): Promise<StudyStatistics> {
  try {
    const { data: rawData, error } = await supabase
      .from("flashcard_statistics")
      .select("statistics, updated_at")
      .eq("user_id", userId)
      .eq("deck_id", OVERALL_STATS_ID)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error('Error fetching statistics:', error)
      throw error
    }

    if (!rawData || !rawData.statistics) {
      const initialStats: DatabaseRecord = {
        user_id: userId,
        deck_id: OVERALL_STATS_ID,
        statistics: {
          cardsStudied: 0,
          timeSpent: 0,
          studiedCardIds: [],
          streak: 0,
          lastStudied: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }

      const { data: insertedData, error: insertError } = await supabase
        .from("flashcard_statistics")
        .insert(initialStats)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating initial statistics:', insertError)
        throw insertError
      }

      return {
        ...initialStats.statistics,
        streak: 0,
        confidenceRatings: {},
        type_distribution: {
          basic: 0,
          cloze: 0
        },
        difficulty_distribution: {
          easy: 0,
          medium: 0,
          hard: 0
        },
        topic_progress: [],
        average_complexity: 0
      }
    }

    return {
      cardsStudied: rawData.statistics.cardsStudied || 0,
      timeSpent: rawData.statistics.timeSpent || 0,
      lastStudied: rawData.statistics.lastStudied || rawData.updated_at,
      studiedCardIds: rawData.statistics.studiedCardIds || [],
      streak: rawData.statistics.streak || 0,
      confidenceRatings: rawData.statistics.confidenceRatings || {},
      type_distribution: {
        basic: 0,
        cloze: 0
      },
      difficulty_distribution: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      topic_progress: [],
      average_complexity: 0
    }
  } catch (error) {
    console.error('Error in fetchStatistics:', error)
    return {
      cardsStudied: 0,
      timeSpent: 0,
      lastStudied: new Date().toISOString(),
      streak: 0,
      studiedCardIds: [],
      confidenceRatings: {},
      type_distribution: {
        basic: 0,
        cloze: 0
      },
      difficulty_distribution: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      topic_progress: [],
      average_complexity: 0
    }
  }
}

export async function updateStatistics(userId: string, update: StatisticsUpdate) {
  try {
    const currentStats = await fetchStatistics(userId)
    
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
    const lastStudyDate = new Date(currentStats.lastStudied)
    const lastStudyLocal = new Date(lastStudyDate.toLocaleString('en-US', { timeZone: timezone }))

    // Calculate days between last study and today in user's timezone
    const daysDiff = Math.floor(
      (today.getTime() - lastStudyLocal.getTime()) / (1000 * 60 * 60 * 24)
    )

    let newStreak = currentStats.streak

    // Format dates to compare only the date part (YYYY-MM-DD)
    const todayStr = today.toISOString().split('T')[0]
    const lastStudyStr = lastStudyLocal.toISOString().split('T')[0]

    if (todayStr === lastStudyStr) {
      // Same day in user's timezone, keep streak
      newStreak = currentStats.streak
    } else if (daysDiff === 1) {
      // Next day in user's timezone, increment streak
      newStreak = currentStats.streak + 1
    } else {
      // More than one day passed in user's timezone, reset streak
      newStreak = 1
    }

    const { error } = await supabase
      .from("flashcard_statistics")
      .upsert({
        user_id: userId,
        deck_id: OVERALL_STATS_ID,
        statistics: {
          cardsStudied: update.cardsStudied,
          timeSpent: update.timeSpent,
          studiedCardIds: update.studiedCardIds,
          streak: newStreak,
          lastStudied: now.toISOString() // Store in UTC
        },
        updated_at: now.toISOString()
      })

    if (error) throw error
    
    return newStreak
  } catch (error) {
    console.error('Error updating statistics:', error)
    throw error
  }
}
