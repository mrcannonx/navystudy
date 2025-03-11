import { useMemo } from "react";
import { useSettingsManager } from "@/hooks/use-settings-manager";
import { SettingsGroup } from "./SettingsGroup";
import { SETTING_GROUPS } from "@/config/study-settings";
import { StudySettings as StudySettingsType } from "@/types/flashcard";
import { StudySettingPath } from "@/types/study-settings";

// Helper function to safely get nested value with type checking
function getSettingValue(settings: StudySettingsType, path: string): any {
  return settings[path as keyof StudySettingsType];
}

const SETTING_LABELS: Record<string, string> = {
  cardsPerSession: "Cards per Session",
  shuffleCards: "Shuffle Cards",
  showExplanations: "Show Explanations",
  soundEffects: "Sound Effects"
};

const SETTING_DESCRIPTIONS: Record<string, string> = {
  cardsPerSession: "Number of cards to study in each session",
  shuffleCards: "Randomize card order each session",
  showExplanations: "Display detailed explanations after answering",
  soundEffects: "Play audio feedback for correct/incorrect answers"
};

const SETTING_TYPES: Record<string, 'boolean' | 'number'> = {
  cardsPerSession: 'number',
  shuffleCards: 'boolean',
  showExplanations: 'boolean',
  soundEffects: 'boolean'
};

export function StudySettings() {
  const { settings } = useSettingsManager();

  const groupedSettings = useMemo(() => {
    return SETTING_GROUPS.map(group => ({
      name: group.name,
      description: group.description,
      settings: group.settings.map(settingName => {
        // Get the setting type
        const type = SETTING_TYPES[settingName] || 'boolean';

        return {
          name: settingName as StudySettingPath,
          label: SETTING_LABELS[settingName] || settingName,
          description: SETTING_DESCRIPTIONS[settingName] || "",
          value: getSettingValue(settings, settingName),
          type,
          disabled: false
        };
      })
    }));
  }, [settings]);

  return (
    <div className="space-y-6 p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Study Settings</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Customize your flashcard study experience
        </p>
      </div>

      {groupedSettings.map((group) => (
        <SettingsGroup
          key={group.name}
          name={group.name}
          description={group.description}
          settings={group.settings}
        />
      ))}
    </div>
  );
}
