import { useCallback } from "react"
import { FlashcardDeck, StudySettings } from "../types"
import * as db from "../db"

interface DeckState {
  setDecks: (decks: FlashcardDeck[] | ((prev: FlashcardDeck[]) => FlashcardDeck[])) => void
  setLoading: (loading: boolean) => void
  setCurrentDeck: (deck: FlashcardDeck | null) => void
  setStudySettings: (settings: StudySettings) => void
}

interface ToastProps {
  title: string
  description: string
  variant?: "destructive" | "default"
}

export function useDeckManager(
  userId: string | undefined,
  state: DeckState,
  onError: (props: ToastProps) => void
) {
  const {
    setDecks,
    setLoading,
    setCurrentDeck,
    setStudySettings
  } = state

  const fetchDecks = useCallback(async () => {
    try {
      if (!userId) return
      const data = await db.fetchDecks(userId)
      setDecks(data)
    } catch (err) {
      console.error("Error fetching flashcard decks:", err)
      onError({
        title: "Error",
        description: "Failed to load flashcard decks",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [userId, setDecks, setLoading, onError])

  const fetchStudySettings = useCallback(async () => {
    if (!userId) return
    try {
      const settings = await db.fetchStudySettings(userId)
      if (settings) {
        setStudySettings(settings)
      }
    } catch (err) {
      console.error('Error fetching study settings:', err)
      onError({
        title: "Error",
        description: "Failed to load study settings",
        variant: "destructive"
      })
      // Use default settings as fallback
      setStudySettings({
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
      })
    }
  }, [userId, setStudySettings, onError])

  const deleteDeck = useCallback(async (deckId: string) => {
    try {
      await db.deleteDeck(deckId)
      setDecks((prevDecks: FlashcardDeck[]) => 
        prevDecks.filter((deck: FlashcardDeck) => deck.id !== deckId)
      )
      setCurrentDeck(null)
      return true
    } catch (err) {
      console.error("Error deleting deck:", err)
      onError({
        title: "Error",
        description: "Failed to delete flashcard deck",
        variant: "destructive"
      })
      return false
    }
  }, [setDecks, setCurrentDeck, onError])

  return {
    fetchDecks,
    fetchStudySettings,
    deleteDeck
  }
}
