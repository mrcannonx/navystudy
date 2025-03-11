import { supabase } from '@/lib/supabase'
import { StudyMetrics } from '@/hooks/use-study-analytics'
import { StudySettings } from '@/components/flashcards/types/study-settings'
import { FlashcardDeck } from '../types'

export { supabase }

export async function fetchUserDecks(userId: string): Promise<FlashcardDeck[]> {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Map database fields to application fields
    const decks = (data || []).map(deck => {
      // Extract progress data from the JSON progress field if available
      const progressData = deck.progress || {};
      
      // Ensure completed_count is properly transferred to the completedCount field
      // First check deck.completed_count, then fall back to progress.completedCount
      return {
        ...deck,
        completedCount: deck.completed_count || progressData.completedCount || 0,
        currentCycle: deck.current_cycle || progressData.currentCycle || 1,
        shownCardsInCycle: deck.shown_cards_in_cycle || progressData.shownCardsInCycle || [],
        lastStudiedAt: deck.last_studied_at || progressData.lastStudied,
        // Also add progress object to ensure all progress data is available
        progress: progressData
      }
    })
    
    return decks
  } catch (error) {
    console.error('Error fetching user decks:', error)
    throw error
  }
}

export async function updateStudySettings(userId: string, settings: StudySettings): Promise<void> {
  try {
    // Get current preferences to preserve other settings
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (getError) throw getError

    const { error } = await supabase
      .from('profiles')
      .update({
        preferences: {
          ...profile?.preferences,
          study_settings: settings
        }
      })
      .eq('id', userId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating study settings:', error)
    throw error
  }
}

export async function deleteDeck(deckId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', deckId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting deck:', error)
    throw error
  }
}

export async function updateDeckStatistics(deckId: string, statistics: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('flashcards')
      .update({ 
        statistics,
        completedCount: 0 // Reset the completedCount when resetting stats
      })
      .eq('id', deckId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating deck statistics:', error)
    throw error
  }
}

export async function resetDeckProgress(deckId: string, userId: string): Promise<void> {
  try {
    // First, get the current completed_count to subtract from total stats
    const { data: currentDeck, error: getCurrentError } = await supabase
      .from('flashcards')
      .select('completed_count')
      .eq('id', deckId)
      .single()
    
    if (getCurrentError) throw getCurrentError
    
    // Update the progress JSON column with reset values and reset completed_count
    const { error: updateProgressError } = await supabase
      .from('flashcards')
      .update({
        progress: {
          completedCount: 0,
          lastStudied: new Date().toISOString(),
          currentCycle: 1,
          shownCardsInCycle: [],
          studiedCardIds: []
        },
        completed_count: 0, // Reset the completed_count field
        current_cycle: 1,   // Reset current_cycle field
        shown_cards_in_cycle: [] // Reset shown_cards_in_cycle field
      })
      .eq('id', deckId)

    if (updateProgressError) throw updateProgressError

    // No need to reset confidence levels as they've been removed from the application
  } catch (error) {
    console.error('Error resetting deck progress:', error)
    throw error
  }
}

export async function getFlashcardSettings(userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (error) throw error

    return {
      success: true,
      settings: profile?.preferences?.settings?.flashcard || {
        cardsPerSession: 10,
        shuffleCards: true
      }
    }
  } catch (error) {
    console.error('Error fetching flashcard settings:', error)
    return {
      success: false,
      error,
      settings: {
        cardsPerSession: 10,
        shuffleCards: true
      }
    }
  }
}

export async function updateFlashcardSettings(userId: string, newSettings: any) {
  try {
    // Get existing preferences to preserve other settings
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (getError) throw getError

    const currentSettings = profile?.preferences?.settings || {
      quiz: {
        questionsPerSession: 10,
        shuffleQuestions: true
      },
      general: {
        theme: 'light',
        notifications: true
      }
    }

    // Update only flashcard settings while preserving others
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        preferences: {
          ...profile?.preferences,
          settings: {
            ...currentSettings,
            flashcard: newSettings
          }
        }
      })
      .eq('id', userId)

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error('Error updating flashcard settings:', error)
    return { success: false, error }
  }
}

