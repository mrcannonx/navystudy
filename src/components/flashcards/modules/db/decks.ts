import { supabase } from "@/lib/supabase"
import { FlashcardDeck } from "../types"

export async function fetchDecks() {
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session?.user) return []

  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", session.session.user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function deleteDeck(deckId: string) {
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session?.user) return

  try {
    // First verify the deck belongs to the user
    const { data: deck } = await supabase
      .from("flashcards")
      .select("user_id")
      .eq("id", deckId)
      .single()

    if (deck?.user_id !== session.session.user.id) {
      throw new Error("Unauthorized: You can only delete your own decks")
    }

    // Confidence ratings are now stored in the flashcards table metadata

    // Delete card progress records
    const { error: deleteProgressError } = await supabase
      .from('card_progress')
      .delete()
      .eq('deck_id', deckId)
      .eq('user_id', session.session.user.id)

    if (deleteProgressError) throw deleteProgressError

    // Delete statistics
    const { error: deleteStatsError } = await supabase
      .from('flashcard_statistics')
      .delete()
      .eq('deck_id', deckId)
      .eq('user_id', session.session.user.id)

    if (deleteStatsError) throw deleteStatsError

    // Finally delete the deck
    const { error: deleteDeckError } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", deckId)
      .eq("user_id", session.session.user.id)

    if (deleteDeckError) throw deleteDeckError
  } catch (error) {
    console.error('Error deleting deck:', error)
    throw error
  }
} 