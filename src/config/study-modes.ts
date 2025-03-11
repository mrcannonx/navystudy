import { StudyMode, StudySettings, DEFAULT_STUDY_SETTINGS } from "@/types/flashcard";

export interface StudyModeConfig {
  defaultSettings: {
    cardsPerSession: number;
    shuffleCards: boolean;
    showExplanations: boolean;
    soundEffects: boolean;
  };
}

export const DEFAULT_SETTINGS: StudyModeConfig["defaultSettings"] = {
  cardsPerSession: 10,
  shuffleCards: true,
  showExplanations: true,
  soundEffects: true
};

// Mode titles
const MODE_TITLES: Record<StudyMode, string> = {
  standard: "Standard Mode",
  quickReview: "Quick Review Mode"
};

export function getDefaultSettings(): StudySettings {
  return DEFAULT_STUDY_SETTINGS;
}

export function getModeTitle(mode: StudyMode): string {
  return MODE_TITLES[mode] || "Standard Mode";
}