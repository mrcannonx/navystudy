import { supabase } from "@/lib/supabase"
import { StudyStatistics, StudySettings } from "../../types"
import { OVERALL_STATS_ID } from "./constants"
import { fetchStatistics, fetchDeckStatistics } from "./fetch"

export async function updateStatistics(
  userId: string,
  statistics: Partial<StudyStatistics>
): Promise<void> {
  try {
    const currentStats = await fetchStatistics(userId)
    const updatedStats: StudyStatistics = {
      ...currentStats,
      ...statistics,
      lastStudied: new Date().toISOString()
    }

    const { error } = await supabase
      .from('flashcard_statistics')
      .upsert({
        user_id: userId,
        deck_id: OVERALL_STATS_ID,
        statistics: {
          cardsStudied: updatedStats.cardsStudied,
          timeSpent: updatedStats.timeSpent,
          lastStudied: updatedStats.lastStudied,
          studiedCardIds: updatedStats.studiedCardIds,
          streak: updatedStats.streak,
          confidenceRatings: updatedStats.confidenceRatings
        },
        type_distribution: updatedStats.type_distribution,
        difficulty_distribution: updatedStats.difficulty_distribution,
        topic_progress: updatedStats.topic_progress,
        average_complexity: updatedStats.average_complexity,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,deck_id'
      })

    if (error) throw error
  } catch (error) {
    console.error('Error updating statistics:', error)
    throw error
  }
}

export async function updateDeckStatistics(
  userId: string,
  deckId: string,
  confidenceRatings: Record<string, 'easy' | 'medium' | 'hard'>,
  statistics: Partial<StudyStatistics>,
  settings: StudySettings
): Promise<void> {
  try {
    const currentStats = await fetchDeckStatistics(userId, deckId)
    const updatedStats: StudyStatistics = {
      ...currentStats,
      ...statistics,
      confidenceRatings: {
        ...(currentStats.confidenceRatings || {}),
        ...confidenceRatings
      },
      lastStudied: new Date().toISOString()
    }

    // Calculate difficulty distribution based on confidence ratings
    const difficultyDistribution = {
      easy: 0,
      medium: 0,
      hard: 0
    }

    Object.values(updatedStats.confidenceRatings || {}).forEach(rating => {
      difficultyDistribution[rating]++
    })

    const { error } = await supabase
      .from('flashcard_statistics')
      .upsert({
        user_id: userId,
        deck_id: deckId,
        statistics: {
          cardsStudied: updatedStats.cardsStudied,
          timeSpent: updatedStats.timeSpent,
          lastStudied: updatedStats.lastStudied,
          studiedCardIds: updatedStats.studiedCardIds,
          streak: updatedStats.streak,
          confidenceRatings: updatedStats.confidenceRatings
        },
        difficulty_distribution: difficultyDistribution,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,deck_id'
      })

    if (error) throw error
  } catch (error) {
    console.error('Error updating deck statistics:', error)
    throw error
  }
}

export async function resetDeckStatistics(userId: string, deckId: string): Promise<StudyStatistics> {
  try {
    const { error } = await supabase
      .from('flashcard_statistics')
      .delete()
      .eq('user_id', userId)
      .eq('deck_id', deckId)

    if (error) throw error

    return fetchDeckStatistics(userId, deckId)
  } catch (error) {
    console.error('Error resetting deck statistics:', error)
    throw error
  }
}

export async function recordCardProgress(userId: string, deckId: string, cardId: string): Promise<void> {
  try {
    const currentStats = await fetchDeckStatistics(userId, deckId)
    const studiedCardIds = new Set([...(currentStats.studiedCardIds || []), cardId])

    await updateDeckStatistics(
      userId,
      deckId,
      {},
      {
        studiedCardIds: Array.from(studiedCardIds),
        cardsStudied: studiedCardIds.size
      },
      {} as StudySettings
    )
  } catch (error) {
    console.error('Error recording card progress:', error)
    throw error
  }
} 