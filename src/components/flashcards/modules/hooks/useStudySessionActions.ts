import { useCallback } from "react"
import { FlashcardDeck } from "@/types/flashcard"
import { FlashcardState, FlashcardProgress } from "./types/flashcard-actions.types"
import { updateDeckProgress, completeStudySession } from "../services/flashcard-db.service"
import { useToast } from "@/components/ui/use-toast"

/**
 * Hook for managing study session actions
 */
export function useStudySessionActions(userId: string | undefined, state: FlashcardState) {
  const { toast } = useToast()

  /**
   * Starts a study session with the selected deck
   */
  const handleStartStudying = useCallback(async (deck: FlashcardDeck) => {
    state.setCurrentDeck(deck)
    state.setCurrentCardIndex(0)
    state.setIsCompleted(false)
    state.setShouldScrollToTop(true)
    state.setStudyStartTime(new Date())
  }, [state])

  /**
   * Moves to the next card in the study session
   */
  const handleNextCard = useCallback(async () => {
    if (!state.currentDeck) return

    // Update the current deck's completed count
    const updatedCompletedCount = state.currentCardIndex + 1
    const deckId = state.currentDeck.id
    const currentTimestamp = new Date().toISOString()
    
    // Get the current card ID
    const currentCardId = state.currentDeck.cards[state.currentCardIndex].id
    
    // Extract existing progress data
    const existingProgress = state.currentDeck.progress || {} as Partial<FlashcardProgress>
    const existingCompletedCount = existingProgress.completedCount || 0
    const existingStudiedCardIds = existingProgress.studiedCardIds || []
    
    // Update progress data with this card
    const updatedStudiedCardIds = Array.from(new Set([...existingStudiedCardIds, currentCardId]))
    const progressData: FlashcardProgress = {
      completedCount: Math.max(updatedCompletedCount, existingCompletedCount),
      lastStudied: currentTimestamp,
      currentCycle: existingProgress.currentCycle || 1,
      shownCardsInCycle: existingProgress.shownCardsInCycle || [],
      studiedCardIds: updatedStudiedCardIds,
      timeSpent: existingProgress.timeSpent || 0,
      streak: existingProgress.streak || 0
    }
    
    // Update the local state
    const updatedDeck: FlashcardDeck = {
      ...state.currentDeck,
      completedCount: updatedCompletedCount,
      progress: progressData,
      lastStudiedAt: currentTimestamp
    }
    state.setCurrentDeck(updatedDeck)
    
    // Also update this deck in the main decks array to ensure progress bar updates
    const updatedDecks = state.decks.map((deck: FlashcardDeck) => 
      deck.id === deckId 
        ? { 
            ...deck, 
            completedCount: updatedCompletedCount,
            progress: progressData,
            lastStudiedAt: currentTimestamp
          }
        : deck
    )
    state.setDecks(updatedDecks)
    
    // Save the completed count and progress to the database
    try {
      await updateDeckProgress(deckId, progressData, updatedCompletedCount)
    } catch (err) {
      console.error("Error updating flashcard progress:", err)
    }

    if (state.currentDeck.cards.length > 0 && state.currentCardIndex === state.currentDeck.cards.length - 1) {
      state.setIsCompleted(true)
    } else {
      state.setCurrentCardIndex(prev => prev + 1)
    }
  }, [state])

  /**
   * Moves to the previous card in the study session
   */
  const handlePreviousCard = useCallback(async () => {
    if (!state.currentDeck || state.currentCardIndex === 0) return
    state.setCurrentCardIndex(prev => prev - 1)
  }, [state])

  /**
   * Completes the study session and updates all statistics
   */
  const handleCompleteStudy = useCallback(async () => {
    try {
      if (!userId || !state.currentDeck || !state.studyStartTime) return
      
      // Calculate time spent in milliseconds
      const endTime = new Date()
      const timeSpent = endTime.getTime() - state.studyStartTime.getTime()
      
      // Get the current deck ID
      const deckId = state.currentDeck.id
      const completedCount = state.currentDeck?.cards.length || 0
      const currentTimestamp = new Date().toISOString()
      
      // Extract studiedCardIds from existing statistics if available
      const existingStudiedCardIds = 
        state.currentDeck.progress?.studiedCardIds || 
        state.currentDeck.statistics?.studiedCardIds || 
        []

      // Get all card IDs from the current deck
      const allCardIds = state.currentDeck.cards.map(card => card.id)
      
      // Create combined list of studied card IDs, removing duplicates
      const combinedStudiedCardIds = Array.from(new Set([...existingStudiedCardIds, ...allCardIds]))
      
      // Create progress object
      const progressData: FlashcardProgress = {
        completedCount: completedCount,
        lastStudied: currentTimestamp,
        timeSpent: Math.floor(timeSpent / 1000) + (state.currentDeck.progress?.timeSpent || 0),
        currentCycle: (state.currentDeck.currentCycle || 1),
        shownCardsInCycle: allCardIds,
        studiedCardIds: combinedStudiedCardIds
      }
      
      // Update the deck statistics
      const updatedDecks = state.decks.map((deck: FlashcardDeck) => {
        if (deck.id === deckId) {
          // Update the deck's completedCount, progress and statistics
          return {
            ...deck,
            completedCount: completedCount,
            progress: progressData,
            statistics: {
              ...(deck.statistics || {}),
              cardsStudied: completedCount,
              timeSpent: ((deck.statistics?.timeSpent) || 0) + Math.floor(timeSpent / 1000),
              lastStudied: currentTimestamp,
              studiedCardIds: combinedStudiedCardIds
            }
          }
        }
        return deck
      })
      
      // Update state with the updated decks
      state.setDecks(updatedDecks)
      
      // Save the completed count and progress data to the database
      await completeStudySession(userId, deckId, progressData)
      
      // Clear the current deck state
      state.setCurrentDeck(null)
      state.setCurrentCardIndex(0)
      state.setIsCompleted(false)
      state.setStudyStartTime(null)
      state.setShouldScrollToTop(true)

      toast({
        title: "Success",
        description: "Study session completed",
      })
      
    } catch (err) {
      console.error("Error completing study session:", err)
      toast({
        title: "Error",
        description: "Failed to complete study session",
        variant: "destructive",
      })
    }
  }, [userId, state, toast])

  return {
    startStudying: handleStartStudying,
    nextCard: handleNextCard,
    previousCard: handlePreviousCard,
    handleCompleteStudy
  }
}