import { supabase } from "@/lib/supabase"
import { StudyStatistics } from "../../types"
import { DEFAULT_STATISTICS } from "./defaults"
import { OVERALL_STATS_ID } from "./constants"
import { cleanupDuplicateOverallStatistics } from "./cleanup"

export async function fetchStatistics(userId: string): Promise<StudyStatistics> {
  try {
    await cleanupDuplicateOverallStatistics(userId)

    const { data, error } = await supabase
      .from('flashcard_statistics')
      .select('*')
      .eq('user_id', userId)
      .eq('deck_id', OVERALL_STATS_ID)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (!data) {
      const { error: insertError } = await supabase
        .from('flashcard_statistics')
        .insert({
          user_id: userId,
          deck_id: OVERALL_STATS_ID,
          statistics: DEFAULT_STATISTICS,
          type_distribution: DEFAULT_STATISTICS.type_distribution,
          difficulty_distribution: DEFAULT_STATISTICS.difficulty_distribution,
          topic_progress: DEFAULT_STATISTICS.topic_progress,
          average_complexity: DEFAULT_STATISTICS.average_complexity,
          updated_at: new Date().toISOString()
        })

      if (insertError) throw insertError
      return DEFAULT_STATISTICS
    }

    return {
      cardsStudied: data.statistics.cardsStudied || 0,
      timeSpent: data.statistics.timeSpent || 0,
      lastStudied: data.statistics.lastStudied || new Date().toISOString(),
      studiedCardIds: data.statistics.studiedCardIds || [],
      streak: data.statistics.streak || 0,
      confidenceRatings: data.statistics.confidenceRatings || {},
      type_distribution: data.type_distribution || DEFAULT_STATISTICS.type_distribution,
      difficulty_distribution: data.difficulty_distribution || DEFAULT_STATISTICS.difficulty_distribution,
      topic_progress: data.topic_progress || [],
      average_complexity: data.average_complexity || 0
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return DEFAULT_STATISTICS
  }
}

export async function fetchDeckStatistics(userId: string, deckId: string): Promise<StudyStatistics> {
  try {
    const { data, error } = await supabase
      .from('flashcard_statistics')
      .select('*')
      .eq('user_id', userId)
      .eq('deck_id', deckId)
      .order('updated_at', { ascending: false })

    if (error) throw error

    if (data && data.length > 1) {
      const [mostRecent, ...duplicates] = data
      
      const duplicateIds = duplicates.map(d => d.id)
      await supabase
        .from('flashcard_statistics')
        .delete()
        .in('id', duplicateIds)

      return {
        cardsStudied: mostRecent.statistics.cardsStudied || 0,
        timeSpent: mostRecent.statistics.timeSpent || 0,
        lastStudied: mostRecent.statistics.lastStudied || mostRecent.updated_at,
        studiedCardIds: mostRecent.statistics.studiedCardIds || [],
        streak: mostRecent.statistics.streak || 0,
        confidenceRatings: mostRecent.statistics.confidenceRatings || {},
        type_distribution: mostRecent.type_distribution || DEFAULT_STATISTICS.type_distribution,
        difficulty_distribution: mostRecent.difficulty_distribution || DEFAULT_STATISTICS.difficulty_distribution,
        topic_progress: mostRecent.topic_progress || [],
        average_complexity: mostRecent.average_complexity || 0
      }
    }

    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('flashcard_statistics')
        .insert({
          user_id: userId,
          deck_id: deckId,
          statistics: DEFAULT_STATISTICS,
          type_distribution: DEFAULT_STATISTICS.type_distribution,
          difficulty_distribution: DEFAULT_STATISTICS.difficulty_distribution,
          topic_progress: DEFAULT_STATISTICS.topic_progress,
          average_complexity: DEFAULT_STATISTICS.average_complexity,
          updated_at: new Date().toISOString()
        })

      if (insertError) throw insertError
      return DEFAULT_STATISTICS
    }

    return {
      cardsStudied: data[0].statistics.cardsStudied || 0,
      timeSpent: data[0].statistics.timeSpent || 0,
      lastStudied: data[0].statistics.lastStudied || data[0].updated_at,
      studiedCardIds: data[0].statistics.studiedCardIds || [],
      streak: data[0].statistics.streak || 0,
      confidenceRatings: data[0].statistics.confidenceRatings || {},
      type_distribution: data[0].type_distribution || DEFAULT_STATISTICS.type_distribution,
      difficulty_distribution: data[0].difficulty_distribution || DEFAULT_STATISTICS.difficulty_distribution,
      topic_progress: data[0].topic_progress || [],
      average_complexity: data[0].average_complexity || 0
    }
  } catch (error) {
    console.error('Error fetching deck statistics:', error)
    return DEFAULT_STATISTICS
  }
}

// Re-export for backward compatibility
export { fetchStatistics as fetchFlashcardStatistics }; 