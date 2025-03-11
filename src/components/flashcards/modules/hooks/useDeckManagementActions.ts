import { useCallback } from "react"
import { FlashcardDeck } from "@/types/flashcard"
import { FlashcardState } from "./types/flashcard-actions.types"
import { useToast } from "@/components/ui/use-toast"
import * as api from "../api/supabase"

/**
 * Hook for managing deck-related actions like fetching and deleting
 */
export function useDeckManagementActions(userId: string | undefined, state: FlashcardState) {
  const { toast } = useToast()

  /**
   * Fetches all decks for the current user
   */
  const fetchDecks = useCallback(async () => {
    if (!userId) return
    
    state.setLoading(true)
    try {
      const decks = await api.fetchUserDecks(userId)
      // Use type assertion to ensure compatibility
      state.setDecks(decks as unknown as FlashcardDeck[])
    } catch (err) {
      console.error("Error fetching decks:", err)
      toast({
        title: "Error",
        description: "Failed to fetch decks",
        variant: "destructive",
      })
    } finally {
      state.setLoading(false)
    }
  }, [userId, state, toast])

  /**
   * Deletes a deck by ID
   */
  const handleDeleteDeck = useCallback(async (deckId: string) => {
    if (!userId) return

    try {
      await api.deleteDeck(deckId)
      
      // Update local state to remove the deleted deck
      state.setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId))
      
      toast({
        title: "Success",
        description: "Deck deleted successfully",
      })
    } catch (err) {
      console.error("Error deleting deck:", err)
      toast({
        title: "Error",
        description: "Failed to delete deck",
        variant: "destructive",
      })
    }
  }, [userId, state, toast])

  /**
   * Resets statistics for a deck
   */
  const handleResetDeckStats = useCallback(async (deckId: string) => {
    if (!userId) return

    try {
      await api.resetDeckProgress(deckId, userId)
      
      // Update local state to reset the deck's statistics
      state.setDecks(prevDecks => 
        prevDecks.map(deck => {
          if (deck.id === deckId) {
            return {
              ...deck,
              completedCount: 0,
              progress: {
                completedCount: 0,
                lastStudied: new Date().toISOString(),
                currentCycle: 1,
                shownCardsInCycle: [],
                studiedCardIds: []
              },
              statistics: {
                cardsStudied: 0,
                timeSpent: 0,
                lastStudied: new Date().toISOString(),
                studiedCardIds: []
              }
            }
          }
          return deck
        })
      )
      
      toast({
        title: "Success",
        description: "Deck statistics reset successfully",
      })
    } catch (err) {
      console.error("Error resetting deck statistics:", err)
      toast({
        title: "Error",
        description: "Failed to reset deck statistics",
        variant: "destructive",
      })
    }
  }, [userId, state, toast])

  return {
    fetchDecks,
    handleDeleteDeck,
    handleResetDeckStats
  }
}