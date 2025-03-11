import { supabase } from "@/lib/supabase"
import { StudyStatistics } from "../../types"
import { OVERALL_STATS_ID } from "./constants"

export async function cleanupDuplicateOverallStatistics(userId: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('flashcard_statistics')
      .select('*')
      .eq('user_id', userId)
      .eq('deck_id', OVERALL_STATS_ID)
      .order('updated_at', { ascending: false })

    if (error) throw error

    if (!data || data.length <= 1) {
      return
    }

    const [mostRecent, ...duplicates] = data
    const mergedStats: StudyStatistics = {
      ...mostRecent.statistics,
      studiedCardIds: Array.from(new Set([
        ...(mostRecent.statistics.studiedCardIds || []),
        ...duplicates.flatMap(d => d.statistics.studiedCardIds || [])
      ])),
      cardsStudied: Math.max(
        mostRecent.statistics.cardsStudied || 0,
        ...duplicates.map(d => d.statistics.cardsStudied || 0)
      ),
      timeSpent: Math.max(
        mostRecent.statistics.timeSpent || 0,
        ...duplicates.map(d => d.statistics.timeSpent || 0)
      ),
      streak: Math.max(
        mostRecent.statistics.streak || 0,
        ...duplicates.map(d => d.statistics.streak || 0)
      ),
      confidenceRatings: {
        ...duplicates.reduce((acc, d) => ({ ...acc, ...(d.statistics.confidenceRatings || {}) }), {}),
        ...(mostRecent.statistics.confidenceRatings || {})
      },
      type_distribution: {
        ...duplicates.reduce((acc, d) => ({ ...acc, ...(d.type_distribution || {}) }), {}),
        ...(mostRecent.type_distribution || {})
      },
      difficulty_distribution: {
        ...duplicates.reduce((acc, d) => ({ ...acc, ...(d.difficulty_distribution || {}) }), {}),
        ...(mostRecent.difficulty_distribution || {})
      },
      topic_progress: Array.from(new Set([
        ...(mostRecent.topic_progress || []),
        ...duplicates.flatMap(d => d.topic_progress || [])
      ])),
      average_complexity: Math.max(
        mostRecent.average_complexity || 0,
        ...duplicates.map(d => d.average_complexity || 0)
      )
    }

    const { error: updateError } = await supabase
      .from('flashcard_statistics')
      .update({
        statistics: mergedStats,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('deck_id', OVERALL_STATS_ID)
      .eq('id', mostRecent.id)

    if (updateError) throw updateError

    const duplicateIds = duplicates.map(d => d.id)
    const { error: deleteError } = await supabase
      .from('flashcard_statistics')
      .delete()
      .in('id', duplicateIds)

    if (deleteError) throw deleteError

    console.log(`Cleaned up ${duplicateIds.length} duplicate overall statistics records for user ${userId}`)
  } catch (error) {
    console.error('Error cleaning up duplicate statistics:', error)
    throw error
  }
} 