import { Dispatch, SetStateAction } from "react"
import { FlashcardDeck, StudySettings } from "@/types/flashcard"

/**
 * Interface for the state used in flashcard actions
 */
export interface FlashcardState {
    // Deck state
    decks: FlashcardDeck[]
    setDecks: Dispatch<SetStateAction<FlashcardDeck[]>>
    setLoading: Dispatch<SetStateAction<boolean>>
    
    // Current study session state
    currentDeck: FlashcardDeck | null
    setCurrentDeck: Dispatch<SetStateAction<FlashcardDeck | null>>
    currentCardIndex: number
    setCurrentCardIndex: Dispatch<SetStateAction<number>>
    setIsCompleted: Dispatch<SetStateAction<boolean>>
    
    // Settings state
    studySettings: StudySettings
    setStudySettings: Dispatch<SetStateAction<StudySettings>>
    setShowSettings: Dispatch<SetStateAction<boolean>>
    
    // Session tracking
    studyStartTime: Date | null
    setStudyStartTime: Dispatch<SetStateAction<Date | null>>
    
    // UI state
    setShouldScrollToTop: Dispatch<SetStateAction<boolean>>
}

/**
 * Interface for the progress data stored in the database
 */
export interface FlashcardProgress {
    completedCount: number;
    lastStudied: string;
    currentCycle: number;
    shownCardsInCycle: string[];
    studiedCardIds: string[];
    timeSpent?: number;
    streak?: number;
}

/**
 * Interface for the handlers returned by useFlashcardActions
 */
export interface FlashcardActionHandlers {
    fetchDecks: () => Promise<void>;
    fetchStudySettings: () => Promise<void>;
    startStudying: (deck: FlashcardDeck) => Promise<void>;
    nextCard: () => Promise<void>;
    previousCard: () => Promise<void>;
    handleSaveSettings: (settings: StudySettings) => Promise<void>;
    handleCompleteStudy: () => Promise<void>;
    handleDeleteDeck: (deckId: string) => Promise<void>;
    handleResetDeckStats: (deckId: string) => Promise<void>;
}