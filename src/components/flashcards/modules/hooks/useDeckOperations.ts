import { useCallback } from "react"
import { useToast } from "@/contexts/toast-context"
import * as api from "../api/supabase"
import type { FlashcardDeck } from "../types"

export function useDeckOperations(
    userId: string | undefined, 
    setDecks: React.Dispatch<React.SetStateAction<FlashcardDeck[]>>
) {
    const { addToast } = useToast()

    const handleResetStats = useCallback(async (deckId: string) => {
        if (!userId) return

        try {
            // Use the new comprehensive reset function
            await api.resetDeckProgress(deckId, userId)
            
            // Refresh the decks after reset
            const decks = await api.fetchUserDecks(userId)
            setDecks(decks)

            addToast({
                title: "Success",
                description: "Deck progress reset successfully",
            })
        } catch (err) {
            console.error("Error resetting deck progress:", err)
            addToast({
                title: "Error",
                description: "Failed to reset deck progress",
                variant: "destructive",
            })
        }
    }, [userId, setDecks, addToast])

    const handleDeleteDeck = useCallback(async (deckId: string) => {
        if (!userId) return

        try {
            await api.deleteDeck(deckId)
            setDecks((prevDecks: FlashcardDeck[]) => prevDecks.filter((d: FlashcardDeck) => d.id !== deckId))

            addToast({
                title: "Success",
                description: "Deck deleted successfully",
            })
        } catch (err) {
            console.error("Error deleting deck:", err)
            addToast({
                title: "Error",
                description: "Failed to delete deck",
                variant: "destructive",
            })
        }
    }, [userId, setDecks, addToast])

    return {
        handleResetStats,
        handleDeleteDeck
    }
}
