import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { QuizQuestion } from './quiz-question'
import { QuizCompletion } from './quiz-completion'
import { AuthGuard } from './auth-guard'
import { ErrorDisplay } from './error-display'
import { QuizProgress } from './quiz-progress'
import { useQuizState } from '@/hooks/use-quiz-state'
import { useQuizLoader } from '@/hooks/use-quiz-loader'
import { useQuizSettingsContext } from '@/contexts/quiz-settings-context'

interface QuizInterfaceProps {
  quizId: string
}

export default function QuizInterfaceClient({ quizId }: QuizInterfaceProps) {
  const router = useRouter()
  const { settings } = useQuizSettingsContext()
  const { questions, title, isLoading, error, totalQuestionsAnswered, isReviewSession, totalQuestions } = useQuizLoader(quizId)
  const { state, resetQuiz, recordAnswer, updateState, goToNextQuestion } = useQuizState(quizId, questions)
  // Use totalQuestions directly from the loader, which now represents the number of questions in the current session
  const actualTotalQuestions = totalQuestions

  // Update state when questions or title change
  useEffect(() => {
    console.log('Quiz data loaded:', {
      questions: questions.length,
      title,
      isLoading,
      totalQuestionsAnswered,
      isReviewSession
    });
    
    updateState({
      questions,
      quizTitle: title,
      isLoading,
      totalQuestionsAnswered: totalQuestionsAnswered || 0,
      isReviewSession: isReviewSession || false
    });
  }, [questions, title, isLoading, totalQuestionsAnswered, isReviewSession, updateState]);

  const [isNavigating, setIsNavigating] = useState(false);

  const handleExit = useCallback(() => {
    console.log('Attempting to exit quiz...');
    setIsNavigating(true);
    window.location.href = '/quiz';
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Card className="relative min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading quiz...</p>
              </div>
            ) : error || state.error ? (
              <div className="p-6">
                <ErrorDisplay message={error || state.error} />
              </div>
            ) : state.quizComplete ? (
              <QuizCompletion
                title={title}
                score={state.correctAnswers}
                totalQuestions={actualTotalQuestions}
                answers={state.answers}
                timeSpent={0}
                questions={questions.map((q, i) => ({
                  id: q.question,
                  question: q.question,
                  selectedAnswer: state.selectedAnswers[i],
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation
                }))}
                onRetry={resetQuiz}
                onExit={handleExit}
                isNavigating={isNavigating}
                settings={{
                  fontSize: 'medium',
                  allowExport: false,
                  showExplanations: settings.showExplanations
                }}
              />
            ) : (
              <>
                {(() => {
                  // Calculate progress based on questions answered
                  const totalQuestions = actualTotalQuestions; // Use actual total questions count
                  const currentProgress = state.questionsAnswered; // Use questionsAnswered for progress
                  
                  console.log('Progress calculation:', {
                    currentSession: {
                      currentQuestionIndex: state.currentQuestionIndex,
                      questionsAnswered: state.questionsAnswered,
                      currentProgress,
                      limit: settings.questionsPerSession
                    },
                    total: {
                      totalQuestions,
                      actualTotalQuestions
                    }
                  });
                  
                  return (
                    <QuizProgress
                      currentQuestion={currentProgress}
                      totalQuestions={totalQuestions}
                      title={title}
                      onExit={handleExit}
                      isNavigating={isNavigating}
                    />
                  );
                })()}
                <CardContent>
                  {questions.length > 0 && (
                    <QuizQuestion
                      question={questions[state.currentQuestionIndex].question}
                      choices={questions[state.currentQuestionIndex].options}
                      onAnswer={(choice) => {
                        console.log('Recording answer in QuizInterfaceClient:', {
                          choice,
                          currentQuestionIndex: state.currentQuestionIndex,
                          currentState: state
                        });
                        recordAnswer(choice);
                      }}
                      currentQuestionNumber={state.currentQuestionIndex + 1}
                      totalQuestions={actualTotalQuestions}
                      selectedAnswer={state.selectedAnswers[state.currentQuestionIndex]}
                      correctAnswer={questions[state.currentQuestionIndex].correctAnswer}
                      explanation={questions[state.currentQuestionIndex].explanation}
                      onNextQuestion={goToNextQuestion}
                      isAnswered={Boolean(state.answers[state.currentQuestionIndex] !== undefined)}
                      settings={settings}
                    />
                  )}
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
