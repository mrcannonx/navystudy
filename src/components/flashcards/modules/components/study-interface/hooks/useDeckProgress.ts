"use client"

import { useState, useCallback, useRef } from 'react';
import type { FlashcardDeck } from '@/types/flashcard';

export function useDeckProgress(deck: FlashcardDeck) {
  const [updatedDeck, setUpdatedDeck] = useState(deck);
  // Use a ref to track if we've already processed this session
  const processedSessionRef = useRef<Record<string, boolean>>({});
  
  const updateDeckProgress = useCallback((sessionResults: {
    totalCards: number;
    correctAnswers: number;
  }): FlashcardDeck | null => {
    // Create a session identifier based on the results
    const sessionId = JSON.stringify(sessionResults);
    
    // If we've already processed this exact session, return the current deck to prevent loops
    if (processedSessionRef.current[sessionId]) {
      console.log("FLASHCARD-LOG: Skipping duplicate session update");
      return updatedDeck;
    }
    
    // Mark this session as processed
    processedSessionRef.current[sessionId] = true;
    
    // Calculate how many cards can actually be added to the completed count
    const remainingCards = deck.cards.length - (deck.completedCount || 0);
    
    // Count all correct answers as completed
    const cardsToAdd = Math.min(sessionResults.correctAnswers, remainingCards);
    
    console.log("FLASHCARD-LOG: Limiting cards to add:", {
      totalCards: deck.cards.length,
      currentCompleted: deck.completedCount || 0,
      remainingCards,
      sessionCards: sessionResults.totalCards,
      correctAnswers: sessionResults.correctAnswers,
      cardsToAdd
    });
    
    const newDeck = { ...deck };
    newDeck.completedCount = (newDeck.completedCount || 0) + cardsToAdd;
    newDeck.progress = {
      ...newDeck.progress,
      completedCount: (newDeck.progress?.completedCount || 0) + cardsToAdd,
      lastStudied: new Date().toISOString(),
      studiedCardIds: [...(newDeck.progress?.studiedCardIds || [])],
      // Make sure required properties are included
      currentCycle: newDeck.progress?.currentCycle || 1,
      shownCardsInCycle: newDeck.progress?.shownCardsInCycle || []
    };
    
    setUpdatedDeck(newDeck);
    return newDeck;
  }, [deck, updatedDeck]);
  
  return {
    deck: updatedDeck,
    updateDeckProgress
  };
}