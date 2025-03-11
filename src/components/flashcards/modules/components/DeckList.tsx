import { Card } from "@/components/ui/card"
import { FlashcardDeck } from "@/types/flashcard"
import { DeckCard } from "./DeckCard"
import { ClientLink } from "@/components/ui/client-link"
import { ClientButton } from "@/components/ui/client-button"
import { BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { useStudySettings } from "@/hooks/use-study-settings"

interface DeckListProps {
  decks: FlashcardDeck[]
  onStartStudying: (deck: FlashcardDeck) => void
  onToggleReversed: (deckId: string, enabled: boolean) => void
  onDeleteDeck: (deckId: string) => void
}

export function DeckList({
  decks,
  onStartStudying,
  onToggleReversed,
  onDeleteDeck
}: DeckListProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-card/20 rounded-lg p-6 shadow-md border border-gray-100 dark:border-border/20 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h3 className="text-sm font-medium text-foreground/90">Flashcard Decks</h3>
        </div>
        <p className="text-2xl font-bold text-foreground/90">Loading...</p>
      </div>
    )
  }

  if (decks.length === 0) {
    return (
      <div className="bg-white dark:bg-card/20 rounded-lg p-6 shadow-md border border-gray-100 dark:border-border/20 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h3 className="text-sm font-medium text-foreground/90">Flashcard Decks</h3>
        </div>
        
        <p className="text-2xl font-bold text-foreground/90">
          No decks yet
        </p>
        
        <p className="text-sm text-muted-foreground/80 mt-1 mb-4">
          Create your first flashcard deck to get started
        </p>

        <ClientLink href="/manage">
          <ClientButton className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-500/90 dark:hover:bg-blue-500 w-full">
            Create Flashcards
          </ClientButton>
        </ClientLink>
      </div>
    )
  }

  const { settings } = useStudySettings();
  const studyMode = settings?.studyMode || 'quickReview';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            studyMode={studyMode}
            onStartStudying={() => onStartStudying(deck)}
            onToggleReversed={onToggleReversed}
            onDelete={() => onDeleteDeck(deck.id)}
          />
        ))}
      </div>
    </div>
  )
}
