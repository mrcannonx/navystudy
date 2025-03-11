import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { Quiz, QuestionHistory, StudySettings, QuizStatistics } from "./types"
import { supabase } from "@/lib/supabase"
import { fetchQuizStatistics } from "./statistics-operations"

export function useQuizData() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [questionHistory, setQuestionHistory] = useState<Record<string, QuestionHistory>>({})
  const [statistics, setStatistics] = useState<QuizStatistics>({
    streak: 0,
    longestStreak: 0,
    daysStudiedThisWeek: 0,
    totalQuestions: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    averageScore: 0,
    timeSpent: 0,
    lastStudied: null
  })
  const [studySettings, setStudySettings] = useState<StudySettings>({
    questionsPerSession: 10,
    reviewIncorrectOnly: false,
    enabledTopics: [],
    shuffleQuestions: true,
    showExplanations: true,
    soundEffects: true,
    theme: 'system',
    fontSize: 'medium'
  })

  useEffect(() => {
    if (user) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    try {
      await Promise.all([
        fetchQuizzes(),
        fetchQuestionHistory(),
        fetchStatistics(),
        fetchStudySettings()
      ])
    } catch (error) {
      console.error("Error fetching quiz data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuizzes = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      interface TopicData {
        questions: Array<{
          question: string;
          options: string[];
          correctAnswer: string;
          explanation: string;
        }>;
      }

      // Process quizzes and extract metadata
      const validatedQuizzes = (data || []).map(quiz => {
        const questions = quiz.questions || {};
        const metadata = questions.metadata || {};
        
        // Handle both flat questions array and topics-based structure
        const questionsList = Array.isArray(questions.questions)
          ? questions.questions
          : Array.isArray(questions.topics)
            ? questions.topics.flatMap((t: TopicData) => t.questions)
            : [];

        // Ensure each question has an id and proper typing
        const processedQuestions = questionsList.map((q: {
          id?: string;
          question: string;
          options: string[];
          correctAnswer: string;
          explanation: string;
        }) => ({
          ...q,
          id: q.id || q.question // Fallback to question text if no id
        }));
        
        // Calculate total questions from the actual questions list
        const questionCount = processedQuestions.length || metadata.questionCount || 0;
        
        console.log(`Processed quiz ${quiz.id}:`, {
          title: quiz.title,
          questionCount,
          actualQuestions: processedQuestions.length
        });
        
        return {
          ...quiz,
          questions: processedQuestions,
          totalQuestions: questionCount
        };
      });

      setQuizzes(validatedQuizzes)
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    }
  }

  const fetchQuestionHistory = async () => {
    if (!user) return
    try {
      console.log('[QuizData] Fetching question history:', {
        userId: user.id,
        query: {
          select: 'created_at, activity_data',
          filters: {
            user_id: user.id,
            content_type: 'quiz',
            activity_type: 'quiz_completion'
          },
          order: 'created_at.desc'
        }
      })

      const { data, error } = await supabase
        .from("user_activities")
        .select("created_at, activity_data")
        .eq("user_id", user.id)
        .eq("content_type", "quiz")
        .eq("activity_type", "quiz_completion")
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[QuizData] Error fetching question history:', {
          error,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('[QuizData] Question history fetched:', {
        sessionCount: data?.length || 0
      })

      const historyMap: Record<string, QuestionHistory> = {}
      data?.forEach(attempt => {
        const answers = attempt.activity_data.answers || []
        answers.forEach((answer: any) => {
          const questionId = answer.questionId
          if (!historyMap[questionId]) {
            historyMap[questionId] = {
              questionId,
              lastAnswered: new Date(attempt.created_at || Date.now()),
              timesCorrect: answer.correct ? 1 : 0,
              timesIncorrect: answer.correct ? 0 : 1,
              nextReviewDate: new Date() // Calculate based on SRS if needed
            }
          } else {
            if (answer.correct) {
              historyMap[questionId].timesCorrect++
            } else {
              historyMap[questionId].timesIncorrect++
            }
          }
        })
      })
      setQuestionHistory(historyMap)
    } catch (error) {
      console.error("Error fetching question history:", error)
    }
  }

  const fetchStatistics = async () => {
    if (!user) return
    try {
      console.log('[QuizData] Fetching quiz statistics:', {
        userId: user.id
      })
      const stats = await fetchQuizStatistics(user.id)
      console.log('[QuizData] Statistics fetched:', {
        streak: stats.streak,
        daysStudiedThisWeek: stats.daysStudiedThisWeek,
        totalQuestions: stats.totalQuestions,
        averageScore: stats.averageScore
      })
      setStatistics(stats)
    } catch (error) {
      console.error('[QuizData] Error fetching statistics:', {
        error,
        userId: user.id
      })
    }
  }

  const fetchStudySettings = async () => {
    if (!user) return
    try {
      console.log('[QuizData] Fetching study settings:', {
        userId: user.id
      })

      const { data, error } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          console.log('[QuizData] No study settings found for user')
          return
        }
        console.error('[QuizData] Error fetching study settings:', {
          error,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('[QuizData] Study settings fetched:', {
        hasPreferences: !!data?.preferences,
        hasSettings: !!data?.preferences?.settings
      })

      if (data?.preferences?.settings) {
        setStudySettings(data.preferences.settings)
      }
    } catch (error) {
      console.error("Error fetching study settings:", error)
    }
  }

  return {
    quizzes,
    loading,
    studySettings,
    questionHistory,
    statistics,
    setStudySettings,
    fetchQuizzes,
    fetchStatistics,
    setQuizzes,
    fetchQuestionHistory
  }
}
