import { supabase } from "@/lib/supabase"

export async function fetchDeckConfidenceRatings(userId: string, deckId: string) {
  const { data, error } = await supabase
    .from('flashcards')
    .select('study_data')
    .eq('id', deckId)
    .single()

  if (error) throw error

  // Convert to the expected format
  const ratings: Record<string, number> = {}
  if (data?.study_data?.confidenceRatings) {
    Object.entries(data.study_data.confidenceRatings).forEach(([cardId, rating]) => {
      ratings[cardId] = rating as number
    })
  }

  return ratings
}

export async function updateConfidenceRating(
  userId: string,
  deckId: string,
  cardId: string,
  rating: number
) {
  // First get the current study_data
  const { data: existingDeck, error: fetchError } = await supabase
    .from('flashcards')
    .select('study_data')
    .eq('id', deckId)
    .single()

  if (fetchError) throw fetchError

  const studyData = existingDeck.study_data || {
    cardsStudied: 0,
    timeSpent: 0,
    lastStudied: null,
    streak: 0,
    studiedCardIds: [],
    confidenceRatings: {}
  }

  // Add card to studied cards if not already there
  const studiedCardIds = new Set(studyData.studiedCardIds || [])
  studiedCardIds.add(cardId)

  const updatedStudyData = {
    ...studyData,
    cardsStudied: studiedCardIds.size,
    lastStudied: new Date().toISOString(),
    studiedCardIds: Array.from(studiedCardIds),
    confidenceRatings: {
      ...(studyData.confidenceRatings || {}),
      [cardId]: rating
    }
  }

  // Update the deck with new study data
  const { error: updateError } = await supabase
    .from('flashcards')
    .update({ 
      study_data: updatedStudyData,
      updated_at: new Date().toISOString()
    })
    .eq('id', deckId)

  if (updateError) throw updateError
}

export async function deleteConfidenceRatings(userId: string, deckId: string) {
  // Get the current study_data
  const { data: existingDeck, error: fetchError } = await supabase
    .from('flashcards')
    .select('study_data')
    .eq('id', deckId)
    .single()

  if (fetchError) throw fetchError

  const studyData = existingDeck.study_data || {
    cardsStudied: 0,
    timeSpent: 0,
    lastStudied: null,
    streak: 0,
    studiedCardIds: [],
    confidenceRatings: {}
  }

  // Clear confidence ratings but keep other study data
  const updatedStudyData = {
    ...studyData,
    confidenceRatings: {}
  }

  // Update the deck with cleared confidence ratings
  const { error: updateError } = await supabase
    .from('flashcards')
    .update({ 
      study_data: updatedStudyData,
      updated_at: new Date().toISOString()
    })
    .eq('id', deckId)

  if (updateError) throw updateError
} 