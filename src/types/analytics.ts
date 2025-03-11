export interface TimeSlot {
  timeOfDay: string;
  minutes: number;
}

export interface TopicPerformance {
  topic: string;
  score: number;
  totalQuestions: number;
}

export interface TopicMastery {
  topic: string;
  mastered: number;
  total: number;
}

export interface WeeklyProgress {
  date: string;
  questionsAnswered: number;
  correctAnswers: number;
}

export interface StudyAnalyticsData {
  weeklyProgress: WeeklyProgress[];
  topicPerformance: TopicPerformance[];
  studyTimeDistribution: TimeSlot[];
  totalQuizzesCompleted: number;
  totalDecksMastered: number;
  streak: number;
  bestStreak: number;
  streakMilestone: {
    current: string;
    progress: number;
    daysToNext: number;
    nextMilestone: string;
  };
  timeSpent: number;
  flashcardTimeSpent: number;
  questionsAnswered: number;
  totalQuestions: number;
  cardsStudied: number;
  totalCards: number;
  flashcardStreak: number;
  lastFlashcardStudy: string;
  lastStudied: string;
  cardTypeDistribution: {
    basic: number;
    cloze: number;
    reversed: number;
  };
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  topicMastery: TopicMastery[];
  averageComplexity: number;
  correctAnswers?: number;
  retentionRate?: number;
  reviewEfficiency?: number;
  milestoneSummary?: {
    weekly: {
      achievedMilestones: string[];
      streakProgress: number;
      startStreak: number;
      endStreak: number;
    };
    monthly: {
      achievedMilestones: string[];
      streakProgress: number;
      startStreak: number;
      endStreak: number;
      bestStreak: number;
    };
  };
}

export interface AnalyticsStats {
  totalTimeSpent: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  sessionCount: number;
  retentionRate?: number;
  reviewEfficiency?: number;
  totalStudyTime?: number;
}
