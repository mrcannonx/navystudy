"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth'
import { useToast } from '@/components/ui/use-toast'
import { FlashcardDeck, FlashcardDeckDB } from '@/types/flashcard'
import { handleError } from '@/lib/error-handler'
import { supabase } from '@/lib/supabase'

export function useDeckFetching() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [decks, setDecks] = useState<FlashcardDeck[]>([])

    useEffect(() => {
        if (user) {
            fetchDecks()
        }
    }, [user])

    const fetchDecks = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data: decksData, error } = await supabase
                .from("flashcards")
                .select("*")
                .filter('user_id', 'eq', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const parsedDecks: FlashcardDeck[] = decksData.map((deck: FlashcardDeckDB) => ({
                id: deck.id,
                userId: deck.user_id,
                name: deck.name,
                title: deck.title,
                description: deck.description,
                cards: deck.cards || [],
                createdAt: new Date(deck.created_at).getTime(),
                updatedAt: new Date(deck.updated_at).getTime(),
                pendingOperations: [],
                mastered_cards: deck.mastered_cards,
                total_cards: deck.total_cards,
                last_studied_at: deck.last_studied_at,
                completedCount: deck.completed_count,
                currentCycle: deck.current_cycle || 1,
                shownCardsInCycle: deck.shown_cards_in_cycle || [],
                progress: deck.progress || {
                    completedCount: 0,
                    lastStudied: new Date().toISOString(),
                    currentCycle: 1,
                    shownCardsInCycle: [],
                    studiedCardIds: []
                }
            }));

            setDecks(parsedDecks);
        } catch (err) {
            handleError(err, { toast: { toast } });
        } finally {
            setLoading(false);
        }
    };

    return {
        decks,
        setDecks,
        loading,
        fetchDecks
    };
}