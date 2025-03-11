"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useQuizSettings } from '@/hooks/use-quiz-settings'

import { StudySettings } from '@/components/quiz/modules/study-settings-types'

type QuizSettings = StudySettings

interface QuizSettingsContextType {
  settings: QuizSettings
  updateSettings: (newSettings: QuizSettings) => Promise<void>
  isLoading: boolean
  error: string | null
}

const QuizSettingsContext = createContext<QuizSettingsContextType | undefined>(undefined)

export function QuizSettingsProvider({ children }: { children: ReactNode }) {
  const quizSettings = useQuizSettings()

  return (
    <QuizSettingsContext.Provider value={quizSettings}>
      {children}
    </QuizSettingsContext.Provider>
  )
}

export function useQuizSettingsContext() {
  const context = useContext(QuizSettingsContext)
  if (context === undefined) {
    throw new Error('useQuizSettingsContext must be used within a QuizSettingsProvider')
  }
  return context
}
