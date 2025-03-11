import { StudyStatistics } from "../../types"

export const DEFAULT_STATISTICS: StudyStatistics = {
  cardsStudied: 0,
  timeSpent: 0,
  lastStudied: new Date().toISOString(),
  studiedCardIds: [],
  streak: 0,
  confidenceRatings: {},
  type_distribution: {
    basic: 0,
    cloze: 0
  },
  difficulty_distribution: {
    easy: 0,
    medium: 0,
    hard: 0
  },
  topic_progress: [],
  average_complexity: 0
}; 