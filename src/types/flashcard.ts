import type { SRSData } from '@/lib/srs';

export type CardType = 'basic' | 'cloze';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Simplified study settings (replacing the complex version from study-settings.ts)
export type StudyMode = 'standard' | 'quickReview';

export interface GeneralSettings {
  cardsPerSession: number;
  shuffleCards: boolean;
  showExplanations: boolean;
  soundEffects: boolean;
}

export interface StudySettings {
  cardsPerSession: number;
  shuffleCards: boolean;
  showExplanations: boolean;
  soundEffects: boolean;
  studyMode: StudyMode;
  generalSettings: GeneralSettings;
}

// Types moved from study-settings.ts
export type StudySettingPath = keyof StudySettings;

export interface SettingDependency {
  setting: string;
  requires: StudySettingPath[];
  suggests: StudySettingPath[];
  conflicts: StudySettingPath[];
  description: string;
}

export interface SettingGroup {
  name: string;
  settings: string[];
  description: string;
}

export interface ValidationError {
  message: string;
  settings: StudySettingPath[];
}

export interface SettingValidation {
  isValid: boolean;
  autoFixes: Array<{
    setting: StudySettingPath;
    newValue: boolean;
    reason: string;
  }>;
  warnings: Array<{
    message: string;
    severity: 'info' | 'warning' | 'error';
  }>;
  errors: ValidationError[];
}

// Default study settings
export const DEFAULT_STUDY_SETTINGS: StudySettings = {
  cardsPerSession: 10,
  shuffleCards: true,
  showExplanations: false,
  soundEffects: false,
  studyMode: 'standard',
  generalSettings: {
    cardsPerSession: 10,
    shuffleCards: true,
    showExplanations: false,
    soundEffects: false
  }
};

export interface ClozeContent {
  text: string;
  hints?: string[];
  answer: string;
  position: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  confidence: number;
  lastStudied?: string;
  type?: CardType;
  difficulty?: DifficultyLevel;
  topics?: string[];
  metadata?: {
    complexityScore?: number;
    [key: string]: any;
  };
}

export interface FlashcardDeck {
  id: string;
  userId: string;
  name: string;
  title?: string;
  description?: string;
  cards: Flashcard[];
  createdAt: number;
  updatedAt: number;
  pendingOperations: any[];
  mastered_cards?: number;
  total_cards: number;
  last_studied_at?: string;
  lastStudiedAt?: string; // Added for consistency with the JS property name
  completedCount?: number;
  currentCycle?: number;
  shownCardsInCycle?: string[];
  progress?: {
    completedCount: number;
    lastStudied: string;
    currentCycle: number;
    shownCardsInCycle: string[];
    studiedCardIds: string[];
    timeSpent?: number;
    streak?: number;
  };
  // Keep for backward compatibility
  statistics?: {
    studiedCardIds?: string[];
    cardsStudied?: number;
    timeSpent?: number;
    streak?: number;
    lastStudied?: string;
  };
}

export interface StudyResults {
  cards: Flashcard[];
  correctAnswers: number;
  totalAnswers: number;
  studyDuration: number;
}

// Type for database response
export interface FlashcardDeckDB {
  id: string;
  user_id: string;
  name: string;
  title: string;
  description: string;
  cards: Flashcard[];
  created_at: string;
  updated_at: string;
  mastered_cards?: number;
  total_cards: number;
  last_studied_at?: string;
  completed_count?: number;
  current_cycle?: number;
  shown_cards_in_cycle?: string[];
  progress?: {
    completedCount: number;
    lastStudied: string;
    currentCycle: number;
    shownCardsInCycle: string[];
    studiedCardIds: string[];
    timeSpent?: number;
    streak?: number;
  };
}