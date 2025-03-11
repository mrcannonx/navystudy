import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useQuizSettings } from './use-quiz-settings'
import { Question } from './use-quiz-state'
import { useAuth } from '@/contexts/auth'

interface QuizData {
  questions: Question[]
  title: string
  previousMistakes: Question[]
  totalQuestions: number
  totalQuestionsAnswered: number
  isLoading: boolean
  error: string | null
  isReviewSession?: boolean // Flag to track review sessions
}

export function useQuizLoader(quizId: string) {
  const [data, setData] = useState<QuizData>({
    questions: [],
    title: '',
    previousMistakes: [],
    totalQuestions: 0,
    totalQuestionsAnswered: 0,
    isLoading: true,
    error: null
  })
  const { settings } = useQuizSettings()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    let mounted = true

    const loadQuiz = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }))

        // Load quiz data and previous mistakes from Supabase
        const [quizResponse, sessionsResponse] = await Promise.all([
          supabase
            .from('quizzes')
            .select('*')
            .eq('id', quizId)
            .single(),
          supabase
            .from('user_activities')
            .select(`
              activity_data,
              created_at
            `)
            .eq('user_id', user.id)
            .eq('content_id', quizId)
            .eq('content_type', 'quiz')
            .eq('activity_type', 'quiz_completion')
            .not('activity_data', 'is', null)
            .not('activity_data', 'eq', '{}')
            .order('created_at', { ascending: false })
        ])
        
        if (quizResponse.error) throw quizResponse.error
        if (!quizResponse.data) throw new Error('Quiz not found')

        // Handle both flat questions array and topics-based structure
        const rawData = quizResponse.data.questions || {}
        const rawQuestions = Array.isArray(rawData.questions)
          ? rawData.questions
          : Array.isArray(rawData.topics)
            ? rawData.topics.flatMap((t: any) => t.questions)
            : []

        // Extract questions and ensure proper structure
        const quizQuestions = rawQuestions.map((q: any) => ({
          question: q.question || '',
          options: Array.isArray(q.options) ? q.options : [],
          correctAnswer: q.correctAnswer || '',
          explanation: q.explanation || '',
          id: q.id || q.question // Fallback to question text if no id
        }))

        // Get total questions before any filtering
        const totalQuestions = quizQuestions.length
        console.log('Quiz questions loaded:', {
          totalQuestions,
          title: quizResponse.data.title,
          questionsBeforeFiltering: quizQuestions.length,
          questionsPerSession: settings.questionsPerSession
        })

        // Filter sessions with valid data
        const validSessions = (sessionsResponse.data || []).filter(session => {
          const data = session.activity_data
          return data &&
                 typeof data.score === 'number' && data.score >= 0 &&
                 typeof data.timeSpent === 'number' && data.timeSpent >= 0 &&
                 typeof data.questionsAnswered === 'number' && data.questionsAnswered >= 0 &&
                 typeof data.correctAnswers === 'number' && data.correctAnswers >= 0
        })

        // Process previous sessions to find mistakes and track unique questions answered
        const mistakes = new Set<string>()
        const answeredQuestions = new Set<string>()
        
        console.log('Processing study sessions:', {
          sessionCount: validSessions.length,
          sessions: validSessions.map(s => ({
            created_at: s.created_at,
            activity_data: s.activity_data
          }))
        })
        
        // Sort sessions by creation date to process them in order
        const sortedSessions = [...validSessions].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        
        sortedSessions.forEach((session, idx) => {
          const sessionData = session.activity_data
          console.log(`Processing session ${idx}:`, {
            created_at: session.created_at,
            sessionData: {
              questionsAnswered: sessionData?.questionsAnswered,
              correctAnswers: sessionData?.correctAnswers,
              topic: sessionData?.topic
            }
          })
          
          // Track unique questions answered
          if (sessionData?.questions && Array.isArray(sessionData.questions)) {
            sessionData.questions.forEach((q: any) => {
              if (q.question) {
                answeredQuestions.add(q.question)
              }
            })
          }
          
          // Track mistakes
          if (sessionData?.answers && Array.isArray(sessionData.answers)) {
            sessionData.answers.forEach((correct: boolean, idx: number) => {
              if (!correct && sessionData.questions?.[idx]?.question) {
                mistakes.add(sessionData.questions[idx].question)
              }
            })
          }
        })
        
        const totalQuestionsAnswered = answeredQuestions.size
        
        console.log('Final processing results:', {
          uniqueQuestionsAnswered: totalQuestionsAnswered,
          totalQuestions: quizQuestions.length,
          mistakesCount: mistakes.size,
          sessionCount: sortedSessions.length,
          answeredQuestions: Array.from(answeredQuestions)
        })

        // Filter questions based on settings and prioritize unanswered questions
        let finalQuestions = [...quizQuestions]
        
        // Get the set of unanswered questions
        const unansweredQuestions = quizQuestions.filter(
          (q: Question) => !answeredQuestions.has(q.question)
        );
        
        console.log('Question selection analysis:', {
          totalQuestions: quizQuestions.length,
          answeredQuestions: answeredQuestions.size,
          unansweredQuestions: unansweredQuestions.length,
          reviewIncorrectOnly: settings.reviewIncorrectOnly,
          mistakesCount: mistakes.size
        });
        
        if (settings.reviewIncorrectOnly && mistakes.size > 0) {
          // Filter questions to prioritize previous mistakes
          const mistakeQuestions = quizQuestions.filter((q: Question) => mistakes.has(q.question));
          
          // If we don't have enough mistake questions, add unanswered questions first, 
          // then add already answered questions if needed
          if (mistakeQuestions.length < settings.questionsPerSession) {
            // First add unanswered questions that aren't mistakes
            const newQuestions = unansweredQuestions
              .filter((q: Question) => !mistakes.has(q.question))
              .slice(0, settings.questionsPerSession - mistakeQuestions.length);
              
            // Then add other questions if we still need more
            if (mistakeQuestions.length + newQuestions.length < settings.questionsPerSession) {
              const remainingNeeded = settings.questionsPerSession - mistakeQuestions.length - newQuestions.length;
              const otherQuestions = quizQuestions
                .filter((q: Question) => !mistakes.has(q.question) && !unansweredQuestions.some((uq: Question) => uq.question === q.question))
                .slice(0, remainingNeeded);
                
              finalQuestions = [...mistakeQuestions, ...newQuestions, ...otherQuestions];
            } else {
              finalQuestions = [...mistakeQuestions, ...newQuestions];
            }
          } else {
            finalQuestions = mistakeQuestions;
          }
        } else if (unansweredQuestions.length > 0) {
          // Prioritize unanswered questions first
          if (unansweredQuestions.length >= settings.questionsPerSession) {
            // If we have enough unanswered questions, just use those
            finalQuestions = unansweredQuestions;
          } else {
            // Otherwise, use all unanswered questions and add some already answered ones
            const answeredQuestionsToAdd = quizQuestions
              .filter((q: Question) => answeredQuestions.has(q.question))
              .slice(0, settings.questionsPerSession - unansweredQuestions.length);
              
            finalQuestions = [...unansweredQuestions, ...answeredQuestionsToAdd];
          }
        } else {
          // If all questions have been answered, just use the full set
          finalQuestions = quizQuestions;
        }
        
        // Apply question limit
        if (settings.questionsPerSession > 0) {
          finalQuestions = finalQuestions.slice(0, settings.questionsPerSession);
        }

        // Log final question selection
        console.log('Final question selection:', {
          questionsSelected: finalQuestions.length,
          questionIds: finalQuestions.map(q => q.question.substring(0, 30) + '...'),
          unansweredSelected: finalQuestions.filter(q => !answeredQuestions.has(q.question)).length,
          mistakesSelected: finalQuestions.filter(q => mistakes.has(q.question)).length
        });
        
        // Always shuffle questions to ensure a fresh order
        finalQuestions = [...finalQuestions].sort(() => Math.random() - 0.5);
        
        // Track whether this is a review session (all questions have been answered before)
        const isReviewSession = finalQuestions.every(q => answeredQuestions.has(q.question));
        
        console.log('Session type:', {
          isReviewSession,
          allQuestionsAnswered: answeredQuestions.size >= quizQuestions.length,
          questionsInSession: finalQuestions.length
        });
        
        if (mounted) {
          setData({
            questions: finalQuestions,
            title: quizResponse.data.title,
            previousMistakes: finalQuestions.filter((q: Question) => mistakes.has(q.question)),
            totalQuestions: finalQuestions.length, // Use the number of questions in the current session
            totalQuestionsAnswered: totalQuestionsAnswered,
            isLoading: false,
            error: null,
            isReviewSession: isReviewSession // Pass the flag to the state
          })
        }
      } catch (error) {
        console.error('Error loading quiz:', error)
        if (mounted) {
          setData(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load quiz'
          }))
        }
      }
    }

    loadQuiz()

    return () => {
      mounted = false
    }
  }, [quizId, settings, user])

  return data
}
