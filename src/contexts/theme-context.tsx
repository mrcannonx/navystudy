"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type ThemeContextType = {
  usThemeEnabled: boolean
  toggleUsTheme: () => Promise<void>
  loading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [usThemeEnabled, setUsThemeEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadThemeSettings() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'us_theme_enabled')
          .single()

        if (error) {
          console.error('Error loading theme settings:', error)
          return
        }

        setUsThemeEnabled(data?.value === 'true')
      } catch (error) {
        console.error('Error loading theme settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadThemeSettings()
  }, [])

  const toggleUsTheme = async () => {
    try {
      const newValue = !usThemeEnabled
      setUsThemeEnabled(newValue)

      // Update in database
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          key: 'us_theme_enabled', 
          value: newValue.toString() 
        })

      if (error) {
        console.error('Error saving theme settings:', error)
        // Revert state if save failed
        setUsThemeEnabled(!newValue)
      }
    } catch (error) {
      console.error('Error toggling theme:', error)
      // Revert state if save failed
      setUsThemeEnabled(!usThemeEnabled)
    }
  }

  return (
    <ThemeContext.Provider value={{ usThemeEnabled, toggleUsTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}