'use server'

import { Quiz, QuestionHistory } from '@/components/quiz/modules/types'
import { saveQuizResult } from '@/components/quiz/modules/quiz-operations'
import { User } from '@supabase/supabase-js'

export async function handleQuizCompleteAction(
  user: User,
  quiz: Quiz,
  score: number,
  questionResults: Array<{questionId: string, correct: boolean}>,
  timeSpent: number,
  totalQuestions: number
) {
  if (!user) {
    throw new Error('No user found')
  }

  // Validate question results
  if (!Array.isArray(questionResults)) {
    throw new Error('Question results must be an array')
  }

  const validResults = questionResults.filter(result => {
    if (!result || typeof result !== 'object') {
      return false
    }
    if (!result.questionId || typeof result.questionId !== 'string') {
      return false
    }
    if (typeof result.correct !== 'boolean') {
      return false
    }
    // Verify the question ID exists in the quiz
    if (!quiz.questions.some(q => q.id === result.questionId)) {
      return false
    }
    return true
  })

  if (validResults.length === 0) {
    throw new Error('No valid results found')
  }

  if (validResults.length !== totalQuestions) {
    throw new Error(`Expected ${totalQuestions} results, got ${validResults.length}`)
  }

  // Save quiz result and collect history updates
  const historyUpdates: Record<string, QuestionHistory> = {}
  await saveQuizResult(
    user,
    quiz.id,
    score,
    validResults,
    timeSpent,
    (questionId: string, history: QuestionHistory) => {
      historyUpdates[questionId] = history
    }
  )

  return {
    success: true,
    message: `Quiz completed with score ${score} out of ${totalQuestions}`,
    historyUpdates
  }
}

export async function handleQuizExitAction() {
  // This is a simple action that just returns success
  // The actual cleanup will be handled by the client
  return {
    success: true
  }
} 