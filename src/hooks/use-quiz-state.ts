import { useState, useCallback, useRef } from 'react'
import { useQuizSettings } from './use-quiz-settings'
import { useStudyAnalytics } from './use-study-analytics'
import { sounds } from '@/lib/sounds'

export interface Question {
  id?: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export interface QuizState {
  questions: Question[]
  currentQuestionIndex: number
  questionsAnswered: number
  totalQuestionsAnswered: number
  correctAnswers: number
  answers: boolean[]
  selectedAnswers: string[]
  quizComplete: boolean
  quizId: string
  quizTitle: string
  previousMistakes: Question[]
  isLoading: boolean
  error: string | null
  isReviewSession?: boolean // Flag to track if this is a review session
}

export function useQuizState(quizId: string, initialQuestions: Question[] = []) {
  const { settings } = useQuizSettings()
  const { recordStudySession } = useStudyAnalytics()
  // Add a ref to track if the session has been recorded to prevent duplicate recordings
  const sessionRecordedRef = useRef(false)

  const [state, setState] = useState<QuizState>(() => ({
    questions: initialQuestions,
    currentQuestionIndex: 0,
    questionsAnswered: 0,
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    answers: [],
    selectedAnswers: [],
    quizComplete: false,
    quizId,
    quizTitle: '',
    previousMistakes: [],
    isLoading: true,
    error: null
  }))

  const updateState = useCallback((updates: Partial<QuizState>) => {
    setState(prev => {
      // Ensure we preserve totalQuestionsAnswered if not explicitly updated
      const newState = {
        ...prev,
        ...updates,
        totalQuestionsAnswered: updates.totalQuestionsAnswered ?? prev.totalQuestionsAnswered
      };

      console.log('Quiz state updated:', {
        previous: {
          questionsAnswered: prev.questionsAnswered,
          totalQuestionsAnswered: prev.totalQuestionsAnswered,
          currentQuestionIndex: prev.currentQuestionIndex
        },
        updates,
        new: {
          questionsAnswered: newState.questionsAnswered,
          totalQuestionsAnswered: newState.totalQuestionsAnswered,
          currentQuestionIndex: newState.currentQuestionIndex
        }
      });
      return newState;
    });
  }, [])

  const resetQuiz = () => {
    console.log('Resetting quiz state');
    
    // Reset the session recorded flag when starting a new quiz
    sessionRecordedRef.current = false;
    
    // Reset the state to start a new session
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      answers: [],
      selectedAnswers: [],
      quizComplete: false
    }));
    
    // Return to quiz page with the quiz ID as a query parameter instead of path segment
    const currentQuizId = state.quizId;
    setTimeout(() => {
      console.log('Reloading current quiz to restart with fresh questions');
      window.location.href = `/quiz?id=${currentQuizId}&reload=${Date.now()}`;
    }, 500);
  }

  const recordAnswer = (choice: string) => {
    setState(prevState => {
      const currentQuestion = prevState.questions[prevState.currentQuestionIndex];
      const isCorrect = choice === currentQuestion.correctAnswer;
      const questionsAnswered = prevState.questionsAnswered + 1;

      // Play sound effect if enabled
      if (settings.soundEffects) {
        if (isCorrect) {
          sounds.correct();
        } else {
          sounds.incorrect();
        }
      }

      // Create a copy of the current arrays
      const newAnswers = [...prevState.answers];
      const newSelectedAnswers = [...prevState.selectedAnswers];
      
      // Update the arrays at the current question index
      newAnswers[prevState.currentQuestionIndex] = isCorrect;
      newSelectedAnswers[prevState.currentQuestionIndex] = choice;

      // Calculate total progress
      const totalProgress = Math.min(questionsAnswered + prevState.totalQuestionsAnswered, prevState.questions.length); // Cap at actual total questions

      const newState = {
        ...prevState,
        questionsAnswered,
        correctAnswers: isCorrect ? prevState.correctAnswers + 1 : prevState.correctAnswers,
        answers: newAnswers,
        selectedAnswers: newSelectedAnswers
      };

      console.log('Recording answer:', {
        choice,
        isCorrect,
        currentIndex: prevState.currentQuestionIndex,
        question: currentQuestion.question,
        progress: {
          currentSession: questionsAnswered,
          previousSessions: prevState.totalQuestionsAnswered,
          total: totalProgress,
          maxQuestions: prevState.questions.length
        }
      });

      return newState;
    });
  }

  const goToNextQuestion = () => {
    setState(prevState => {
      if (prevState.currentQuestionIndex < prevState.questions.length - 1) {
        console.log('Moving to next question:', {
          currentIndex: prevState.currentQuestionIndex,
          nextIndex: prevState.currentQuestionIndex + 1
        });
        return {
          ...prevState,
          currentQuestionIndex: prevState.currentQuestionIndex + 1
        };
      } else {
        console.log('Completing quiz:', {
          questionsAnswered: prevState.questionsAnswered,
          correctAnswers: prevState.correctAnswers,
          sessionAlreadyRecorded: sessionRecordedRef.current // Add logging to track the flag
        });
        
        // Only record the session if it hasn't been recorded yet
        if (!sessionRecordedRef.current) {
          // Mark the session as recorded before async operations
          sessionRecordedRef.current = true;
          
          // Include all questions that were answered in this session
          const answeredQuestions = prevState.questions
            .slice(0, prevState.questionsAnswered)
            .map((q, index) => ({
              question: q.question,
              correctAnswer: q.correctAnswer,
              options: q.options,
              explanation: q.explanation,
              wasCorrect: prevState.answers[index] || false
            }));

          console.log('Saving completed study session:', {
            questionsAnswered: prevState.questionsAnswered,
            correctAnswers: prevState.correctAnswers,
            questions: answeredQuestions.map(q => q.question.substring(0, 30) + '...')
          });

          // Calculate if this is a review session (set to true if reviewing previously answered questions)
          const isReviewSession = prevState.isReviewSession === true;
          
          console.log('Saving quiz session:', {
            isReviewSession,
            questionsAnswered: prevState.questionsAnswered,
            correctAnswers: prevState.correctAnswers,
            isAllQuestionsAnswered: prevState.totalQuestionsAnswered >= prevState.questions.length
          });
          
          recordStudySession(prevState.quizId, {
            timeSpent: 0,
            questionsAnswered: prevState.questionsAnswered,
            correctAnswers: prevState.correctAnswers,
            totalQuestions: prevState.questionsAnswered, // Add totalQuestions field to match what statistics-operations.ts expects
            correctCount: prevState.correctAnswers, // Add correctCount field to match what statistics-operations.ts expects
            topic: prevState.quizTitle,
            questions: answeredQuestions,
            currentAnswers: prevState.selectedAnswers.slice(0, prevState.questionsAnswered),
            answers: prevState.answers.slice(0, prevState.questionsAnswered),
            isReviewSession: isReviewSession, // Add flag for tracking review sessions
            sessionType: isReviewSession ? 'review' : 'initial' // Add session type for analytics
          }).catch(error => {
            console.error('Error recording study session:', error)
          });
        } else {
          console.log('Skipping duplicate session recording');
        }
        return {
          ...prevState,
          quizComplete: true
        };
      }
    });
  }

  return {
    state,
    updateState,
    resetQuiz,
    recordAnswer,
    goToNextQuestion
  }
}
