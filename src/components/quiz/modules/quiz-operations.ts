import { supabase } from '@/lib/supabase'

export async function recordQuizSession(
  userId: string,
  quizId: string,
  timeSpent: number,
  questionsAnswered: number,
  correctAnswers: number
) {
  try {
    const now = new Date().toISOString()
    
    // Record quiz completion in user_activities
    const { error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        content_id: quizId,
        content_type: 'quiz',
        activity_type: 'quiz_completion',
        content_title: 'Quiz',
        activity_data: {
          score: questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0,
          timeSpent,
          questionsAnswered,
          correctAnswers,
          completed: true,
          currentAnswers: [],
          metrics: {
            accuracy: questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0,
            averageTimePerQuestion: questionsAnswered > 0 ? timeSpent / questionsAnswered : 0
          }
        },
        created_at: now,
        completed_at: now
      })

    if (activityError) throw activityError

    return { success: true }
  } catch (error) {
    console.error('Error recording quiz session:', error)
    return { success: false, error }
  }
}

export async function getQuizSettings(userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (error) throw error

    return {
      success: true,
      settings: profile?.preferences?.settings?.quiz || {
        questionsPerSession: 10,
        shuffleQuestions: true
      }
    }
  } catch (error) {
    console.error('Error fetching quiz settings:', error)
    return {
      success: false,
      error,
      settings: {
        questionsPerSession: 10,
        shuffleQuestions: true
      }
    }
  }
}

export async function updateQuizSettings(userId: string, newSettings: any) {
  try {
    // Get existing preferences to preserve other settings
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
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
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        preferences: {
          ...profile?.preferences,
          settings: {
            ...currentSettings,
            quiz: newSettings
          }
        }
      })
      .eq('id', userId)

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error('Error updating quiz settings:', error)
    return { success: false, error }
  }
}

export async function saveQuizResult(
  user: any,
  quizId: string,
  score: number,
  questionResults: Array<{questionId: string, correct: boolean}>,
  timeSpent: number,
  onQuestionHistoryUpdate: (questionId: string, history: any) => void
) {
  try {
    const now = new Date().toISOString()
    const correctAnswers = questionResults.filter(r => r.correct).length

    // Create quiz completion record in user_activities
    const { error: sessionError } = await supabase
      .from('user_activities')
      .insert({
        user_id: user.id,
        content_id: quizId,
        content_type: 'quiz',
        activity_type: 'quiz_completion',
        content_title: 'Quiz Result',
        activity_data: {
          score,
          timeSpent,
          questionsAnswered: questionResults.length,
          correctAnswers,
          completed: true,
          currentAnswers: questionResults.map(result => ({
            questionId: result.questionId,
            correct: result.correct,
            timeSpent: timeSpent / questionResults.length // Approximate time per question
          })),
          metrics: {
            accuracy: (correctAnswers / questionResults.length) * 100,
            averageTimePerQuestion: timeSpent / questionResults.length
          }
        },
        created_at: now,
        completed_at: now
      })

    if (sessionError) throw sessionError

    // Get all previous quiz completions for these questions to calculate history
    const { data: previousSessions, error: historyError } = await supabase
      .from('user_activities')
      .select('activity_data')
      .eq('user_id', user.id)
      .eq('content_type', 'quiz')
      .eq('activity_type', 'quiz_completion')
      .order('created_at', { ascending: true })

    if (historyError) throw historyError

    // Calculate question history from all sessions
    const questionHistory: Record<string, { timesSeen: number, timesCorrect: number }> = {}
    previousSessions?.forEach(session => {
      session.activity_data.currentAnswers?.forEach((answer: any) => {
        if (!questionHistory[answer.questionId]) {
          questionHistory[answer.questionId] = { timesSeen: 0, timesCorrect: 0 }
        }
        questionHistory[answer.questionId].timesSeen++
        if (answer.correct) {
          questionHistory[answer.questionId].timesCorrect++
        }
      })
    })

    // Notify caller of history updates
    questionResults.forEach(result => {
      const history = questionHistory[result.questionId] || { timesSeen: 0, timesCorrect: 0 }
      onQuestionHistoryUpdate(result.questionId, {
        questionId: result.questionId,
        times_seen: history.timesSeen,
        times_correct: history.timesCorrect,
        last_seen: now
      })
    })

    return { success: true }
  } catch (error) {
    console.error('Error saving quiz result:', error)
    throw error
  }
}

export async function resetQuizStats(userId: string, quizId: string) {
  try {
    // Delete quiz activities
    const { error: deleteActivitiesError } = await supabase
      .from('user_activities')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', quizId)
      .eq('content_type', 'quiz')
      .eq('activity_type', 'quiz_completion')

    if (deleteActivitiesError) throw deleteActivitiesError

    return { success: true }
  } catch (error) {
    console.error('Error resetting quiz stats:', error)
    throw error
  }
}

export async function deleteQuiz(userId: string, quizId: string) {
  try {
    // First check if user owns the quiz
    const { data: quiz, error: fetchError } = await supabase
      .from('quizzes')
      .select('user_id')
      .eq('id', quizId)
      .single()

    if (fetchError) throw fetchError
    if (quiz.user_id !== userId) {
      throw new Error('Unauthorized to delete this quiz')
    }

    // First delete associated quiz activities
    const { error: deleteActivitiesError } = await supabase
      .from('user_activities')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', quizId)
      .eq('content_type', 'quiz')
      .eq('activity_type', 'quiz_completion')

    if (deleteActivitiesError) {
      console.error('Error deleting quiz activities:', deleteActivitiesError)
      // Continue with deletion even if stats deletion fails
    }

    // Delete the quiz
    const { error: deleteError } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId)

    if (deleteError) throw deleteError

    return { success: true }
  } catch (error) {
    console.error('Error deleting quiz:', error)
    throw error
  }
}