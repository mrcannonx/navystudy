"use client"

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyCompletionProps {
  onStudyAgainAction: () => void;
  onBackToDeckAction: () => void;
  deckTitle: string;
  completionStats: {
    completed: number;
    totalInDeck: number;
    selectedTotal?: number;
    wasAdjusted?: boolean;
  };
}

const motivationalQuotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

export function StudyCompletion({
    onStudyAgainAction,
    onBackToDeckAction,
    deckTitle,
    completionStats
}: StudyCompletionProps) {
  // Track whether user has interacted with the completion screen
  const [hasInteracted, setHasInteracted] = useState(false);
  const randomEmoji = useMemo(() => {
    // Log detailed information about the completion stats
    console.log("FLASHCARD-LOG: StudyCompletion component rendered", {
      completionStats,
      completed: completionStats.completed,
      totalInDeck: completionStats.totalInDeck
    });
    
    const emojis = ['🎉', '🌟', '🎯', '🏆', '💫', '⭐️', '🌈', '🚀'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }, [completionStats]);

  const randomQuote = useMemo(() => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  }, []);

  // Trigger confetti effect on mount
  useMemo(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-3 max-w-md w-full bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <div className="text-6xl animate-bounce">{randomEmoji}</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Study Session Complete!
          </h1>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {deckTitle}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-2 border border-gray-200 dark:border-gray-600">
          {completionStats.wasAdjusted && (
            <div className="mb-3 text-sm text-amber-600 dark:text-amber-400">
              Note: Session was adjusted from {completionStats.selectedTotal} to {completionStats.totalInDeck} cards
              based on the number of remaining cards in the deck.
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {completionStats.completed} of {completionStats.totalInDeck}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500"
                style={{
                  width: `${completionStats.totalInDeck > 0
                    ? (completionStats.completed / completionStats.totalInDeck) * 100
                    : 0}%`
                }}
              />
            </div>
          </div>
          <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
            {completionStats.completed >= (completionStats.totalInDeck * 0.8)
              ? "Excellent work! You've mastered these cards."
              : completionStats.completed >= (completionStats.totalInDeck * 0.6)
              ? "Good job! Keep practicing to improve further."
              : "Keep practicing! You'll get better with time."}
          </p>
        </div>

        {/* Quote */}
        <div className="max-w-md mx-auto">
          <p className="text-lg italic text-gray-700 dark:text-gray-300">"{randomQuote.text}"</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">- {randomQuote.author}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-4">
          <Button
            onClick={() => {
              // Only allow one interaction to prevent multiple restarts
              console.log("FLASHCARD-LOG: StudyCompletion Study Again button clicked");
              if (!hasInteracted) {
                setHasInteracted(true);
                onStudyAgainAction();
              }
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Study Again
          </Button>
          <Button
            onClick={() => {
              // Only allow one interaction to prevent multiple restarts
              console.log("FLASHCARD-LOG: StudyCompletion Back to Deck button clicked");
              if (!hasInteracted) {
                setHasInteracted(true);
                onBackToDeckAction();
              }
            }}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Deck
          </Button>
        </div>
      </div>
    </div>
  );
}