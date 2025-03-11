import { supabase } from '@/lib/supabase';

/**
 * Save multiple confidence ratings for cards in a deck
 *
 * @param userId - The user ID
 * @param deckId - The deck ID
 * @param confidenceRatings - Object mapping card IDs to confidence ratings
 * @returns Promise with success status and any error
 */
export async function saveConfidenceRatings(
  userId: string,
  deckId: string,
  confidenceRatings: Record<string, number>
): Promise<{ success: boolean; error?: any }> {
  try {
    // Validate inputs
    if (!userId || !deckId || !confidenceRatings) {
      return {
        success: false,
        error: "Missing required parameters"
      };
    }

    const now = new Date().toISOString();
    const cardIds = Object.keys(confidenceRatings);

    if (cardIds.length === 0) {
      return { success: true }; // Nothing to save
    }

    // Get the current deck data
    const { data: deck, error: deckError } = await supabase
      .from('flashcards')
      .select('cards, metadata')
      .eq('id', deckId)
      .eq('user_id', userId)
      .single();
      
    if (deckError) {
      console.error("Error fetching deck:", deckError);
      return { success: false, error: deckError };
    }
    
    if (!deck) {
      return { success: false, error: "Deck not found" };
    }
    
    // Create a ratings object to store in metadata
    const cardRatings: Record<string, number> = {};
    
    // Add all new ratings
    for (const cardId of cardIds) {
      cardRatings[cardId] = confidenceRatings[cardId];
    }
    
    // Add any existing ratings that aren't being updated
    if (deck.metadata?.cardRatings) {
      const existingCardRatings = deck.metadata.cardRatings;
      for (const cardId in existingCardRatings) {
        if (!cardRatings[cardId]) {
          cardRatings[cardId] = existingCardRatings[cardId];
        }
      }
    }
    
    // Calculate average rating for all cards
    const ratingValues = Object.values(cardRatings);
    const averageRating = ratingValues.length > 0
      ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
      : 3; // Default to medium if no ratings
    
    // Update the deck with the new metadata and last_studied_at
    const { error: updateError } = await supabase
      .from('flashcards')
      .update({
        last_studied_at: now,
        metadata: {
          ...deck.metadata,
          cardRatings,
          averageRating,
          lastUpdated: now
        }
      })
      .eq('id', deckId);

    if (updateError) {
      console.error("Error updating deck:", updateError);
      return { success: false, error: updateError };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving confidence ratings:', error);
    return { success: false, error };
  }
}

/**
 * Get confidence ratings for cards in a deck
 *
 * @param userId - The user ID
 * @param deckId - The deck ID
 * @returns Promise with confidence ratings and any error
 */
export async function getConfidenceRatings(
  userId: string,
  deckId: string
): Promise<{
  success: boolean;
  ratings?: Record<string, number>;
  error?: any
}> {
  try {
    // Get deck metadata containing confidence ratings
    const { data, error } = await supabase
      .from('flashcards')
      .select('metadata')
      .eq('id', deckId)
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no record is found, return an empty ratings object
      if (error.code === 'PGRST116') {
        return {
          success: true,
          ratings: {}
        };
      }
      throw error;
    }

    // Extract card ratings from metadata
    const cardRatings = data?.metadata?.cardRatings || {};

    return {
      success: true,
      ratings: cardRatings
    };
  } catch (error) {
    console.error('Error getting confidence ratings:', error);
    return { success: false, error };
  }
}

/**
 * Update the cards in a deck with their confidence ratings
 * 
 * @param deckId - The deck ID
 * @param confidenceRatings - Object mapping card IDs to confidence ratings
 * @returns Promise with success status and any error
 */
export async function updateCardsWithConfidenceRatings(
  deckId: string,
  confidenceRatings: Record<string, number>
): Promise<{ success: boolean; error?: any }> {
  try {
    // Get the current cards from the deck
    const { data: deck, error: deckError } = await supabase
      .from('flashcards')
      .select('cards')
      .eq('id', deckId)
      .single();

    if (deckError) {
      throw deckError;
    }

    if (!deck?.cards || !Array.isArray(deck.cards)) {
      return { success: false, error: "No cards found in deck" };
    }

    // Update the confidence rating for each card
    const updatedCards = deck.cards.map(card => {
      if (card.id && confidenceRatings[card.id] !== undefined) {
        return {
          ...card,
          confidence: confidenceRatings[card.id]
        };
      }
      return card;
    });

    // Update the deck with the updated cards
    const { error: updateError } = await supabase
      .from('flashcards')
      .update({ cards: updatedCards })
      .eq('id', deckId);

    if (updateError) {
      throw updateError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating cards with confidence ratings:', error);
    return { success: false, error };
  }
}