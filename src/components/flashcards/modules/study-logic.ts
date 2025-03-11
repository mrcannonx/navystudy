import { StudySettings, Flashcard } from "./types"

export function calculateNextReview(
  rating: number,
  history: { timesCorrect: number; timesIncorrect: number },
  settings: StudySettings
) {
  const MIN_INTERVAL = 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
  const MAX_INTERVAL = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
  const DEFAULT_EASE = 2.5

  const quality = rating - 1
  const totalAttempts = history.timesCorrect + history.timesIncorrect
  const successRate = history.timesCorrect / (totalAttempts || 1)
  let easeFactor = DEFAULT_EASE + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  easeFactor *= (0.8 + successRate * 0.4)
  easeFactor = Math.max(1.3, Math.min(2.5, easeFactor))

  let interval
  if (totalAttempts === 1) {
    interval = MIN_INTERVAL
  } else if (totalAttempts === 2) {
    interval = MIN_INTERVAL * 6
  } else {
    const lastInterval = MIN_INTERVAL * Math.pow(easeFactor, totalAttempts - 2)
    interval = lastInterval * easeFactor
  }

  if (quality < 3) {
    interval = MIN_INTERVAL
  }

  interval = Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, interval))
  return new Date(Date.now() + interval)
}

export function sortCardsByConfidenceRating(
  cards: Flashcard[],
  confidenceRatings: Record<string, number>
): Flashcard[] {
  return [...cards].sort((a, b) => {
    const ratingA = confidenceRatings[a.id] || 0
    const ratingB = confidenceRatings[b.id] || 0
    return ratingA - ratingB
  })
}

export function calculateStreak(
  lastStudied: string,
  currentStreak: number
): number {
  const today = new Date().toISOString().split('T')[0]
  const lastStudyDate = new Date(lastStudied).toISOString().split('T')[0]

  if (today === lastStudyDate) {
    return currentStreak
  } else if (
    new Date(today).getTime() - new Date(lastStudyDate).getTime() <= 86400000
  ) {
    return currentStreak + 1
  }
  return 1
}

export function shuffleCards(cards: Flashcard[]): Flashcard[] {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}