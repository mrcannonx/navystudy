import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudySettings } from '@/types/flashcard';

interface StudyCompletionProps {
  totalCards: number;
  correctAnswers: number;
  onStudyAgain: () => void;
  onBackToDeck: () => void;
  studySettings: StudySettings;
  deckTitle: string;
}

const motivationalQuotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" }
];

const celebratoryEmojis = ["🎉", "🌟", "🏆", "💫", "🎊", "⭐", "🌈", "✨", "🚀", "💪"];

export function StudyCompletion({ totalCards, correctAnswers, onStudyAgain, onBackToDeck, studySettings, deckTitle }: StudyCompletionProps) {
  const completionText = `${totalCards} cards reviewed`;
  
  const randomEmoji = useMemo(() => {
    const emojis = ['🎉', '🌟', '🎯', '🏆', '💫', '⭐️', '🌈', '🚀'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }, []);

  const randomQuote = useMemo(() => {
    const quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
      },
      {
        text: "Learning is not attained by chance, it must be sought for with ardor and diligence.",
        author: "Abigail Adams"
      },
      {
        text: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King"
      }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="p-8 bg-white dark:bg-gray-800 shadow-lg max-w-2xl w-full">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="text-6xl animate-bounce">{randomEmoji}</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Study Session Complete!
            </h1>
          </div>

          {/* Stats */}
          <div className="py-8">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {completionText}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {deckTitle}
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="max-w-md mx-auto">
            <p className="text-lg italic text-gray-700 dark:text-gray-300">"{randomQuote.text}"</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">- {randomQuote.author}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-6">
            <Button
              onClick={onStudyAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Study Again
            </Button>
            <Button
              onClick={onBackToDeck}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Deck
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}