"use client"

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import type { FlashcardDeck, StudyResults, StudySettings } from '@/types/flashcard';
import { DEFAULT_STUDY_SETTINGS } from '@/types/flashcard';
import { useStudySessionInterface } from '@/components/flashcards/modules/hooks/useStudySessionInterface';
import { StudyCompletion } from './StudyCompletion';
import { StudyCard } from '../StudyCard';
import { StudyHeader } from './StudyHeader';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { useDeckProgress } from './hooks/useDeckProgress';
import { useStudyCompletion } from './hooks/useStudyCompletion';
import { StudyProgressBar } from './StudyProgressBar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useStatistics } from '@/contexts/statistics-context';

interface StudyInterfaceProps {
  deck: FlashcardDeck;
  onCompleteAction: (deckId: string, results: StudyResults) => void;
  onExitAction: () => void;
  onStudyAgainAction: () => void;
  studySettings?: StudySettings; // Optional since we'll use context if not provided
}

export function StudyInterface({
  deck,
  onCompleteAction,
  onExitAction,
  onStudyAgainAction,
  studySettings: propSettings
}: StudyInterfaceProps) {
  // Use provided settings or default settings
  const studySettings = propSettings || DEFAULT_STUDY_SETTINGS;
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();
  const { refreshStatistics } = useStatistics();
  
  // Use deck progress hook
  const { deck: updatedDeck, updateDeckProgress } = useDeckProgress(deck);
  
  // Use study completion hook
  const {
    isCompleted,
    completionData,
    handleCompletion,
    completeAndExit
  } = useStudyCompletion(updatedDeck, onCompleteAction);
  
  // Track processed completions to prevent duplicate processing
  const completionProcessedRef = useMemo<Record<string, boolean>>(() => ({}), []);

  // Get the current user
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get the current user ID on component mount
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    getUserId();
  }, []);
  
  // Use the study session interface hook
  const {
    currentCard,
    showAnswer,
    setShowAnswer,
    handleAnswer,
    progress,
    results
  } = useStudySessionInterface({
    deck: updatedDeck,
    studySettings,
    onCompleteAction: async (sessionResults) => {
      // Create a session identifier based on the results
      const sessionId = JSON.stringify(sessionResults);
      
      // If we've already processed this exact completion, skip to prevent loops
      if (completionProcessedRef[sessionId]) {
        return;
      }
      
      // Mark this completion as processed
      completionProcessedRef[sessionId] = true;
      
      // Update deck progress in local state
      const updatedDeckData = updateDeckProgress(sessionResults);
      
      // Save the updated deck progress to the database
      if (userId && updatedDeckData) {
        try {
          // Update the completed_count in the database
          const { error: updateError } = await supabase
            .from('flashcards')
            .update({
              completed_count: updatedDeckData.completedCount || 0,
              current_cycle: updatedDeckData.currentCycle || 1,
              shown_cards_in_cycle: updatedDeckData.shownCardsInCycle || [],
              progress: updatedDeckData.progress || {},
              last_studied_at: new Date().toISOString()
            })
            .eq('id', updatedDeck.id);
            
          if (updateError) {
            console.error('Error updating deck progress in database:', updateError);
            toast({
              title: 'Warning',
              description: 'Your progress was saved locally, but there was an issue updating your stats in the database.',
              variant: 'destructive',
            });
          } else {
            console.log('Successfully updated deck progress in database:', {
              deckId: updatedDeck.id,
              completedCount: updatedDeckData.completedCount
            });
            
            // Refresh the statistics to update the UI
            refreshStatistics();
          }
        } catch (error) {
          console.error('Error in deck progress update process:', error);
        }
      }
      
      // Handle completion
      handleCompletion(sessionResults);
    }
  });

  // Handle navigation
  const handlePrevious = () => {
    setShowAnswer(false);
    setIsFlipped(false);
    handleAnswer(-1);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setIsFlipped(false);
    handleAnswer(0);
  };

  // Error handling
  if (error) {
    return <ErrorState message={error || 'An error occurred'} />;
  }

  // Show completion screen when study session is completed
  if (isCompleted) {
    const completionStats = {
      completed: results.correctAnswers, // Use the actual number of correct answers
      totalInDeck: updatedDeck.cards.length,
      selectedTotal: studySettings.cardsPerSession ?? 10,
      wasAdjusted: false
    };
    
    return (
      <StudyCompletion
        onStudyAgainAction={() => {
          completeAndExit();
          onStudyAgainAction();
        }}
        onBackToDeckAction={() => {
          completeAndExit();
          onExitAction();
        }}
        deckTitle={updatedDeck.title || updatedDeck.name}
        completionStats={completionStats}
      />
    );
  }

  // Render the study interface
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="p-8 bg-white dark:bg-gray-800 shadow-lg w-full max-w-5xl">
        <StudyHeader
          deckName={updatedDeck.name}
          onExit={onExitAction}
        />

        <StudyProgressBar
          current={progress.current}
          total={progress.total}
          cardsPerSession={studySettings.cardsPerSession ?? 10}
          deckTotalCards={updatedDeck.cards.length}
          completedCount={updatedDeck.completedCount || 0}
        />

        {currentCard && (
          <div className="flex flex-col items-center justify-center">
            <StudyCard
              card={currentCard}
              isFlipped={isFlipped}
              onFlipAction={() => {
                if (!showAnswer) {
                  setIsFlipped(true);
                  setShowAnswer(true);
                }
              }}
              onAnswerAction={(confidence: number) => {
                setIsFlipped(false);
                setShowAnswer(false);
                handleAnswer(confidence);
              }}
              onNavigate={direction => {
                if (direction === 'previous') {
                  handlePrevious();
                } else {
                  handleNext();
                }
              }}
              canNavigatePrevious={progress.current > 1}
              deckTitle={updatedDeck.title || updatedDeck.name}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
