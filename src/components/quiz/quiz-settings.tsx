"use client"

import { useState } from "react"
import { useQuizSettings } from "@/hooks/use-quiz-settings"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Shuffle, Target, RotateCcw, BookOpen, Volume2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuizSettings() {
  const { settings, updateSettings, isLoading } = useQuizSettings()
  const [localSettings, setLocalSettings] = useState({
    questionsPerSession: settings.questionsPerSession,
    shuffleQuestions: settings.shuffleQuestions,
    reviewIncorrectOnly: settings.reviewIncorrectOnly,
    showExplanations: settings.showExplanations,
    soundEffects: settings.soundEffects,
    enabledTopics: settings.enabledTopics,
    theme: settings.theme,
    fontSize: settings.fontSize
  })

  const handleSave = async () => {
    try {
      await updateSettings(localSettings)
    } catch (error) {
      console.error('Error saving quiz settings:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="questions-per-session">Questions per Session</Label>
            <Input
              id="questions-per-session"
              type="number"
              min={1}
              max={50}
              value={localSettings.questionsPerSession}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                questionsPerSession: parseInt(e.target.value) || 1
              }))}
              className="max-w-[120px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              <Label htmlFor="shuffle-questions">Shuffle Questions</Label>
            </div>
            <Switch
              id="shuffle-questions"
              checked={localSettings.shuffleQuestions}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                shuffleQuestions: checked
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <div className="space-y-1">
                <Label htmlFor="review-incorrect">Focus on Mistakes</Label>
                <p className="text-sm text-muted-foreground">
                  Prioritize questions you previously answered incorrectly
                </p>
              </div>
            </div>
            <Switch
              id="review-incorrect"
              checked={localSettings.reviewIncorrectOnly}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                reviewIncorrectOnly: checked
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <div className="space-y-1">
                <Label htmlFor="show-explanations">Show Explanations</Label>
                <p className="text-sm text-muted-foreground">
                  Display detailed explanations after answering questions
                </p>
              </div>
            </div>
            <Switch
              id="show-explanations"
              checked={localSettings.showExplanations}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                showExplanations: checked
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <div className="space-y-1">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play audio feedback for correct/incorrect answers
                </p>
              </div>
            </div>
            <Switch
              id="sound-effects"
              checked={localSettings.soundEffects}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                soundEffects: checked
              }))}
            />
          </div>
        </div>

        <Separator />

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}
