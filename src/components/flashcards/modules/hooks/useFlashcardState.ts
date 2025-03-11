import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { useToast } from "@/components/ui/use-toast"
import { FlashcardDeck, StudySettings } from "@/types/flashcard"
import * as api from "../api/supabase"
import { useFlashcardActions } from "./useFlashcardActions"
import { FlashcardState } from "./types/flashcard-actions.types"

export function useFlashcardState() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  // State for decks and loading
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [loading, setLoading] = useState(true)

  // State for current deck and study progress
  const [currentDeck, setCurrentDeck] = useState<FlashcardDeck | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // State for settings and study session
  const [showSettings, setShowSettings] = useState(false)
  const [studySettings, setStudySettings] = useState<StudySettings>({
    studyMode: 'quickReview',
    cardsPerSession: 10,
    shuffleCards: true,
    showExplanations: true,
    soundEffects: false,
    generalSettings: {
      cardsPerSession: 10,
      shuffleCards: true,
      showExplanations: true,
      soundEffects: false
    }
  })
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null)

  // State for UI behavior
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false)

  // Combine all state and state setters into a FlashcardState object
  const state: FlashcardState = {
    decks: decks as unknown as FlashcardDeck[],
    currentDeck,
    currentCardIndex,
    studySettings,
    studyStartTime,
    setDecks,
    setLoading,
    setCurrentDeck,
    setCurrentCardIndex,
    setIsCompleted,
    setShowSettings,
    setStudySettings,
    setStudyStartTime,
    setShouldScrollToTop
  }

  // Initialize handlers using the useFlashcardActions hook
  const handlers = useFlashcardActions(user?.id, state)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      // Wait for auth to be ready
      if (authLoading) {
        return
      }

      // If no user, clear data and stop loading
      if (!user) {
        setDecks([] as unknown as FlashcardDeck[])
        setLoading(false)
        console.log('No user, skipping initial data load')
        return
      }

      try {
        setLoading(true)
        
        // Fetch decks
        const fetchedDecks = await api.fetchUserDecks(user.id)
        console.log('Fetched decks:', fetchedDecks.length)
        setDecks(fetchedDecks as unknown as FlashcardDeck[])

        // Fetch study settings from profile preferences
        console.log('Fetching study settings for user:', user.id)
        const { data: profile, error } = await api.supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single()

        console.log('Received profile:', profile)
        if (profile?.preferences?.flashcardSettings) {
          const settings = profile.preferences.flashcardSettings
          const transformedSettings: StudySettings = {
            studyMode: settings.studyMode || 'standard',
            cardsPerSession: settings.cardsPerSession || 10,
            shuffleCards: settings.shuffleCards ?? true,
            showExplanations: settings.showExplanations ?? true,
            soundEffects: settings.soundEffects ?? false,
            generalSettings: {
              cardsPerSession: settings.generalSettings?.cardsPerSession ?? 10,
              shuffleCards: settings.generalSettings?.shuffleCards ?? true,
              showExplanations: settings.generalSettings?.showExplanations ?? true,
              soundEffects: settings.generalSettings?.soundEffects ?? false
            }
          }
          console.log('Updating study settings state with:', transformedSettings)
          setStudySettings(transformedSettings)
        } else {
          // If no settings exist in profile, we'll keep the default settings
          console.log('No settings found in profile, using default settings:', studySettings)
          
          // Save default settings to profile
          const { error: saveError } = await api.supabase
            .from('profiles')
            .update({
              preferences: {
                ...profile?.preferences,
                flashcardSettings: studySettings
              }
            })
            .eq('id', user.id)

          if (saveError) {
            console.error('Error saving default settings:', saveError)
          }
        }
      } catch (err) {
        console.error('Error loading initial data:', err)
        toast({
          title: "Error",
          description: "Failed to load flashcard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [user, authLoading])

  // Reset scroll position when requested
  useEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setShouldScrollToTop(false)
    }
  }, [shouldScrollToTop])

  // Return a combined object with state, handlers, and additional properties
  return {
    ...state,
    ...handlers,
    isLoading: loading || authLoading
  }
}