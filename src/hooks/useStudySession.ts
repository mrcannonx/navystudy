import { useState, useEffect, useCallback } from 'react';
import { FlashcardDeck, Flashcard, StudySettings } from '@/types/flashcard';
import { StudySequencer } from '@/lib/study-sequencer';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/components/ui/use-toast';

interface StudySessionState {
  totalCards: number;        // Total cards in the current session
  totalDeckCards: number;    // Total cards in the entire deck
  correctAnswers: number;
  completedCards: number;    // Cards completed in the current session
  totalCompletedCards: number; // Total cards completed across all sessions
  timeSpent: number;
}

export function useStudySession(
  deck: FlashcardDeck,
  options: StudySettings,
  onComplete: (results: {
    totalCards: number;
    completedCards: number;
    timeSpent: number;
  }) => void
) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSessionValid, setIsSessionValid] = useState(true);
  
  // Initialize sequencer
  const [sequencer] = useState(() => new StudySequencer(deck, options));
  
  // Initialize study results with the total deck size and completed count
  const [studyResults, setStudyResults] = useState<StudySessionState>({
    totalCards: 0,
    totalDeckCards: deck.cards.length,
    correctAnswers: 0,
    completedCards: 0,
    totalCompletedCards: deck.completedCount || 0,
    timeSpent: 0
  });

  // Load initial cards
  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const cards = sequencer.getNextCards();
        setCurrentCards(cards);
        
        // Update session cards count without resetting the total completed cards
        setStudyResults(prev => ({
          ...prev,
          totalCards: cards.length,
          correctAnswers: 0 // Reset correct answers for this session
        }));
      } catch (err) {
        console.error('Failed to load cards:', err);
        setError('Failed to load study cards. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load study cards. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [deck, options.cardsPerSession]);

  // Check if session is complete
  const isSessionComplete = studyResults.completedCards >= studyResults.totalCards;

  const handleAnswer = useCallback(async (confidence: number) => {
    if (isSessionComplete) return; // Prevent further answers if session is complete
    
    const currentCard = currentCards[currentIndex];

    try {
      // Handle navigation when confidence rating is disabled
      if (confidence === -1) { // Previous button
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
          setShowAnswer(false);
        }
        return;
      }

      // Calculate new completed cards count for this session
      const newCompletedCards = studyResults.completedCards + 1;
      // Calculate new total completed cards across all sessions
      const newTotalCompletedCards = studyResults.totalCompletedCards + 1;

      // Check if this would complete the current session
      if (newCompletedCards >= studyResults.totalCards) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        setStudyResults(prev => ({
          ...prev,
          completedCards: newCompletedCards,
          totalCompletedCards: newTotalCompletedCards
        }));
        
        onComplete({
          totalCards: studyResults.totalDeckCards, // Use total deck cards for completion
          completedCards: newTotalCompletedCards,  // Use total completed cards
          timeSpent
        });
        return;
      }

      // Update study results
      setStudyResults(prev => ({
        ...prev,
        completedCards: newCompletedCards,
        totalCompletedCards: newTotalCompletedCards
      }));

      // Move to next card
      if (currentIndex < currentCards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
      }
    } catch (err) {
      console.error('Failed to handle answer:', err);
      setError('Failed to save your answer. Please try again.');
      toast({
        title: "Error",
        description: "Failed to save your answer. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentCards, currentIndex, options.cardsPerSession, startTime, studyResults.completedCards, studyResults.totalCompletedCards, studyResults.totalCards, isSessionComplete]);

  // Calculate current progress, ensuring we don't exceed total
  const currentProgress = Math.min(currentIndex + 1, studyResults.totalCards);

  return {
    currentCard: isSessionComplete ? null : currentCards[currentIndex],
    showAnswer,
    setShowAnswer,
    handleAnswer,
    progress: {
      current: currentProgress,                // Current card in this session
      total: studyResults.totalCards,          // Total cards in this session
      completed: studyResults.totalCompletedCards, // Total completed cards across all sessions
      remaining: Math.max(0, studyResults.totalDeckCards - studyResults.totalCompletedCards) // Remaining based on total deck
    },
    results: studyResults,
    isLoading,
    error,
    isComplete: isSessionComplete
  };
}
