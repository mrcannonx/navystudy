import { StudySettings, StudyStatistics, FlashcardStatistics, DatabaseRecord } from "../../types"

export interface StatisticsUpdate {
  cardsStudied: number
  timeSpent: number
  studiedCardIds: string[]
}

export type {
  StudySettings,
  StudyStatistics,
  FlashcardStatistics,
  DatabaseRecord
} 