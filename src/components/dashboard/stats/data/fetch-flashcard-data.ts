import { supabase } from "@/lib/supabase";

/**
 * Fetches the total number of flashcards available to the user
 * @returns The total number of cards across all decks
 */
export async function fetchTotalFlashcards(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    
    // Get all flashcard decks for the user
    const { data: decks, error } = await supabase
      .from('flashcards')
      .select('cards')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching flashcard decks:', error);
      return 0;
    }
    
    // Count the total number of cards across all decks
    let totalCards = 0;
    decks?.forEach((deck: { cards?: any[] }) => {
      if (deck.cards && Array.isArray(deck.cards)) {
        totalCards += deck.cards.length;
      }
    });
    
    return totalCards;
  } catch (error) {
    console.error('Error counting flashcards:', error);
    return 0;
  }
}