import { supabase } from "@/lib/supabase"

export async function cleanupDuplicateProgress(userId: string, deckId?: string) {
  try {
    console.log('Starting progress cleanup')
    
    // First, get all progress records
    let query = supabase
      .from('card_progress')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (deckId) {
      query = query.eq('deck_id', deckId)
    }

    const { data: allProgress, error: fetchError } = await query
    if (fetchError) throw fetchError

    // Group by card_id and keep only the most recent
    const latestProgress = new Map()
    const duplicateIds: string[] = []

    allProgress?.forEach(record => {
      if (!latestProgress.has(record.card_id)) {
        latestProgress.set(record.card_id, record)
      } else {
        duplicateIds.push(record.id)
      }
    })

    if (duplicateIds.length > 0) {
      console.log(`Found ${duplicateIds.length} duplicate progress records to clean up`)
      // Delete all duplicates
      const { error: deleteError } = await supabase
        .from('card_progress')
        .delete()
        .in('id', duplicateIds)

      if (deleteError) throw deleteError
      console.log('Duplicate progress records cleaned up')
    }

    return Array.from(latestProgress.values())
  } catch (error) {
    console.error('Error cleaning up duplicate progress:', error)
    throw error
  }
}

export async function recordCardProgress(userId: string, deckId: string, cardId: string) {
  try {
    // Use upsert instead of insert to prevent duplicates
    const { error } = await supabase
      .from('card_progress')
      .upsert({
        user_id: userId,
        deck_id: deckId,
        card_id: cardId,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,deck_id,card_id'
      })

    if (error) throw error
  } catch (error) {
    console.error('Error recording card progress:', error)
    throw error
  }
}

export async function getCompletedCards(userId: string, deckId?: string) {
  let query = supabase
    .from('card_progress')
    .select('card_id, completed_at')
    .eq('user_id', userId)

  if (deckId) {
    query = query.eq('deck_id', deckId)
  }

  // Get only the most recent completion for each card
  query = query
    .order('completed_at', { ascending: false })
    .limit(1000) // Set a reasonable limit

  const { data, error } = await query

  if (error) throw error

  // Deduplicate by card_id, keeping only the most recent completion
  const uniqueCards = new Map()
  data?.forEach(card => {
    if (!uniqueCards.has(card.card_id) || 
        new Date(card.completed_at) > new Date(uniqueCards.get(card.card_id).completed_at)) {
      uniqueCards.set(card.card_id, card)
    }
  })

  return Array.from(uniqueCards.values()) || []
}

export async function deleteCardProgress(userId: string, deckId: string) {
  const { error } = await supabase
    .from('card_progress')
    .delete()
    .eq('deck_id', deckId)
    .eq('user_id', userId)

  if (error) throw error
} 