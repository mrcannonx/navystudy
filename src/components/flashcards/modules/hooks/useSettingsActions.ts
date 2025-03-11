import { useCallback } from "react"
import { StudySettings } from "@/types/flashcard"
import { FlashcardState } from "./types/flashcard-actions.types"
import { fetchUserStudySettings, saveStudySettings } from "../services/flashcard-db.service"
import { useToast } from "@/components/ui/use-toast"

/**
 * Hook for managing flashcard settings actions
 */
export function useSettingsActions(userId: string | undefined, state: FlashcardState) {
  const { toast } = useToast()

  /**
   * Fetches user study settings from the database
   */
  const fetchStudySettings = useCallback(async () => {
    if (!userId) return

    try {
      const settings = await fetchUserStudySettings(userId)
      
      if (settings) {
        state.setStudySettings(settings)
      } else {
        // No settings found, create default settings
        const defaultSettings: StudySettings = {
          studyMode: 'quickReview',
          cardsPerSession: 10,
          shuffleCards: true,
          showExplanations: true,
          soundEffects: false,
          generalSettings: {
            cardsPerSession: 10,
            shuffleCards: true,
            showExplanations: true,
            soundEffects: false
          }
        }

        // Save default settings to profile
        await saveStudySettings(userId, defaultSettings)
        state.setStudySettings(defaultSettings)
      }
    } catch (err) {
      console.error('Error fetching study settings:', err)
      throw err
    }
  }, [userId, state])

  /**
   * Saves study settings to the database
   */
  const handleSaveSettings = useCallback(async (settings: StudySettings) => {
    if (!userId) return

    try {
      await saveStudySettings(userId, settings)
      
      state.setStudySettings(settings)
      state.setShowSettings(false)
      toast({
        title: "Success",
        description: "Study settings saved successfully",
      })
    } catch (err) {
      console.error("Error saving study settings:", err)
      toast({
        title: "Error",
        description: "Failed to save study settings",
        variant: "destructive",
      })
    }
  }, [userId, state, toast])

  return {
    fetchStudySettings,
    handleSaveSettings
  }
}