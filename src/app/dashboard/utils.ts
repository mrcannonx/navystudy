import { supabase } from "@/lib/supabase"

interface CardProgress {
  card_id: string
  completed_at: string
  deck_id: string
}

interface ConfidenceRating {
  card_id: string
  rating: number
  deck_id: string
}

interface FlashcardStatistics {
  cardsStudied: number
  timeSpent: number
  lastStudied: string
  streak: number
  studiedCardIds: string[]
}

export async function fetchFlashcardStatistics(userId: string): Promise<FlashcardStatistics> {
  try {
    console.log('Dashboard: Fetching statistics for user:', userId)
    
    // First get all completed cards from card_progress
    const { data: completedCards, error: progressError } = await supabase
      .from('card_progress')
      .select('card_id, completed_at, deck_id')
      .eq('user_id', userId)
    
    if (progressError) throw progressError
    console.log('Dashboard: Completed cards:', completedCards?.length || 0)

    // Get confidence ratings from flashcards metadata
    const { data: decks, error: decksError } = await supabase
      .from('flashcards')
      .select('id, metadata')
      .eq('user_id', userId)
    
    if (decksError) throw decksError
    
    // Extract confidence ratings from deck metadata
    const confidenceRatings: ConfidenceRating[] = [];
    decks?.forEach(deck => {
      const cardRatings = deck.metadata?.cardRatings || {};
      Object.entries(cardRatings).forEach(([cardId, rating]) => {
        confidenceRatings.push({
          card_id: cardId,
          rating: Number(rating),
          deck_id: deck.id
        });
      });
    });
    
    console.log('Dashboard: Confidence ratings:', confidenceRatings.length || 0)

    // Calculate base statistics
    const uniqueCardIds = new Set((completedCards as CardProgress[] || []).map(card => card.card_id))
    const lastStudied = completedCards?.length > 0 
      ? Math.max(...(completedCards as CardProgress[]).map(card => new Date(card.completed_at).getTime()))
      : new Date().getTime()

    // Get overall statistics for streak
    const { data: overallStats, error: statsError } = await supabase
      .from('flashcard_statistics')
      .select('statistics')
      .eq('user_id', userId)
      .is('deck_id', null)
      .single()
    
    if (statsError && statsError.code !== 'PGRST116') throw statsError

    // Calculate time spent (assuming each card takes ~1 minute to study)
    const timeSpent = (completedCards as CardProgress[] || []).reduce((total: number, card: CardProgress) => total + 60, 0)

    // Calculate streak
    const streak = overallStats?.statistics?.streak || 0
    
    const stats: FlashcardStatistics = {
      cardsStudied: uniqueCardIds.size,
      timeSpent,
      lastStudied: new Date(lastStudied).toISOString(),
      streak,
      studiedCardIds: Array.from(uniqueCardIds)
    }

    console.log('Dashboard: Calculated statistics:', stats)
    
    return stats
  } catch (err) {
    console.error('Error fetching flashcard statistics:', err)
    return {
      cardsStudied: 0,
      timeSpent: 0,
      lastStudied: new Date().toISOString(),
      streak: 0,
      studiedCardIds: []
    }
  }
} 