import { supabase } from '@/lib/supabase'
import { FlashcardDeck, StudySettings } from "@/types/flashcard"
import { FlashcardProgress } from '../hooks/types/flashcard-actions.types'

/**
 * Updates the progress of a flashcard deck in the database
 */
export async function updateDeckProgress(
  deckId: string, 
  progressData: FlashcardProgress,
  completedCount: number
): Promise<void> {
  try {
    const { error } = await supabase
      .from('flashcards')
      .update({ 
        completed_count: completedCount,
        last_studied_at: progressData.lastStudied,
        progress: progressData
      })
      .eq('id', deckId)

    if (error) throw error
  } catch (err) {
    console.error("Error updating flashcard progress:", err)
    throw err
  }
}

/**
 * Fetches user study settings from their profile
 */
export async function fetchUserStudySettings(userId: string): Promise<StudySettings | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (error) throw error

    return profile?.preferences?.flashcardSettings || null
  } catch (err) {
    console.error('Error fetching study settings:', err)
    throw err
  }
}

/**
 * Saves study settings to the user's profile
 */
export async function saveStudySettings(
  userId: string, 
  settings: StudySettings,
  existingPreferences?: any
): Promise<void> {
  try {
    // Get current preferences if not provided
    let preferences = existingPreferences
    
    if (!preferences) {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single()

      if (fetchError) throw fetchError
      preferences = profile?.preferences
    }

    // Update preferences with new flashcard settings
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        preferences: {
          ...preferences,
          flashcardSettings: settings
        }
      })
      .eq('id', userId)

    if (updateError) throw updateError
  } catch (err) {
    console.error("Error saving study settings:", err)
    throw err
  }
}

/**
 * Completes a study session and updates all relevant statistics
 */
export async function completeStudySession(
  userId: string,
  deckId: string,
  progressData: FlashcardProgress
): Promise<void> {
  try {
    const { error } = await supabase
      .from('flashcards')
      .update({ 
        completed_count: progressData.completedCount,
        last_studied_at: progressData.lastStudied,
        progress: progressData
      })
      .eq('id', deckId)
      
    if (error) {
      throw error
    }
  } catch (err) {
    console.error("Error completing study session:", err)
    throw err
  }
}