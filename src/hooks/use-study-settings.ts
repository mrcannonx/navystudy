"use client"

import { StudySettings, DEFAULT_STUDY_SETTINGS } from '@/types/flashcard'

// Simplified study settings hook that just returns the default settings
export function useStudySettings(): {
  settings: StudySettings;
  updateSettings: (newSettings: StudySettings) => Promise<void>;
  isLoading: boolean;
  error: string | null;
} {
  // Just return the default settings without any database interaction
  return {
    settings: DEFAULT_STUDY_SETTINGS,
    updateSettings: async () => {}, // No-op function
    isLoading: false,
    error: null
  }
}