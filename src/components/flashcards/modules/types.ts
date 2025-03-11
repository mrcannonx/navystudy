import type { StudySettings } from '@/types/flashcard';

export type { StudySettings };

export interface FlashcardDeck {
  id: string
  user_id: string
  name: string
  description: string
  cards: Flashcard[]
  created_at: string
  updated_at: string
  completedCount?: number
  currentCycle?: number
  shownCardsInCycle?: string[]
  last_studied_at?: string
  lastStudiedAt?: string
  title?: string
  progress?: {
    completedCount: number
    lastStudied: string
    timeSpent: number
    currentCycle: number
    shownCardsInCycle: string[]
    studiedCardIds: string[]
  }
  statistics?: {
    studiedCardIds?: string[]
    cardsStudied?: number
    timeSpent?: number
    streak?: number
    lastStudied?: string
  }
}

export interface Flashcard {
  id: string
  front: string
  back: string
  topics: string[]
  type: 'basic' | 'cloze'
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  metadata?: Record<string, any>
  confidence?: number
}

export interface FlashcardProps {
  front: string
  back: string
  type?: 'basic' | 'cloze'
  difficulty?: 'easy' | 'medium' | 'hard'
  hints?: string[]
  mnemonic?: string
  tags?: string[]
  topic?: string
  metadata?: {
    frontLength?: number
    backLength?: number
    complexityScore?: number
    hasMedia?: boolean
  }
  isFlipped: boolean
  onFlip: () => void
  onNext?: () => void
  onPrevious?: () => void
  onKnown?: () => void
  onUnknown?: () => void
  showConfidenceRating?: boolean
  onConfidenceRated?: (rating: number) => void
  initialConfidenceRating?: number
  isLastCard?: boolean
}

export interface StudyResults {
  totalCards: number
  correctAnswers: number
  timeSpent: number
  studiedCardIds: string[]
  confidenceRatings: Record<string, 'easy' | 'medium' | 'hard'>
}

export interface DeckListProps {
  decks: FlashcardDeck[]
  onStartStudying: (deck: FlashcardDeck) => void
  onDeleteDeck: (deckId: string) => Promise<void>
  onResetStats: (deckId: string) => Promise<void>
  onShowSettings: () => void
}

export interface StudySettingsProps {
  settings: StudySettings
  onSave: (settings: StudySettings) => void
  onClose: () => void
}

export interface DeckStatistics {
  cardsStudied: number;
  timeSpent: number;
  lastStudied: string;
  studiedCardIds: string[]; // Track which cards have been studied
}

export interface FlashcardStatistics {
  cardsStudied: number;
  timeSpent: number;
  lastStudied: string;
  studiedCardIds: string[];
  streak?: number;
}

export interface DatabaseRecord {
  user_id: string;
  deck_id: string | null;
  statistics: FlashcardStatistics;
  updated_at: string;
}

export interface StudyStatistics {
  cardsStudied: number
  timeSpent: number
  lastStudied: string
  studiedCardIds: string[]
  streak: number
  confidenceRatings: Record<string, 'easy' | 'medium' | 'hard'>
  type_distribution?: {
    basic: number
    cloze: number
  }
  difficulty_distribution?: {
    easy: number
    medium: number
    hard: number
  }
  topic_progress?: Array<{
    topic: string
    mastered: number
    total: number
  }>
  average_complexity?: number
}