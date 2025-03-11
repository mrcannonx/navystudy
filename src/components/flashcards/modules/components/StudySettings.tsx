import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { StudySettings as StudySettingsType } from "@/types/flashcard"
import { ClientButton } from "@/components/ui/client-button"

interface StudySettingsProps {
  settings: StudySettingsType
  onSettingsChange: (settings: StudySettingsType) => void
  onClose: () => void
}

export function StudySettings({
  settings,
  onSettingsChange,
  onClose,
}: StudySettingsProps) {
  const handleSettingChange = (path: string, value: any) => {
    const newSettings = { ...settings };
    
    // For simplified settings, just update the property directly
    (newSettings as any)[path] = value;
    
    onSettingsChange(newSettings);
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Study Settings</h1>
        <ClientButton onClick={onClose} variant="outline">
          Cancel
        </ClientButton>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardsPerSession">Cards per session</Label>
          <Input
            id="cardsPerSession"
            type="number"
            min={1}
            value={settings.cardsPerSession}
            onChange={(e) => {
              handleSettingChange("cardsPerSession", parseInt(e.target.value))
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="shuffleCards">Shuffle cards</Label>
          <Switch
            id="shuffleCards"
            checked={settings.shuffleCards}
            onCheckedChange={(checked) =>
              handleSettingChange("shuffleCards", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showExplanations">Show explanations</Label>
          <Switch
            id="showExplanations"
            checked={settings.showExplanations}
            onCheckedChange={(checked) =>
              handleSettingChange("showExplanations", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="soundEffects">Sound effects</Label>
          <Switch
            id="soundEffects"
            checked={settings.soundEffects}
            onCheckedChange={(checked) =>
              handleSettingChange("soundEffects", checked)
            }
          />
        </div>
      </div>

      <ClientButton className="w-full" onClick={onClose}>
        Close
      </ClientButton>
    </Card>
  )
}
