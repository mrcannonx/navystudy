import { useCallback } from "react"
import * as db from "../db"
import { StudySettings } from "../types"

interface ConfidenceState {
  setDeckConfidenceRatings: (ratings: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void
}

export function useConfidenceManager(
  userId: string | undefined,
  state: ConfidenceState
) {
  const { setDeckConfidenceRatings } = state

  const updateConfidenceRating = useCallback(async (
    deckId: string,
    cardId: string,
    rating: number,
    studySettings: StudySettings
  ) => {
    try {
      if (!userId) return
      
      // Update confidence rating
      await db.updateConfidenceRating(userId, deckId, cardId, rating)
      setDeckConfidenceRatings((prev: Record<string, number>) => ({
        ...prev,
        [cardId]: rating
      }))

      // Update deck statistics to include this card as studied
      const currentStats = await db.fetchDeckStatistics(userId, deckId)
      const studiedCardIds = new Set(currentStats.studiedCardIds || [])
      studiedCardIds.add(cardId)

      await db.updateDeckStatistics(
        userId,
        deckId,
        { [cardId]: rating },
        {
          cardsStudied: studiedCardIds.size,
          studiedCardIds: Array.from(studiedCardIds),
          lastStudied: new Date().toISOString()
        },
        studySettings
      )

      return true
    } catch (err) {
      console.error("Error updating confidence rating:", err)
      return false
    }
  }, [userId, setDeckConfidenceRatings])

  return {
    updateConfidenceRating
  }
} 