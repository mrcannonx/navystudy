import { Json } from './common'

export type Settings = {
  quiz: {
    questionsPerSession: number
    shuffleQuestions: boolean
  }
  flashcard: {
    studyMode: 'quickReview' | 'comprehensive' | 'mastery' | 'adaptive'
    modes: {
      quickReview: {
        cardsPerSession: number
        shuffleCards: boolean
        basicCardsOnly: boolean
      }
      comprehensive: {
        cardsPerSession: number
        allCardTypes: boolean
        twoSidedPractice: boolean
        progressTracking: boolean
      }
      mastery: {
        cardsPerSession: number
        spacedRepetition: boolean
        difficultyTracking: boolean
        comprehensiveStats: boolean
      }
      adaptive: {
        cardsPerSession: number
        dynamicDifficulty: boolean
        smartCardSelection: boolean
        performanceAnalysis: boolean
      }
    }
    shuffleCards: boolean
    twoSidedPractice: boolean
    useConfidenceRating: boolean
    useSpacedRepetition: boolean
    reviewIncorrectOnly: boolean
    minInterval: number
    maxInterval: number
    trackStatistics: boolean
    enabledCardTypes: {
      basic: boolean
      cloze: boolean
      reversed: boolean
    }
    cardTypeDistribution: {
      basic: number
      cloze: number
      reversed: number
    }
    enabledDifficulties: {
      easy: boolean
      medium: boolean
      hard: boolean
    }
    difficultyProgression: boolean
    adaptiveComplexity: boolean
    complexityRange: {
      min: number
      max: number
    }
    prioritizeTopics: boolean
    selectedTopics: string[]
  }
  general: {
    theme: string
    notifications: boolean
    timezone?: string
  }
}

export type UserPreferences = {
  settings?: Settings
  study_settings?: any
  studyPreferences?: any
}
