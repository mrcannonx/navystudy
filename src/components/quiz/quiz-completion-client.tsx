"use client"

import { QuizCompletion } from "./quiz-completion"

interface QuizCompletionClientProps {
  title: string
  score: number
  totalQuestions: number
  answers: boolean[]
  timeSpent: number
  questions: Array<{
    id: string
    question: string
    selectedAnswer: string
    correctAnswer: string
    explanation: string
  }>
  onRetryAction: () => void
  onExitAction: () => void
  settings?: {
    fontSize: 'small' | 'medium' | 'large'
    allowExport: boolean
    showExplanations: boolean
  }
}

export function QuizCompletionClient({
  title,
  score,
  totalQuestions,
  answers,
  timeSpent,
  questions,
  onRetryAction,
  onExitAction,
  settings
}: QuizCompletionClientProps) {
  return (
    <QuizCompletion
      title={title}
      score={score}
      totalQuestions={totalQuestions}
      answers={answers}
      timeSpent={timeSpent}
      questions={questions}
      onRetry={onRetryAction}
      onExit={onExitAction}
      settings={settings}
    />
  )
}
