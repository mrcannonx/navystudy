"use client"

import { useAuth } from '@/contexts/auth'
import { useToast } from '@/components/ui/use-toast'
import { FlashcardDeck, StudyResults } from '@/types/flashcard'
import { handleError } from '@/lib/error-handler'
import { supabase } from '@/lib/supabase'
import * as api from '../api/supabase'

export function useStudySession() {
    const { user } = useAuth()
    const { toast } = useToast()

    const handleComplete = async (
        deckId: string,
        results: StudyResults,
        decks: FlashcardDeck[],
        setDecks: React.Dispatch<React.SetStateAction<FlashcardDeck[]>>
    ) => {
        if (!user) return;

        try {
            // Get the current deck
            const currentDeck = decks.find(d => d.id === deckId);
            if (!currentDeck) throw new Error('Deck not found');

            // Track the actual number of cards studied in the session
            // This ensures accurate progress tracking
            const totalCards = currentDeck.cards.length;
            
            // Get the number of cards studied in this session
            const cardsStudiedInSession = results.cards.length;
            
            // Get ONLY the cards that were actually studied in this session
            const studiedCards = results.cards.slice(0, results.totalAnswers);
            console.log(`FLASHCARD-DEBUG: Cards studied in this session: ${studiedCards.length}`);
            
            // Since confidence ratings have been removed from the application,
            // we'll count all cards studied in the session as completed
            
            // If results.totalAnswers is 0, it means we're in the "Back to Deck" flow
            // In this case, we should preserve the existing completed count
            let cardsStudiedCount = 0;
            let newCompletedCount = 0;
            
            if (results.totalAnswers === 0 && results.correctAnswers === 0) {
                // We're in the "Back to Deck" flow, preserve the existing completed count
                newCompletedCount = currentDeck.completedCount || totalCards;
                cardsStudiedCount = newCompletedCount;
                console.log("FLASHCARD-DEBUG: Preserving existing completed count:", newCompletedCount);
            } else {
                // Normal flow - calculate based on cards studied
                cardsStudiedCount = studiedCards.length > 0 ? studiedCards.length : results.totalAnswers;
                // If correctAnswers is 10 (all cards), set completedCount to totalCards
                if (results.correctAnswers === totalCards) {
                    newCompletedCount = totalCards;
                } else {
                    newCompletedCount = Math.min(totalCards, cardsStudiedCount);
                }
            }
            
            console.log("FLASHCARD-DEBUG: Using session-based completion tracking:", {
                deckId,
                totalCards,
                cardsStudiedInSession,
                cardsStudiedCount,
                newCompletedCount
            });
            
            // Update the completed_count to reflect the actual number of cards studied
            // This ensures accurate progress tracking
            const { error } = await supabase
                .from("flashcards")
                .update({
                    cards: results.cards,
                    last_studied_at: new Date().toISOString(),
                    completed_count: newCompletedCount, // Use the actual number of cards studied
                    current_cycle: currentDeck.currentCycle,
                    shown_cards_in_cycle: currentDeck.shownCardsInCycle,
                    // Add the new progress JSON field
                    progress: {
                        completedCount: newCompletedCount, // Use the actual number of cards studied
                        lastStudied: new Date().toISOString(),
                        currentCycle: currentDeck.currentCycle || 1,
                        shownCardsInCycle: currentDeck.shownCardsInCycle || [],
                        studiedCardIds: currentDeck.progress?.studiedCardIds || []
                    }
                })
                .filter('id', 'eq', deckId)
                .filter('user_id', 'eq', user.id);

            if (error) throw error;

            // Update local state - ensure it matches our database update
            setDecks(prevDecks =>
                prevDecks.map(d => {
                    if (d.id === deckId) {
                        return {
                            ...d,
                            cards: results.cards,
                            last_studied_at: new Date().toISOString(),
                            completedCount: newCompletedCount, // Use the actual number of cards studied
                            currentCycle: currentDeck.currentCycle,
                            shownCardsInCycle: currentDeck.shownCardsInCycle,
                            progress: {
                                completedCount: newCompletedCount, // Use the actual number of cards studied
                                lastStudied: new Date().toISOString(),
                                currentCycle: currentDeck.currentCycle || 1,
                                shownCardsInCycle: currentDeck.shownCardsInCycle || [],
                                studiedCardIds: currentDeck.progress?.studiedCardIds || []
                            }
                        };
                    }
                    return d;
                })
            );

            // Record flashcard study sessions in the user_activities table
            console.log("FLASHCARD-DEBUG: About to record flashcard study session for deck:", deckId);
            
            // Calculate total time spent
            const totalTimeSpent = results.studyDuration || (results.totalAnswers * 60); // Default to 60 seconds per card
            
            // Get ONLY the cards that were actually studied in this session (for recording purposes)
            const sessionStudiedCards = results.cards.slice(0, results.totalAnswers);
            
            console.log(`FLASHCARD-DEBUG: Found ${sessionStudiedCards.length} cards studied in the current session out of ${results.cards.length} total cards in deck`);
            
            // Record a single session for the deck with all card confidence ratings
            try {
                // First, record the overall session
                const sessionData = {
                    timeSpent: totalTimeSpent,
                    questionsAnswered: results.totalAnswers,
                    correctAnswers: results.correctAnswers,
                    confidenceRating: 0 // This will be ignored for the overall session
                };
                
                try {
                    // Record the session once for the deck
                    await api.recordFlashcardSession(
                        user.id,
                        deckId, // Use deckId as the cardId for the overall session
                        deckId,
                        sessionData
                    );
                    
                    console.log("FLASHCARD-DEBUG: Successfully recorded flashcard study session");
                } catch (sessionError) {
                    // If there's an error with the foreign key constraint, just log it and continue
                    // This is a known issue that will be fixed with the migration
                    console.log("FLASHCARD-DEBUG: Error recording session, continuing with confidence ratings:", sessionError);
                }
                
                // Get the current deck's study settings
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('preferences')
                    .eq('id', user.id)
                    .single();
                
                // Confidence ratings have been completely removed from the application
                console.log("FLASHCARD-DEBUG: Confidence ratings have been removed from the application");
            } catch (recordError) {
                // Log the error but don't throw it - we still want to update the deck progress
                console.error("FLASHCARD-DEBUG: Error recording session:", recordError);
            }

        } catch (err) {
            handleError(err, { toast: { toast } });
        }
    };

    return {
        handleComplete
    };
}