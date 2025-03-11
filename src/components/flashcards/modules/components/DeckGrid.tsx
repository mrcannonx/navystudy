import { FlashcardDeck, StudyMode } from "@/types/flashcard"
import { DeckCard } from "./DeckCard"
import { BookOpen, Plus } from "lucide-react"
import { ClientLink } from "@/components/ui/client-link"

interface DeckGridProps {
    decks: FlashcardDeck[]
    onStartStudying: (deck: FlashcardDeck) => void
    onDelete: (deckId: string) => void
    onResetStats?: (deckId: string) => void
}

export function DeckGrid({
    decks,
    onStartStudying,
    onDelete,
    onResetStats,
}: DeckGridProps) {
    // Explicitly define the study mode to ensure TypeScript recognizes it
    const studyMode: StudyMode = 'standard';
    if (decks.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Flashcard Decks Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create your first deck to start studying
                </p>
                <ClientLink
                    href="/manage"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create New Deck
                </ClientLink>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
                <DeckCard
                    key={deck.id}
                    deck={deck}
                    studyMode={studyMode}
                    onStartStudying={onStartStudying}
                    onDelete={onDelete}
                    onResetStats={onResetStats}
                />
            ))}
        </div>
    )
}