import { Database } from "@/types/database"

export type FlashcardRow = Database["public"]["Tables"]["flashcards"]["Row"]

export interface FlashcardData extends Omit<FlashcardRow, "cards"> {
    cards: Array<{
        id: string
        front: string
        back: string
        type: 'basic' | 'cloze'
        topic?: string
    }>
}

import { StudySettings } from '@/components/flashcards/types/study-settings';

export interface FlashcardState {
    decks: FlashcardData[]
    loading: boolean
    currentDeck: FlashcardData | null
    currentCardIndex: number | null
    isCompleted: boolean
    showSettings: boolean
    studySettings: StudySettings
    shouldScrollToTop: boolean
    deckConfidenceRatings: Record<string, number>
}
