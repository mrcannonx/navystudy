"use client"

import { useState, useEffect } from 'react'
import { supabase } from "@/lib/supabase"
import { useToast } from '@/components/ui/use-toast'

import { StudySettings, DEFAULT_SETTINGS } from '@/components/quiz/modules/study-settings-types'

export function useQuizSettings() {
  const [settings, setSettings] = useState<StudySettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Helper to show success/error messages
  const showToast = (type: 'success' | 'error', message: string) => {
    toast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      variant: type === 'success' ? 'default' : 'destructive',
    });
  };

  // Load settings from database on mount
  useEffect(() => {
    let mounted = true;
    
    const loadSettings = async () => {
      try {
        setError(null)
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        // If there's an auth error or no user, just return default settings without error
        if (authError || !user) {
          if (mounted) {
            setSettings(DEFAULT_SETTINGS)
            setIsLoading(false)
            setError(null)
          }
          return
        }

        console.log('Loading quiz settings for user:', user.id);

        const { data: profile, error: dbError } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single()

        if (dbError) {
          throw dbError
        }

        if (profile?.preferences?.settings?.quiz) {
          console.log('Loaded quiz settings from DB:', profile.preferences.settings.quiz);
          // Ensure all required fields exist by merging with defaults
          const mergedSettings = {
            ...DEFAULT_SETTINGS,
            ...profile.preferences.settings.quiz
          };
          if (mounted) {
            setSettings(mergedSettings);
            console.log('Quiz settings state updated:', mergedSettings);
          }
        } else {
          console.log('No quiz settings found, creating defaults');
          // Create default settings in DB if none exist
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              preferences: {
                settings: {
                  quiz: DEFAULT_SETTINGS,
                  flashcard: {
                    cardsPerSession: 10,
                    shuffleCards: true,
                    useConfidenceRating: true
                  },
                  general: {
                    theme: 'light',
                    notifications: true
                  }
                }
              }
            })
            .eq('id', user.id)
          if (updateError) throw updateError
          if (mounted) {
            setSettings(DEFAULT_SETTINGS);
            console.log('Default quiz settings created:', DEFAULT_SETTINGS);
          }
        }
      } catch (error) {
        // Only log actual errors, not auth-related ones
        if (error instanceof Error && !error.message.includes('auth')) {
          console.error('Error loading quiz settings:', error)
          if (mounted) {
            setError('Failed to load settings')
          }
        }
        // Always use default settings as fallback
        if (mounted) {
          setSettings(DEFAULT_SETTINGS)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadSettings()
    
    return () => {
      mounted = false;
    }
  }, [])

  // Update settings in database
  const updateSettings = async (newSettings: StudySettings) => {
    console.log('Updating quiz settings:', newSettings);
    
    try {
      setError(null)
      
      // Validate newSettings has all required fields
      const validatedSettings = {
        ...DEFAULT_SETTINGS, // Ensure all defaults are present
        ...newSettings      // Override with new values
      };
      
      console.log('Validated quiz settings:', validatedSettings);
      
      // Update local state first
      setSettings(validatedSettings)

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        showToast('error', 'Please sign in to save settings')
        throw new Error('Please sign in to save settings')
      }

      console.log('Saving quiz settings to DB for user:', user.id);

      // Get existing preferences to preserve other settings
      const { data: profile, error: getError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single()

      if (getError) throw getError

      const currentSettings = profile?.preferences?.settings || {
        flashcard: {
          cardsPerSession: 10,
          shuffleCards: true,
          useConfidenceRating: true
        },
        general: {
          theme: 'light',
          notifications: true
        }
      }

      // Update only quiz settings while preserving others
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          preferences: {
            ...profile?.preferences,
            settings: {
              ...currentSettings,
              quiz: validatedSettings
            }
          }
        })
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) throw updateError

      console.log('Quiz settings saved successfully:', data);

      // Verify the saved settings
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single()

      if (verifyError) {
        console.warn('Failed to verify saved quiz settings:', verifyError);
        showToast('error', 'Settings may not have saved correctly');
      } else {
        console.log('Verified saved quiz settings:', verifyData?.preferences?.settings?.quiz);
        if (verifyData?.preferences?.settings?.quiz?.questionsPerSession === validatedSettings.questionsPerSession) {
          showToast('success', 'Settings saved successfully');
        } else {
          showToast('error', 'Settings may not have saved correctly');
        }
      }

    } catch (error) {
      console.error('Error saving quiz settings:', error)
      setError('Failed to save settings')
      // Revert local state on error
      setSettings(settings)
      showToast('error', 'Failed to save settings. Please try again.');
      throw error
    }
  }

  return {
    settings,
    updateSettings,
    isLoading,
    error
  }
}
