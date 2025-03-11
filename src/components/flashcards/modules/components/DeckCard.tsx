import { useState, useMemo, memo, useEffect } from "react"
import { Trash2, Brain, MoreVertical, Play, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ClientButton } from "@/components/ui/client-button"
import { FlashcardDeck } from "@/types/flashcard"

const motivationalQuotes = [
  "Never stop learning.",
  "Growth mindset.",
  "Knowledge is power.",
  "Stay curious.",
  "Embrace challenges.",
  "Learn deliberately.",
  "Persist always.",
  "Small steps matter.",
  "Progress daily.",
  "Just keep going."
]

interface DeckCardProps {
  deck: FlashcardDeck
  studyMode: 'standard' | 'quickReview'
  onStartStudying: (deck: FlashcardDeck) => void
  onDelete: (deckId: string) => void
  onResetStats?: (deckId: string) => void
  onToggleReversed?: (deckId: string, enabled: boolean) => void
}

// Use React.memo to prevent unnecessary rerenders
export const DeckCard = memo(function DeckCard({
  deck,
  studyMode,
  onStartStudying,
  onDelete,
  onResetStats,
}: DeckCardProps) {
  // Ensure cards is always an array using useMemo
  const safeCards = useMemo(() => Array.isArray(deck.cards) ? deck.cards : [], [deck.cards]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [quote, setQuote] = useState<string>("Believe in yourself.");
  
  // Select a random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete(deck.id);
  };
  
  const handleResetStats = () => {
    setShowResetDialog(false);
    if (onResetStats) onResetStats(deck.id);
  };

  // Calculate completion status
  const totalCards = safeCards.length;
  
  // Get the number of cards with high confidence (3 or higher)
  // But only count cards that have been studied in the current session
  // This is determined by the completedCount field which is updated by useStudySession.ts
  const completedCards = deck.completedCount || 0;
  
  // Ensure we have the latest studiable card count
  const isCompleted = totalCards > 0 && completedCards >= totalCards;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <Brain className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {deck.title || deck.name}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {deck.description}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onResetStats && (
                <DropdownMenuItem 
                  onClick={() => setShowResetDialog(true)}
                >
                  Reset Progress
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 dark:text-red-400"
              >
                Delete Deck
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">
            {completedCards} of {totalCards} Cards Completed
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${totalCards > 0 ? (completedCards / totalCards) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Quote className="h-4 w-4 mr-2" />
            <span className="text-sm italic">{quote}</span>
          </div>
          <ClientButton 
            className={`${isCompleted 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-blue-500 hover:bg-blue-600"} 
              text-white px-6 py-1.5 rounded-full font-medium text-sm flex items-center gap-1`}
            onClick={() => onStartStudying(structuredClone(deck))}
          >
            <Play className="h-3.5 w-3.5" />
            {isCompleted ? "Review" : "Start"}
          </ClientButton>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this deck?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "{deck.title || deck.name}" deck and all its cards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset deck progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all progress for "{deck.title || deck.name}" deck. Your cards will remain, but all study progress and statistics will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetStats}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Reset Progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
});