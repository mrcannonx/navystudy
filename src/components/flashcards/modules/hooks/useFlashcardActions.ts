import { FlashcardState, FlashcardActionHandlers } from "./types/flashcard-actions.types"
import { useStudySessionActions } from "./useStudySessionActions"
import { useSettingsActions } from "./useSettingsActions"
import { useDeckManagementActions } from "./useDeckManagementActions"

/**
 * Main hook that composes all flashcard actions
 * This hook has been refactored to use smaller, more focused hooks
 * for better maintainability and separation of concerns
 */
export function useFlashcardActions(userId: string | undefined, state: FlashcardState): FlashcardActionHandlers {
  // Study session actions (start studying, next/previous card, complete study)
  const studySessionActions = useStudySessionActions(userId, state)
  
  // Settings actions (fetch and save settings)
  const settingsActions = useSettingsActions(userId, state)
  
  // Deck management actions (fetch, delete, reset stats)
  const deckActions = useDeckManagementActions(userId, state)

  // Combine all actions into a single object
  return {
    // Study session actions
    startStudying: studySessionActions.startStudying,
    nextCard: studySessionActions.nextCard,
    previousCard: studySessionActions.previousCard,
    handleCompleteStudy: studySessionActions.handleCompleteStudy,
    
    // Settings actions
    fetchStudySettings: settingsActions.fetchStudySettings,
    handleSaveSettings: settingsActions.handleSaveSettings,
    
    // Deck management actions
    fetchDecks: deckActions.fetchDecks,
    handleDeleteDeck: deckActions.handleDeleteDeck,
    handleResetDeckStats: deckActions.handleResetDeckStats
  }
}