import { StudySettings, DEFAULT_STUDY_SETTINGS } from '@/types/flashcard';

/**
 * Simplified function that just returns the input settings or default settings
 */
export function getActiveSettings(settings: StudySettings): StudySettings {
  // Just return the settings as is, or default settings if not provided
  return settings || DEFAULT_STUDY_SETTINGS;
}
