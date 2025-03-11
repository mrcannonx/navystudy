"use client"

import { useContext, useMemo } from "react"
import { StatisticsContext } from "@/contexts/statistics-context"
import { ClientButton } from "@/components/ui/client-button"
import { RotateCcw, ArrowLeft } from "lucide-react"
import confetti from "canvas-confetti"

const motivationalQuotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

interface FlashcardCompletionProps {
  onCompleteAction: () => Promise<void>;
  onRetryAction: () => Promise<void>;
  onBackToDeckAction: () => Promise<void>;
  statistics: {
    cardsStudied: number;
    timeSpent: number;
  };
}

export function FlashcardCompletionClient({ 
  onCompleteAction,
  onRetryAction,
  onBackToDeckAction,
  statistics
}: FlashcardCompletionProps) {
  const statisticsContext = useContext(StatisticsContext)
  
  const randomEmoji = useMemo(() => {
    const emojis = ['🎉', '🌟', '🎯', '🏆', '💫', '⭐️', '🌈', '🚀'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }, []);

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
  
  const handleComplete = async () => {
    try {
      await onCompleteAction()
      // Refresh dashboard statistics if available
      if (statisticsContext?.refreshStatistics) {
        await statisticsContext.refreshStatistics()
      }
      await onBackToDeckAction()
    } catch (err) {
      console.error("Error completing flashcard session:", err)
    }
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="text-center space-y-3 max-w-md w-full bg-white dark:bg-gray-800 p-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="text-6xl animate-bounce">{randomEmoji}</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Flashcard Session Complete!
          </h1>
        </div>
        
        {/* Stats */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-2">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statistics.cardsStudied}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cards Studied</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {Math.floor(statistics.timeSpent / 60)}m {statistics.timeSpent % 60}s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
            Great job! Keep practicing to strengthen your memory.
          </p>
        </div>

        {/* Quote */}
        <div className="max-w-md mx-auto">
          <p className="text-lg italic text-gray-700 dark:text-gray-300">"{randomQuote.text}"</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">- {randomQuote.author}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-4">
          <ClientButton 
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2" 
            onClick={async () => {
              try {
                await onRetryAction()
              } catch (err) {
                console.error("Error retrying session:", err)
              }
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Study Again
          </ClientButton>
          
          <ClientButton 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleComplete}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Decks
          </ClientButton>
        </div>
      </div>
    </div>
  )
}
