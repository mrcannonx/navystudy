import { addDays } from 'date-fns';

export interface SRSData {
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
  lastReviewDate: Date;
}

const DEFAULT_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;
const EASE_BONUS = 0.15;
const EASE_PENALTY = 0.2;

export function initializeSRSData(): SRSData {
  return {
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    dueDate: new Date(),
    lastReviewDate: new Date(),
  };
}

export function calculateNextReview(
  currentData: SRSData,
  confidenceRating: number,
  minInterval: number,
  maxInterval: number
): SRSData {
  const now = new Date();
  let { easeFactor, interval, repetitions } = currentData;

  // Convert confidence rating (1-5) to quality (0-5)
  const quality = Math.max(0, confidenceRating - 1);

  // Update ease factor based on performance
  if (quality < 3) {
    easeFactor = Math.max(MINIMUM_EASE_FACTOR, easeFactor - EASE_PENALTY);
    interval = 1; // Reset interval on poor performance
    repetitions = 0;
  } else {
    easeFactor = easeFactor + (EASE_BONUS * (quality - 3));
    repetitions += 1;

    // Calculate new interval
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Enforce interval bounds
  interval = Math.max(minInterval, Math.min(maxInterval, interval));

  const dueDate = addDays(now, interval);

  return {
    easeFactor,
    interval,
    repetitions,
    dueDate,
    lastReviewDate: now,
  };
}

export function isDue(srsData: SRSData): boolean {
  return new Date() >= srsData.dueDate;
}

export function calculateRetentionScore(srsData: SRSData): number {
  const daysSinceLastReview = Math.max(1, Math.floor(
    (new Date().getTime() - srsData.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)
  ));
  
  // Estimate retention based on time since last review and ease factor
  const estimatedRetention = Math.exp(-daysSinceLastReview / (srsData.interval * srsData.easeFactor));
  return Math.round(estimatedRetention * 100);
}

export function getPriorityScore(srsData: SRSData, cardDifficulty: number): number {
  const retention = calculateRetentionScore(srsData);
  const daysOverdue = Math.max(0, 
    (new Date().getTime() - srsData.dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Combine retention, overdue status, and card difficulty
  return (100 - retention) + (daysOverdue * 10) + (cardDifficulty * 5);
} 