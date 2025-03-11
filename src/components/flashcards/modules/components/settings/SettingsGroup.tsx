import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SettingToggle } from "./SettingToggle";
import { NumberSetting } from "./NumberSetting";
import { useSettingsManager } from "@/hooks/use-settings-manager";
import { StudySettingPath } from "@/types/study-settings";

interface SettingsGroupProps {
  name: string;
  description: string;
  settings: Array<{
    name: StudySettingPath;
    label: string;
    description: string;
    value: any;
    type: 'boolean' | 'number' | 'object';
    dependency?: any;
    disabled?: boolean;
  }>;
}

export function SettingsGroup({ name, description, settings }: SettingsGroupProps) {
  const { updateSetting } = useSettingsManager();

  const renderSetting = (setting: SettingsGroupProps['settings'][0]) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <SettingToggle
            key={setting.name}
            name={setting.name}
            label={setting.label}
            description={setting.description}
            value={setting.value as boolean}
            onChange={(value) => updateSetting(setting.name, value)}
            dependency={setting.dependency}
            disabled={setting.disabled}
          />
        );
      case 'number':
        return (
          <NumberSetting
            key={setting.name}
            name={setting.name}
            label={setting.label}
            description={setting.description}
            value={setting.value as number}
            onChange={(value) => updateSetting(setting.name, value)}
            dependency={setting.dependency}
            disabled={setting.disabled}
            min={1}
            max={100}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.map(renderSetting)}
      </CardContent>
    </Card>
  );
}