export async function recordFlashcardSession(
  userId: string,
  cardId: string,
  deckId: string,
  metrics: StudyMetrics
) {
  console.log("FLASHCARD-DEBUG: recordFlashcardSession called with:", {
    userId,
    cardId,
    deckId,
    metrics
  });
  
  // Validate that we have a valid cardId
  if (!cardId) {
    console.error("FLASHCARD-DEBUG: Missing cardId in recordFlashcardSession");
    return { success: false, error: "Missing cardId" };
  }
  
  try {
    const now = new Date().toISOString();
    
    // Update the flashcard deck's last_studied_at field
    const { error: updateDeckError } = await supabase
      .from('flashcards')
      .update({
        last_studied_at: now
      })
      .eq('id', deckId);
    
    if (updateDeckError) {
      console.error("FLASHCARD-DEBUG: Error updating flashcard last_studied_at:", updateDeckError);
      throw updateDeckError;
    }
    
    // Get the current deck data to update metadata
    const { data: deck, error: deckFetchError } = await supabase
      .from('flashcards')
      .select('metadata')
      .eq('id', deckId)
      .single();
      
    if (deckFetchError) {
      console.error("FLASHCARD-DEBUG: Error fetching deck metadata:", deckFetchError);
      throw deckFetchError;
    }
    
    // Update the deck metadata with the study timestamp
    const metadata = deck?.metadata || {};
    
    // Update the deck with the new metadata
    const { error: metadataError } = await supabase
      .from('flashcards')
      .update({
        metadata: {
          ...metadata,
          lastStudied: now,
          lastUpdated: now
        }
      })
      .eq('id', deckId);
      
    if (metadataError) {
      console.error("FLASHCARD-DEBUG: Error updating deck metadata:", metadataError);
      throw metadataError;
    }
    
    // Record the study session in the user_activities table
    const { error: sessionError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: 'flashcard_study',
        content_id: deckId,
        content_type: 'flashcard',
        content_title: 'Flashcard Study Session',
        created_at: now,
        activity_data: {
          cards_studied: 1,
          time_spent: metrics.timeSpent || 0
        }
      });
    
    if (sessionError) {
      console.error("FLASHCARD-DEBUG: Error recording study activity:", sessionError);
      // Don't throw here, as we've already updated the deck metadata
      // Just log the error and continue
    } else {
      console.log("FLASHCARD-DEBUG: Successfully recorded study activity");
    }
    
    console.log("FLASHCARD-DEBUG: Successfully recorded flashcard session");
    return { success: true }
  } catch (error) {
    console.error('FLASHCARD-DEBUG: Error recording flashcard session:', error)
    return { success: false, error }
  }
}

export async function getFlashcardAnalytics(userId: string, deckId: string) {
  try {
    // Get deck information including cards, metadata, and last_studied_at
    const { data: deckData, error: deckError } = await supabase
      .from('flashcards')
      .select('cards, metadata, last_studied_at')
      .eq('id', deckId)
      .single();
      
    if (deckError) throw deckError;
    
    // Get study activity data from user_activities
    const { data: activityData, error: activityError } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', deckId)
      .eq('activity_type', 'flashcard_study')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (activityError) {
      console.error("Error fetching activity data:", activityError);
    }
    
    // Transform data to match expected analytics format
    const analytics = {
      ratings: [], // Empty array as confidence ratings have been removed
      lastStudied: deckData?.last_studied_at || null,
      studyActivities: activityData || []
    }

    return {
      success: true,
      analytics
    }
  } catch (error) {
    console.error('Error fetching flashcard analytics:', error)
    return { success: false, error }
  }
}

// This function is no longer needed as confidence ratings have been removed from the application
export async function updateConfidenceRating(
  userId: string,
  cardId: string,
  deckId: string,
  rating: number
) {
  console.log("FLASHCARD-DEBUG: updateConfidenceRating is deprecated - confidence ratings have been removed");
  
  try {
    const now = new Date().toISOString();
    
    // Just record a study activity without confidence rating
    const { error: sessionError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: 'flashcard_study',
        content_id: deckId,
        content_type: 'flashcard',
        content_title: 'Flashcard Study',
        created_at: now,
        activity_data: {
          cards_studied: 1,
          time_spent: 0
        }
      });
    
    if (sessionError) {
      console.error("FLASHCARD-DEBUG: Error recording study activity:", sessionError);
    } else {
      console.log("FLASHCARD-DEBUG: Successfully recorded study activity");
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error recording flashcard study:', error)
    return { success: false, error }
  }
}
