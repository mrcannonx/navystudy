import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { StudySettings } from '../study-settings-types'
import { Card, CardContent } from '@/components/ui/card'

interface SettingsProps {
  settings: StudySettings;
  onSettingChange: (newSettings: Partial<StudySettings>) => void;
}

export function Settings({ settings, onSettingChange }: SettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="questionsPerSession" className="text-base font-semibold">
              Questions per Session
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose how many questions you want to practice in each study session
            </p>
            <Input
              id="questionsPerSession"
              type="number"
              min={1}
              max={50}
              value={settings.questionsPerSession}
              onChange={(e) =>
                onSettingChange({
                  questionsPerSession: parseInt(e.target.value) || 10,
                })
              }
              className="max-w-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-6">
              <Label htmlFor="reviewIncorrectOnly" className="text-base font-semibold">
                Focus on Mistakes
              </Label>
              <p className="text-sm text-muted-foreground">
                Practice only questions you previously answered incorrectly
              </p>
            </div>
            <Switch
              id="reviewIncorrectOnly"
              checked={settings.reviewIncorrectOnly}
              onCheckedChange={(checked) =>
                onSettingChange({ reviewIncorrectOnly: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-6">
              <Label htmlFor="shuffleQuestions" className="text-base font-semibold">
                Shuffle Questions
              </Label>
              <p className="text-sm text-muted-foreground">
                Randomize question order for each session
              </p>
            </div>
            <Switch
              id="shuffleQuestions"
              checked={settings.shuffleQuestions}
              onCheckedChange={(checked) =>
                onSettingChange({ shuffleQuestions: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-6">
              <Label htmlFor="showExplanations" className="text-base font-semibold">
                Show Explanations
              </Label>
              <p className="text-sm text-muted-foreground">
                Display detailed explanations after answering
              </p>
            </div>
            <Switch
              id="showExplanations"
              checked={settings.showExplanations}
              onCheckedChange={(checked) =>
                onSettingChange({ showExplanations: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-6">
              <Label htmlFor="soundEffects" className="text-base font-semibold">
                Sound Effects
              </Label>
              <p className="text-sm text-muted-foreground">
                Play audio feedback for correct/incorrect answers
              </p>
            </div>
            <Switch
              id="soundEffects"
              checked={settings.soundEffects}
              onCheckedChange={(checked) =>
                onSettingChange({ soundEffects: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
