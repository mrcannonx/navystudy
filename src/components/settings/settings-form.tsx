"use client"

import { useState } from "react"
import { useSettings } from "@/contexts/settings-context"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, LineChart, Activity } from "lucide-react"

export function SettingsForm() {
  const { settings, loading: settingsLoading, updateSettings } = useSettings()
  const { theme, setTheme } = useTheme()
  const [darkMode, setDarkMode] = useState(theme === 'dark')
  const [showProgress, setShowProgress] = useState(settings?.show_progress ?? true)
  const [showActivity, setShowActivity] = useState(settings?.show_activity ?? true)
  const [profileVisibility, setProfileVisibility] = useState(settings?.profile_visibility ?? 'public')

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        dark_mode: darkMode,
        profile_visibility: profileVisibility as 'public' | 'private',
        show_progress: showProgress,
        show_activity: showActivity,
      })
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked)
    setTheme(checked ? 'dark' : 'light')
  }

  if (settingsLoading) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how the app looks and feels
        </p>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={handleDarkModeChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <Label htmlFor="show-progress">Show Progress</Label>
          </div>
          <Switch
            id="show-progress"
            checked={showProgress}
            onCheckedChange={setShowProgress}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <Label htmlFor="show-activity">Show Activity</Label>
          </div>
          <Switch
            id="show-activity"
            checked={showActivity}
            onCheckedChange={setShowActivity}
          />
        </div>
      </div>

      <Button onClick={handleSaveSettings}>
        Save Changes
      </Button>
    </div>
  )
} 