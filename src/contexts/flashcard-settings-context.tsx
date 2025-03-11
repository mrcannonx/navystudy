"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useStudySettings } from '@/hooks/use-study-settings'
import type { StudySettings } from '@/types/flashcard'

interface FlashcardSettingsContextType {
  settings: StudySettings
  updateSettings: (newSettings: Partial<StudySettings>) => Promise<void>
  updateSetting: <K extends keyof StudySettings>(key: K, value: StudySettings[K]) => Promise<void>
  isLoading: boolean
  error: string | null
}

const FlashcardSettingsContext = createContext<FlashcardSettingsContextType | undefined>(undefined)

export function FlashcardSettingsProvider({ children }: { children: ReactNode }) {
  const { settings, isLoading, error } = useStudySettings()

  // Create no-op functions with the correct types
  const updateSettings = async (newSettings: Partial<StudySettings>): Promise<void> => {
    // No-op function
  }

  const updateSetting = async <K extends keyof StudySettings>(
    key: K,
    value: StudySettings[K]
  ): Promise<void> => {
    // No-op function
  }

  // Simplified context that just passes through the values from useStudySettings
  return (
    <FlashcardSettingsContext.Provider value={{
      settings,
      updateSettings,
      updateSetting,
      isLoading,
      error
    }}>
      {children}
    </FlashcardSettingsContext.Provider>
  )
}

export function useFlashcardSettingsContext() {
  const context = useContext(FlashcardSettingsContext)
  if (context === undefined) {
    throw new Error('useFlashcardSettingsContext must be used within a FlashcardSettingsProvider')
  }
  return context
}