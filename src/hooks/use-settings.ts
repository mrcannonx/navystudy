import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth"
import { api } from "@/lib/api"

export interface UserSettings {
  theme?: string
  language?: string
  timezone?: string
  notifications_enabled?: boolean
  sound_enabled?: boolean
}

export const defaultSettings: UserSettings = {
  theme: "system",
  language: "en",
  timezone: "UTC",
  notifications_enabled: true,
  sound_enabled: true,
}

export function useSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      const response = await api.get<UserSettings>('/api/settings')
      setSettings(response.data || defaultSettings)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const response = await api.patch<UserSettings>('/api/settings', updates)
      setSettings(response.data)
      return true
    } catch (error) {
      console.error('Failed to update settings:', error)
      return false
    }
  }

  return {
    settings,
    loading,
    updateSettings,
  }
} 