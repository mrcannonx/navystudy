import { supabase } from "@/lib/supabase"
import { getCompletedCards } from "../progress"
import { updateConfidenceRating } from "../confidence"
import { fetchStatistics } from "./overall"
import { StudySettings, StudyStatistics, FlashcardStatistics } from "../../types"
import { DatabaseRecord, StatisticsUpdate } from "./types"

// Special UUID for overall statistics
const OVERALL_STATS_ID = '00000000-0000-0000-0000-000000000000'

export async function fetchDeckStatistics(userId: string, deckId: string) {
  try {
    const { data, error } = await supabase
      .from('flashcard_statistics')
      .select('statistics')
      .eq('user_id', userId)
      .eq('deck_id', deckId)
      .single()

    if (error && error.code !== "PGRST116") throw error

    if (!data) {
      // Create initial deck statistics
      const initialStats = {
        user_id: userId,
        deck_id: deckId,
        statistics: {
          cardsStudied: 0,
          timeSpent: 0,
          studiedCardIds: [],
          lastStudied: new Date().toISOString()
        }
      }

      const { error: insertError } = await supabase
        .from("flashcard_statistics")
        .insert(initialStats)

      if (insertError) throw insertError

      return {
        cardsStudied: 0,
        timeSpent: 0,
        lastStudied: new Date().toISOString(),
        studiedCardIds: []
      }
    }

    return {
      cardsStudied: data.statistics.cardsStudied || 0,
      timeSpent: data.statistics.timeSpent || 0,
      lastStudied: data.statistics.lastStudied || new Date().toISOString(),
      studiedCardIds: data.statistics.studiedCardIds || []
    }
  } catch (error) {
    console.error('Error fetching deck statistics:', error)
    throw error
  }
}

export async function updateDeckStatistics(
  userId: string, 
  deckId: string, 
  update: StatisticsUpdate | Partial<StudyStatistics>,
  confidenceRatings?: Record<string, number>,
  settings?: StudySettings
) {
  try {
    // Confidence ratings have been removed

    // Get completed cards for this deck if needed
    let completedCardIds: string[] = []
    let allCompletedCardIds: string[] = []
    
    if ('studiedCardIds' in update && update.studiedCardIds) {
      completedCardIds = update.studiedCardIds
    } else {
      const completedCards = await getCompletedCards(userId, deckId)
      completedCardIds = completedCards.map(card => card.card_id)
      
      const allCompletedCards = await getCompletedCards(userId)
      allCompletedCardIds = allCompletedCards.map(card => card.card_id)
    }

    // Get current overall statistics for streak calculation
    const currentOverallStats = await fetchStatistics(userId)
    
    // Calculate streak
    const today = new Date().toISOString().split('T')[0]
    const lastStudyDate = new Date(currentOverallStats.lastStudied).toISOString().split('T')[0]
    let newStreak = currentOverallStats.streak || 0

    if (today === lastStudyDate) {
      newStreak = currentOverallStats.streak
    } else if (
      new Date(today).getTime() - new Date(lastStudyDate).getTime() <= 86400000
    ) {
      newStreak = (currentOverallStats.streak || 0) + 1
    } else {
      newStreak = 1
    }

    // Calculate new total time spent
    const newTimeSpent = (currentOverallStats.timeSpent || 0) + 
      ('timeSpent' in update ? update.timeSpent || 0 : 0)

    // Prepare updates
    const updates = [
      // Deck-specific statistics
      {
        user_id: userId,
        deck_id: deckId,
        statistics: {
          cardsStudied: 'cardsStudied' in update ? update.cardsStudied : completedCardIds.length,
          timeSpent: 'timeSpent' in update ? update.timeSpent : 0,
          lastStudied: new Date().toISOString(),
          studiedCardIds: completedCardIds
        } as FlashcardStatistics,
        updated_at: new Date().toISOString()
      }
    ]

    // Add overall statistics update if we have completed cards data
    if (allCompletedCardIds.length > 0) {
      updates.push({
        user_id: userId,
        deck_id: OVERALL_STATS_ID,
        statistics: {
          cardsStudied: allCompletedCardIds.length,
          timeSpent: newTimeSpent,
          lastStudied: new Date().toISOString(),
          streak: newStreak,
          studiedCardIds: allCompletedCardIds
        } as FlashcardStatistics,
        updated_at: new Date().toISOString()
      })
    }

    // Update records
    const { error: upsertError } = await supabase
      .from('flashcard_statistics')
      .upsert(updates, {
        onConflict: 'user_id,deck_id'
      })

    if (upsertError) throw upsertError

  } catch (error) {
    console.error('Error updating statistics:', error)
    throw error
  }
}

export async function resetDeckStatistics(userId: string, deckId: string) {
  try {
    console.log('Starting database reset for deck:', deckId)

    // Delete only the statistics for the specified deck
    console.log('Deleting statistics for deck:', deckId)
    const { error: deleteStatsError } = await supabase
      .from('flashcard_statistics')
      .delete()
      .eq('user_id', userId)
      .eq('deck_id', deckId)

    if (deleteStatsError) {
      console.error('Error deleting statistics:', deleteStatsError)
      throw deleteStatsError
    }
    console.log('Deck statistics deleted')

    // Create fresh deck statistics
    console.log('Creating fresh deck statistics')
    const { error: createDeckStatsError } = await supabase
      .from('flashcard_statistics')
      .insert({
        user_id: userId,
        deck_id: deckId,
        statistics: {
          cardsStudied: 0,
          timeSpent: 0,
          lastStudied: new Date().toISOString(),
          studiedCardIds: []
        },
        updated_at: new Date().toISOString()
      })

    if (createDeckStatsError) {
      console.error('Error creating fresh deck statistics:', createDeckStatsError)
      throw createDeckStatsError
    }
    console.log('Fresh deck statistics created')

    // Return the new statistics for frontend update
    return {
      deckStats: {
        cardsStudied: 0,
        timeSpent: 0,
        lastStudied: new Date().toISOString(),
        studiedCardIds: []
      }
    }
  } catch (error) {
    console.error('Database error during reset:', error)
    throw error
  }
}
