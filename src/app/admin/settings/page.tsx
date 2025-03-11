"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Flag, Palette, Globe } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useToast } from "@/contexts/toast-context"

export default function AdminSettingsPage() {
  const { usThemeEnabled, toggleUsTheme, loading } = useTheme()
  const { addToast } = useToast()
  const [isToggling, setIsToggling] = useState(false)

  const handleToggleTheme = async () => {
    try {
      setIsToggling(true)
      await toggleUsTheme()
      addToast({
        title: "Theme Updated",
        description: `US theme has been ${usThemeEnabled ? "disabled" : "enabled"}.`,
      })
    } catch (error) {
      console.error("Error toggling theme:", error)
      addToast({
        title: "Error",
        description: "Failed to update theme settings.",
        variant: "destructive",
      })
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-gray-500 mt-2">Configure application settings and appearance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Appearance Settings */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="space-y-6">
            {/* US Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-600" />
                  <Label htmlFor="us-theme" className="text-base font-medium">United States Theme</Label>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable a red, white, and blue color theme for the user dashboard.
                </p>
              </div>
              <Switch
                id="us-theme"
                checked={usThemeEnabled}
                onCheckedChange={handleToggleTheme}
                disabled={loading || isToggling}
              />
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-amber-100 dark:bg-amber-800/30 rounded-full mt-0.5">
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      The US theme applies a patriotic red, white, and blue color scheme to the user dashboard. 
                      This theme affects all users and can be toggled on or off globally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Other Settings Cards can be added here */}
      </div>
    </div>
  )
}