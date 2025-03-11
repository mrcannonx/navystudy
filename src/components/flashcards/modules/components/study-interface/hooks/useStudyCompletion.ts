"use client"

import { useState } from 'react';
import type { FlashcardDeck, StudyResults } from '@/types/flashcard';

export function useStudyCompletion(
  deck: FlashcardDeck,
  onCompleteAction: (deckId: string, results: StudyResults) => void
) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<StudyResults | null>(null);
  
  const handleCompletion = (sessionResults: {
    totalCards: number;
    correctAnswers: number;
  }) => {
    // Log the incoming session results
    console.log("FLASHCARD-LOG: useStudyCompletion received session results:", {
      totalCards: sessionResults.totalCards,
      correctAnswers: sessionResults.correctAnswers
    });
    
    // SIMPLIFIED APPROACH: Count all cards in the session as completed
    // This ensures we're making progress on each study session
    
    // If we have 0 totalCards and 0 correctAnswers, it means we're in the "Back to Deck" flow
    // In this case, we should use the deck's total cards as both total and correct answers
    const correctAnswers = (sessionResults.totalCards === 0 && sessionResults.correctAnswers === 0)
      ? deck.cards.length
      : sessionResults.totalCards;
    
    const totalAnswers = (sessionResults.totalCards === 0 && sessionResults.correctAnswers === 0)
      ? deck.cards.length
      : sessionResults.totalCards;
    
    // Prepare the study results
    const studyResults = {
      cards: deck.cards,
      correctAnswers: correctAnswers, // Use calculated correct answers
      totalAnswers: totalAnswers, // Use calculated total answers
      studyDuration: 0 // This will be handled by the parent component
    };
    
    // Log the correct answers for debugging
    console.log("FLASHCARD-LOG: Study completion data prepared:", {
      correctAnswers: studyResults.correctAnswers,
      totalAnswers: studyResults.totalAnswers
    });
    
    // Save the completion data for the stats screen
    console.log("FLASHCARD-LOG: StudyInterface saved completion data:", studyResults);
    setCompletionData(studyResults);
    
    // Set completed flag to show completion screen
    setIsCompleted(true);
  };
  
  const completeAndExit = () => {
    if (completionData) {
      // Make sure we're passing the correct study results
      // Log the data being sent to onCompleteAction
      console.log("FLASHCARD-LOG: Completing session with data:", completionData);
      onCompleteAction(deck.id, completionData);
    } else {
      // Create default completion data that preserves progress
      // Use the deck's total cards as both total and correct answers
      // to ensure progress is maintained
      const defaultCompletionData: StudyResults = {
        cards: deck.cards,
        correctAnswers: deck.cards.length, // Use total cards to maintain progress
        totalAnswers: deck.cards.length,
        studyDuration: 0
      };
      
      console.log("FLASHCARD-LOG: No completion data, using progress-preserving default:", defaultCompletionData);
      onCompleteAction(deck.id, defaultCompletionData);
    }
  };
  
  return {
    isCompleted,
    completionData,
    handleCompletion,
    completeAndExit
  };
}