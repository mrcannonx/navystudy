export const DEFAULT_ANALYTICS = {
    streak: 0,
    bestStreak: 0,
    streakMilestone: {
        current: 'Getting Started',
        progress: 0,
        daysToNext: 3,
        nextMilestone: 'First Steps'
    },
    weeklyProgress: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        questionsAnswered: 0,
        correctAnswers: 0
    })),
    studyTimeDistribution: [
        { timeOfDay: 'Morning', minutes: 0 },
        { timeOfDay: 'Afternoon', minutes: 0 },
        { timeOfDay: 'Evening', minutes: 0 },
        { timeOfDay: 'Night', minutes: 0 }
    ],
    topicPerformance: [],
    questionsAnswered: 0,
    totalQuestions: 0,
    cardsStudied: 0,
    totalCards: 0,
    timeSpent: 0,
    flashcardTimeSpent: 0
} as const
