"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Settings = {
  dark_mode: boolean
  profile_visibility: 'public' | 'private'
  show_progress: boolean
  show_activity: boolean
}

type SettingsContextType = {
  settings: Settings | null
  loading: boolean
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single()

        if (error) throw error

        const defaultSettings = {
          dark_mode: false,
          profile_visibility: 'public',
          show_progress: true,
          show_activity: true,
        }

        setSettings(profile?.preferences?.settings?.general || defaultSettings)
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const updatedSettings = { ...settings, ...newSettings }
      
      // Get current preferences to preserve other settings
      const { data: profile, error: getError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single()

      if (getError) throw getError

      const { error } = await supabase
        .from('profiles')
        .update({ 
          preferences: {
            ...profile?.preferences,
            settings: {
              ...(profile?.preferences?.settings || {}),
              general: updatedSettings
            }
          }
        })
        .eq('id', user.id)

      if (error) throw error

      setSettings(updatedSettings as Settings)
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
