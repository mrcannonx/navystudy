import { useState, useEffect, useCallback } from "react";
import { FlashcardDeck, StudySettings } from "@/types/flashcard";
import { pickRandomCards } from "@/lib/study-sequencer";

interface UseStudySessionManagerProps {
  deck: FlashcardDeck;
  studySettings: StudySettings;
}

export function useStudySessionManager({ 
  deck, 
  studySettings 
}: UseStudySessionManagerProps) {
  const [initializedCards, setInitializedCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    total: 0
  });

  // Initialize session with properly prepared cards
  const initializeSession = useCallback(() => {
    if (!deck) return;
    
    try {
      console.log('Initializing study session with settings:', studySettings);
      
      // Prepare cards for study session
      let studyCards = [...deck.cards];
      
      // Reversed cards feature has been removed

      // Shuffle cards if enabled
      if (studySettings.shuffleCards) {
        studyCards = pickRandomCards(studyCards, studyCards.length);
      }

      // Limit to cards per session setting
      const cardsToStudy = studyCards.slice(0, studySettings.cardsPerSession || 10);
      
      // Set key stats for the session
      setSessionStats({
        correct: 0,
        incorrect: 0,
        skipped: 0,
        total: cardsToStudy.length
      });

      console.log(`Initialized session with ${cardsToStudy.length} cards`);
      setInitializedCards(cardsToStudy);
      setCurrentIndex(0);
      setIsSessionComplete(false);
    } catch (error) {
      console.error('Error initializing study session:', error);
      // Fallback to just using the first few cards
      const fallbackCards = deck.cards.slice(0, 5);
      setInitializedCards(fallbackCards);
      setSessionStats({
        correct: 0,
        incorrect: 0,
        skipped: 0,
        total: fallbackCards.length
      });
    }
  }, [deck, studySettings]);

  // Initialize when deck or settings change
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Go to next card
  const goToNextCard = useCallback(() => {
    setCurrentIndex(idx => {
      const nextIndex = idx + 1;
      if (nextIndex >= initializedCards.length) {
        setIsSessionComplete(true);
        return idx; // Stay at the last card
      }
      return nextIndex;
    });
  }, [initializedCards.length]);

  // Update session stats
  const updateStats = useCallback((result: 'correct' | 'incorrect' | 'skipped') => {
    setSessionStats(prev => {
      const newStats = { ...prev };
      newStats[result]++;
      return newStats;
    });
  }, []);

  // Reset session
  const resetSession = useCallback(() => {
    initializeSession();
  }, [initializeSession]);

  // Current card and progress info
  const currentCard = initializedCards[currentIndex];
  const progress = {
    current: currentIndex + 1,
    total: initializedCards.length,
    percentage: initializedCards.length 
      ? Math.round(((currentIndex + 1) / initializedCards.length) * 100)
      : 0
  };

  return {
    currentCard,
    progress,
    isSessionComplete,
    sessionStats,
    goToNextCard,
    updateStats,
    resetSession,
    allCards: initializedCards
  };
}
