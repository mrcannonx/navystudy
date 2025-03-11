import { StudySettings, SettingDependency, SettingGroup } from '@/types/flashcard';

// Simplified settings with no dependencies
export const SETTING_DEPENDENCIES: SettingDependency[] = [];

// Simplified setting groups
export const SETTING_GROUPS: SettingGroup[] = [
  {
    name: 'Study Session',
    settings: ['cardsPerSession', 'shuffleCards'],
    description: 'Configure your flashcard study session'
  }
];

// Helper function to check if a setting has dependencies
export function getSettingDependencies(settingName: string): SettingDependency | undefined {
  return undefined;
}

// Helper function to get the group a setting belongs to
export function getSettingGroup(settingName: string): SettingGroup | undefined {
  return SETTING_GROUPS.find(group => group.settings.includes(settingName));
}
