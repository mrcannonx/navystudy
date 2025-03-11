import { supabase } from '@/lib/supabase'
import { StudySettings } from './types'
import { User } from '@supabase/supabase-js'

const defaultSettings: StudySettings = {
  questionsPerSession: 10,
  reviewIncorrectOnly: false,
  enabledTopics: [],
  shuffleQuestions: false,
  showExplanations: true,
  soundEffects: false,
  theme: 'system',
  fontSize: 'medium'
}

export async function saveStudySettings(user: User, settings: StudySettings) {
  // First get existing preferences to preserve other settings
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('preferences')
    .eq('id', user.id)
    .single()

  if (fetchError) throw fetchError

  const currentPreferences = profile?.preferences || {}
  
  // Update only the settings portion while preserving other preferences
  const { error } = await supabase
    .from('profiles')
    .update({
      preferences: {
        ...currentPreferences,
        settings: settings
      }
    })
    .eq('id', user.id)

  if (error) throw error
}

export async function fetchStudySettings(user: User): Promise<StudySettings> {
  const { data, error } = await supabase
    .from('profiles')
    .select('preferences')
    .eq('id', user.id)
    .single()

  if (error) throw error

  if (data?.preferences?.settings) {
    return data.preferences.settings
  }

  // If no settings exist, save and return defaults
  await saveStudySettings(user, defaultSettings)
  return defaultSettings
}
