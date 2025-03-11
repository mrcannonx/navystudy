import { FlashcardDeck, StudyMode } from "@/types/flashcard"
import { EnhancedDeckCard } from "./EnhancedDeckCard"
import { BookOpen, Plus, FileText } from "lucide-react"
import { ClientLink } from "@/components/ui/client-link"
import { Button } from "@/components/ui/button"

interface EnhancedDeckGridProps {
  decks: FlashcardDeck[]
  onStartStudying: (deck: FlashcardDeck) => void
  onDelete: (deckId: string) => void
  onResetStats?: (deckId: string) => void
}

export function EnhancedDeckGrid({
  decks,
  onStartStudying,
  onDelete,
  onResetStats,
}: EnhancedDeckGridProps) {
  // Explicitly define the study mode to ensure TypeScript recognizes it
  const studyMode: StudyMode = 'standard';
  
  if (decks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Flashcard Decks Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Create your first flashcard deck to start studying. Flashcards are a powerful way to memorize information through active recall.
        </p>
        <ClientLink
          href="/manage"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Your First Deck
        </ClientLink>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck, index) => (
        <EnhancedDeckCard
          key={deck.id}
          deck={deck}
          studyMode={studyMode}
          onStartStudying={onStartStudying}
          onDelete={onDelete}
          onResetStats={onResetStats}
          colorIndex={index}
        />
      ))}
    </div>
  )
}