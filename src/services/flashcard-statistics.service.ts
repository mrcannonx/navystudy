import { StudyStatistics } from "@/types/statistics.types"
import { supabase } from "@/lib/supabase"

export const fetchFlashcardStatistics = async (userId: string): Promise<StudyStatistics> => {
  // Get flashcards data
  const { data: flashcards, error: flashcardsError } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', userId)
    .order('last_studied_at', { ascending: false })

  if (flashcardsError) throw flashcardsError

  // Initialize empty confidence ratings since we no longer use the flashcard_confidence_ratings table
  const confidenceRatings: Array<{
    id?: string;
    flashcard_id?: string;
    user_id?: string;
    rating?: number;
    metadata?: {
      card_id?: string;
      confidence?: number;
    };
  }> = [];

  // Initialize statistics
  const stats: StudyStatistics = {
    cardsStudied: 0,
    timeSpent: 0,
    lastStudied: '',
    streak: 0,
    studiedCardIds: [],
    confidenceRatings: {},
    type_distribution: {
      basic: 0,
      cloze: 0,
      reversed: 0
    },
    difficulty_distribution: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    topic_progress: [],
    average_complexity: 0
  }

  if (flashcards && flashcards.length > 0) {
    try {
      // Process flashcard data
      const mostRecentFlashcard = flashcards.find(fc => fc.last_studied_at)
      
      // Total cards studied (sum of completed_count)
      stats.cardsStudied = flashcards.reduce((sum, fc) => sum + (fc.completed_count || 0), 0)
      
      // Total mastered cards
      const masteredCount = flashcards.reduce((sum, fc) => sum + (fc.mastered_cards?.length || 0), 0)
      
      // Time spent (estimate based on completed_count, assuming 1 minute per completed session)
      stats.timeSpent = flashcards.reduce((sum, fc) => sum + (fc.completed_count || 0), 0)
      
      // Last studied date
      stats.lastStudied = mostRecentFlashcard?.last_studied_at || new Date().toISOString()
      
      // Populate studiedCardIds array
      stats.studiedCardIds = flashcards
        .filter(fc => fc.id && fc.last_studied_at)
        .map(fc => fc.id)
      
      // Calculate streak based on consecutive days with study activity
      // Group study dates by day
      const studyDates = new Set<string>()
      flashcards.forEach(flashcard => {
        if (flashcard.last_studied_at) {
          const date = new Date(flashcard.last_studied_at).toISOString().split('T')[0]
          studyDates.add(date)
        }
      })
      
      // Check consecutive days
      let streak = 0
      const today = new Date()
      
      // Check each date in the last 30 days
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        const dateString = checkDate.toISOString().split('T')[0]
        
        if (studyDates.has(dateString)) {
          streak++
        } else if (streak > 0) {
          // Break on first missed day after starting a streak
          break
        }
      }
      
      stats.streak = streak
    } catch (error) {
      console.error("Error processing flashcard data:", error)
    }
    
    try {
      // Process card types
      flashcards.forEach(flashcard => {
        // Count card types
        if (flashcard.type) {
          const type = flashcard.type.toLowerCase()
          if (type === 'basic' && stats.type_distribution.basic !== undefined) {
            stats.type_distribution.basic++
          } else if (type === 'cloze' && stats.type_distribution.cloze !== undefined) {
            stats.type_distribution.cloze++
          } else if (type === 'reversed' && stats.type_distribution.reversed !== undefined) {
            stats.type_distribution.reversed++
          }
        }
        
        // Count difficulty distribution
        if (flashcard.difficulty) {
          const difficulty = flashcard.difficulty.toLowerCase()
          if (difficulty === 'easy' && stats.difficulty_distribution.easy !== undefined) {
            stats.difficulty_distribution.easy++
          } else if (difficulty === 'medium' && stats.difficulty_distribution.medium !== undefined) {
            stats.difficulty_distribution.medium++
          } else if (difficulty === 'hard' && stats.difficulty_distribution.hard !== undefined) {
            stats.difficulty_distribution.hard++
          }
        }
        
        // Track topic progress
        if (flashcard.topic && !stats.topic_progress.some(tp => tp.topic === flashcard.topic)) {
          stats.topic_progress.push({
            topic: flashcard.topic,
            progress: flashcard.progress || 0,
            cardCount: 1
          })
        } else if (flashcard.topic) {
          const topicIndex = stats.topic_progress.findIndex(tp => tp.topic === flashcard.topic)
          if (topicIndex >= 0) {
            stats.topic_progress[topicIndex].cardCount++
            stats.topic_progress[topicIndex].progress += (flashcard.progress || 0)
          }
        }
        
        // Average complexity
        if (flashcard.complexity_score) {
          stats.average_complexity += flashcard.complexity_score
        }
      })
      
      // Finalize average complexity
      if (flashcards.length > 0) {
        stats.average_complexity /= flashcards.length
      }
      
      // Normalize topic progress percentages
      stats.topic_progress.forEach(topic => {
        if (topic.cardCount > 0) {
          topic.progress = topic.progress / topic.cardCount
        }
      })
      
      // Process confidence ratings from flashcard_confidence_ratings table
      if (confidenceRatings && confidenceRatings.length > 0) {
        confidenceRatings.forEach(rating => {
          // Check if we have card-specific data in metadata
          if (rating.metadata && rating.metadata.card_id) {
            const cardId = rating.metadata.card_id;
            const confidenceValue = rating.metadata.confidence || rating.rating;
            
            if (cardId && confidenceValue !== undefined) {
              stats.confidenceRatings[cardId] = confidenceValue;
            }
          } else {
            // Fallback to using the flashcard_id (deck ID) and rating
            const flashcardId = rating.flashcard_id;
            const confidenceValue = rating.rating;
            
            if (flashcardId && confidenceValue !== undefined) {
              stats.confidenceRatings[flashcardId] = confidenceValue;
            }
          }
        });
      }
    } catch (error) {
      console.error("Error processing flashcard details:", error)
    }
  }

  return stats
}