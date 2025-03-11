export const STUDY_MODE_THEMES = {
  quickReview: {
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'from-blue-400 to-blue-500',
    glow: 'shadow-blue-500/50'
  },
  comprehensive: {
    gradient: 'from-emerald-500 to-emerald-600',
    hoverGradient: 'from-emerald-400 to-emerald-500',
    glow: 'shadow-emerald-500/50'
  },
  mastery: {
    gradient: 'from-purple-500 to-purple-600',
    hoverGradient: 'from-purple-400 to-purple-500',
    glow: 'shadow-purple-500/50'
  },
  adaptive: {
    gradient: 'from-orange-500 to-orange-600',
    hoverGradient: 'from-orange-400 to-orange-500',
    glow: 'shadow-orange-500/50'
  },
  spaced: {
    gradient: 'from-cyan-500 to-cyan-600',
    hoverGradient: 'from-cyan-400 to-cyan-500',
    glow: 'shadow-cyan-500/50'
  },
  standard: {
    gradient: 'from-gray-500 to-gray-600',
    hoverGradient: 'from-gray-400 to-gray-500',
    glow: 'shadow-gray-500/50'
  }
} as const;

export type StudyModeTheme = keyof typeof STUDY_MODE_THEMES;
