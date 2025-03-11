"use client"

import { useAuth } from '@/contexts/auth'
import { useToast } from '@/components/ui/use-toast'
import { FlashcardDeck } from '@/types/flashcard'
import { handleError } from '@/lib/error-handler'
import { supabase } from '@/lib/supabase'
import * as api from '../api/supabase'

export function useDeckOperations() {
    const { user } = useAuth()
    const { toast } = useToast()

    const handleDeleteDeck = async (
        deckId: string,
        setDecks: React.Dispatch<React.SetStateAction<FlashcardDeck[]>>
    ) => {
        if (!user) return;

        try {
            // First verify the deck exists and belongs to the user
            const { data: deck, error: fetchError } = await supabase
                .from("flashcards")
                .select("id")
                .filter('id', 'eq', deckId)
                .filter('user_id', 'eq', user.id)
                .single();

            if (fetchError) {
                console.error('Error fetching deck:', fetchError);
                throw new Error(`Failed to fetch deck: ${fetchError.message}`);
            }
            if (!deck) {
                console.error('Deck not found:', { deckId, userId: user.id });
                throw new Error(`Deck not found with ID: ${deckId}`);
            }

            // Delete the flashcard using explicit filter
            const { error: deleteError } = await supabase
                .from("flashcards")
                .delete()
                .filter('id', 'eq', deckId)
                .filter('user_id', 'eq', user.id);

            if (deleteError) {
                console.error('Error deleting deck:', deleteError);
                throw new Error(`Failed to delete deck: ${deleteError.message}`);
            }

            setDecks(prevDecks => prevDecks.filter(d => d.id !== deckId));

            toast({
                title: "Success",
                description: "Deck has been deleted",
            });
        } catch (err) {
            handleError(err, { toast: { toast } });
        }
    };

    const handleResetStats = async (
        deckId: string,
        setDecks: React.Dispatch<React.SetStateAction<FlashcardDeck[]>>,
        refreshStatistics: () => Promise<void>
    ) => {
        if (!user) return;

        try {
            await api.resetDeckProgress(deckId, user.id);
            
            // Update local state after reset
            setDecks(prevDecks =>
                prevDecks.map(d => {
                    if (d.id === deckId) {
                        return {
                            ...d,
                            completedCount: 0,
                            last_studied_at: new Date().toISOString(),
                            currentCycle: 1,
                            shownCardsInCycle: [],
                            progress: {
                                completedCount: 0,
                                lastStudied: new Date().toISOString(),
                                currentCycle: 1,
                                shownCardsInCycle: [],
                                studiedCardIds: []
                            },
                            cards: d.cards.map(card => ({
                                ...card,
                                confidence: 0
                            }))
                        };
                    }
                    return d;
                })
            );

            // Refresh global statistics to update dashboard stats
            await refreshStatistics();

            toast({
                title: "Success",
                description: "Deck progress has been reset",
            });
        } catch (err) {
            handleError(err, { toast: { toast } });
        }
    };

    return {
        handleDeleteDeck,
        handleResetStats
    };
}