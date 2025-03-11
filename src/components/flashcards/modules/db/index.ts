import { FlashcardDeck, StudySettings, StudyStatistics } from "../types"
import { supabase } from "@/lib/supabase"
import { updateStatistics } from "./statistics/"

// Helper function to get auth headers
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`
  }
}

// Fetch all decks for a user
export async function fetchDecks(userId: string): Promise<FlashcardDeck[]> {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/flashcards/decks?userId=${userId}`, {
    headers
  })
  if (!response.ok) {
    throw new Error("Failed to fetch decks")
  }
  return response.json()
}

// Delete a deck and its associated data
export async function deleteDeck(deckId: string): Promise<void> {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/flashcards/decks/${deckId}`, {
    method: "DELETE",
    headers
  })
  if (!response.ok) {
    throw new Error("Failed to delete deck")
  }
}

// Reset deck statistics
export async function resetDeckStatistics(
  userId: string,
  deckId: string
): Promise<StudyStatistics> {
  const headers = await getAuthHeaders()
  const response = await fetch(
    `/api/flashcards/statistics/${userId}/deck/${deckId}/reset`,
    {
      method: "POST",
      headers
    }
  )
  if (!response.ok) {
    throw new Error("Failed to reset deck statistics")
  }
  return response.json()
}

// Fetch deck confidence ratings
export async function fetchDeckConfidenceRatings(
  userId: string,
  deckId: string
): Promise<Record<string, number>> {
  const headers = await getAuthHeaders()
  const response = await fetch(
    `/api/flashcards/ratings/${userId}/deck/${deckId}`,
    {
      headers
    }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch confidence ratings")
  }
  return response.json()
}

// Update confidence rating for a card
export async function updateConfidenceRating(
  userId: string,
  deckId: string,
  cardId: string,
  rating: number
): Promise<void> {
  console.log('Updating confidence rating:', { userId, deckId, cardId, rating })
  const headers = await getAuthHeaders()
  const response = await fetch(
    `/api/flashcards/ratings/${userId}/deck/${deckId}/card/${cardId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ rating }),
    }
  )
  
  const data = await response.json()
  
  if (!response.ok) {
    console.error('Failed to update confidence rating:', data)
    throw new Error(data.error || "Failed to update confidence rating")
  }
}

// Record card progress
export async function recordCardProgress(
  userId: string,
  deckId: string,
  cardId: string
): Promise<void> {
  console.log('Recording progress for card:', { userId, deckId, cardId })
  const headers = await getAuthHeaders()
  const response = await fetch(
    `/api/flashcards/progress/${userId}/deck/${deckId}/card/${cardId}`,
    {
      method: "POST",
      headers
    }
  )
  
  const data = await response.json()
  
  if (!response.ok) {
    console.error('Failed to record card progress:', {
      status: response.status,
      statusText: response.statusText,
      data
    })
    throw new Error(data.error || "Failed to record card progress")
  }
  
  console.log('Successfully recorded progress for card:', cardId)
}

// Update deck statistics
export async function updateDeckStatistics(
  userId: string,
  deckId: string,
  confidenceRatings: Record<string, number>,
  stats: Partial<StudyStatistics>,
  settings: StudySettings
): Promise<void> {
  const headers = await getAuthHeaders()
  const response = await fetch(
    `/api/flashcards/statistics/${userId}/deck/${deckId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        confidenceRatings,
        stats,
        settings,
      }),
    }
  )
  if (!response.ok) {
    throw new Error("Failed to update deck statistics")
  }
}

// Fetch statistics for a user
export async function fetchStatistics(userId: string): Promise<StudyStatistics> {
  console.log('DB: Fetching statistics for user:', userId)
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/flashcards/settings/${userId}`, {
    headers
  })
  if (!response.ok) {
    console.error('DB: Failed to fetch statistics:', response.status, response.statusText)
    throw new Error("Failed to fetch statistics")
  }
  const data = await response.json()
  console.log('DB: Received statistics data:', data)
  // The statistics are stored in the statistics field of the response
  return data.statistics || {
    cardsStudied: 0,
    timeSpent: 0,
    confidenceRatings: {},
    lastStudied: new Date().toISOString(),
    streak: 0,
    studiedCardIds: []
  }
}

// Fetch deck statistics
export async function fetchDeckStatistics(
  userId: string,
  deckId: string
): Promise<StudyStatistics> {
  const headers = await getAuthHeaders()
  const response = await fetch(
    `/api/flashcards/statistics/${userId}/deck/${deckId}`,
    {
      headers
    }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch deck statistics")
  }
  return response.json()
}

// Fetch study settings
export async function fetchStudySettings(userId: string): Promise<StudySettings | null> {
  console.log('DB: Fetching study settings for user:', userId)
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`/api/flashcards/settings/${userId}`, {
      headers
    })
    if (!response.ok) {
      console.error('DB: Failed to fetch study settings:', response.status, response.statusText)
      throw new Error('Failed to fetch study settings')
    }
    const data = await response.json()
    console.log('DB: Received study settings:', data)
    return data
  } catch (error) {
    console.error('DB: Error in fetchStudySettings:', error)
    throw error
  }
}

// Save study settings
export async function updateStudySettings(userId: string, settings: StudySettings): Promise<void> {
  console.log('DB: Updating study settings for user:', userId, 'with:', settings)
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`/api/flashcards/settings/${userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(settings),
    })
    if (!response.ok) {
      console.error('DB: Failed to update study settings:', response.status, response.statusText)
      throw new Error('Failed to update study settings')
    }
    const data = await response.json()
    console.log('DB: Study settings update response:', data)
    return data
  } catch (error) {
    console.error('DB: Error in updateStudySettings:', error)
    throw error
  }
}

export { updateStatistics }

export async function updateCardMetadata(
  userId: string,
  deckId: string,
  cardId: string,
  metadata: Record<string, any>
): Promise<void> {
  // First, fetch the current cards array
  const { data: currentData, error: fetchError } = await supabase
    .from('flashcards')
    .select('cards')
    .eq('id', deckId)
    .eq('user_id', userId)
    .single()

  if (fetchError) throw fetchError

  // Update the metadata of the specific card
  const updatedCards = currentData.cards.map((card: any) => 
    card.id === cardId 
      ? { ...card, metadata: { ...card.metadata, ...metadata } }
      : card
  )

  // Update the cards array
  const { error: updateError } = await supabase
    .from('flashcards')
    .update({ cards: updatedCards })
    .eq('id', deckId)
    .eq('user_id', userId)

  if (updateError) throw updateError
} 