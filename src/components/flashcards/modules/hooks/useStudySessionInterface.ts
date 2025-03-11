"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { FlashcardDeck, Flashcard, StudySettings } from '@/types/flashcard';

interface StudyResults {
    totalCards: number;
    correctAnswers: number;
}

interface UseStudySessionProps {
    deck: FlashcardDeck;
    studySettings: StudySettings;
    onCompleteAction: (results: StudyResults) => void;
}

export function useStudySessionInterface({ deck, studySettings, onCompleteAction }: UseStudySessionProps) {
    // State for tracking the current study session
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studyResults, setStudyResults] = useState<StudyResults>({
        totalCards: 0,
        correctAnswers: 0
    });

    // Track if settings have changed to force reinitialization
    const settingsRef = useRef<string>("");
    
    // Create a settings signature to detect changes
    const settingsSignature = useMemo(() => JSON.stringify({
        cardsPerSession: studySettings.cardsPerSession,
        shuffleCards: studySettings.shuffleCards
    }), [studySettings]);
    
    // Prepare cards for study session
    const preparedCards = useMemo(() => {
        // Update settings reference
        settingsRef.current = settingsSignature;
        
        // Safety check
        if (!deck || !deck.cards || !Array.isArray(deck.cards)) {
            return [];
        }
        
        let cards = [...deck.cards];
        
        // Ensure we have cards to study
        if (cards.length === 0) {
            return [];
        }
        
        // Get settings
        const shuffleCards = studySettings.shuffleCards;
        
        // Shuffle cards if enabled
        if (shuffleCards) {
            // Regular shuffle for all cards
            cards = [...cards].sort(() => Math.random() - 0.5);
        }

        // Get cards per session setting
        let cardsPerSession = studySettings.cardsPerSession;
        
        // Calculate remaining cards in the deck that haven't been completed
        const completedCount = deck.completedCount || 0;
        const totalCards = cards.length;
        const remainingCards = Math.max(0, totalCards - completedCount);
        
        // Limit cards per session to the number of remaining cards
        cardsPerSession = Math.min(cardsPerSession, remainingCards);
        
        // Return the final set of cards for this study session
        return cards.slice(0, Math.min(cardsPerSession, cards.length));
    }, [deck, settingsSignature]);

    // Reset state when settings change
    useEffect(() => {
        // Check if settings have changed
        if (settingsRef.current !== settingsSignature) {
            // Reset states
            setCurrentIndex(0);
            setShowAnswer(false);
            setIsFlipped(false);
            setStudyResults({
                totalCards: preparedCards.length,
                correctAnswers: 0
            });
        }
    }, [settingsSignature, preparedCards.length]);
    
    // Handle empty card deck or initialize total cards count
    const hasCalledCompleteForEmptyCards = useRef(false);
    
    useEffect(() => {
        if (preparedCards.length === 0 && !hasCalledCompleteForEmptyCards.current) {
            // Mark that we've called onCompleteAction for empty cards
            hasCalledCompleteForEmptyCards.current = true;
            // End the session with empty results
            onCompleteAction({
                totalCards: 0,
                correctAnswers: 0
            });
        } else if (preparedCards.length > 0) {
            // Initialize totalCards with the actual count
            setStudyResults(prev => {
                if (prev.totalCards !== preparedCards.length) {
                    return {
                        ...prev,
                        totalCards: preparedCards.length
                    };
                }
                return prev;
            });
        }
    }, [preparedCards, onCompleteAction]);

    // Reset states when moving to next card
    useEffect(() => {
        setShowAnswer(false);
        setIsFlipped(false);
    }, [currentIndex]);

    // Handle user's confidence rating for a card
    const handleAnswer = useCallback((confidence: number) => {
        // Safety check for missing cards
        if (!preparedCards.length || !preparedCards[currentIndex]) {
            return;
        }
        
        const currentCard = preparedCards[currentIndex];
        
        // Update results
        const newResults = {
            totalCards: preparedCards.length,
            correctAnswers: studyResults.correctAnswers + 1
        };
        
        setStudyResults(newResults);

        // Move to next card or complete session
        if (currentIndex < preparedCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // We've reached the end of the deck - show the completion screen
            onCompleteAction(newResults);
        }
    }, [currentIndex, onCompleteAction, preparedCards, studyResults]);

    // Handle navigation to previous card
    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    // Handle navigation to next card
    const handleNext = useCallback(() => {
        if (currentIndex < preparedCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Create a new object to ensure we're not passing stale state
            const finalResults = {
                totalCards: preparedCards.length,
                correctAnswers: studyResults.correctAnswers
            };
            // We've reached the end of the deck - show the completion screen
            onCompleteAction(finalResults);
        }
    }, [currentIndex, onCompleteAction, preparedCards.length, studyResults]);

    return {
        currentCard: preparedCards[currentIndex],
        showAnswer,
        setShowAnswer,
        isFlipped,
        setIsFlipped,
        handleAnswer,
        handlePrevious,
        handleNext,
        progress: {
            current: currentIndex + 1,
            total: preparedCards.length
        },
        results: {
            ...studyResults,
            totalCards: preparedCards.length // Always use the correct total
        }
    };
}