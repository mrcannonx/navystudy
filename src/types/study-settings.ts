import { StudySettings } from '@/types/flashcard';

// Simplified type for study setting paths
export type StudySettingPath = keyof StudySettings;

// Simplified setting dependency interface
export interface SettingDependency {
  setting: string;
  requires: StudySettingPath[];
  suggests: StudySettingPath[];
  conflicts: StudySettingPath[];
  description: string;
}

// Setting group interface (unchanged)
export interface SettingGroup {
  name: string;
  settings: string[];
  description: string;
}

// Simplified validation error interface
export interface ValidationError {
  message: string;
  settings: StudySettingPath[];
}

// Simplified setting validation interface
export interface SettingValidation {
  isValid: boolean;
  autoFixes: Array<{
    setting: StudySettingPath;
    newValue: boolean;
    reason: string;
  }>;
  warnings: Array<{
    message: string;
    severity: 'info' | 'warning' | 'error';
  }>;
  errors: ValidationError[];
}
