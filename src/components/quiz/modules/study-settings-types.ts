export interface StudySettings {
  questionsPerSession: number;
  reviewIncorrectOnly: boolean;
  enabledTopics: string[];
  shuffleQuestions: boolean;
  showExplanations: boolean;
  soundEffects: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
}

export interface StudySettingsProps {
  settings?: StudySettings;
  onSave: (settings: StudySettings) => void;
  onClose: () => void;
}

export const DEFAULT_SETTINGS: StudySettings = {
  questionsPerSession: 10,
  reviewIncorrectOnly: false,
  enabledTopics: [],
  shuffleQuestions: false,
  showExplanations: true,
  soundEffects: false,
  theme: 'system',
  fontSize: 'medium'
}
