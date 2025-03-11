import Link from "next/link"
import { Brain, Plus, Settings } from "lucide-react"
import { ClientButton } from "@/components/ui/client-button"
import { EnhancedQuizCard } from "@/components/quiz/enhanced-quiz-card"
import { Quiz, QuestionHistory } from "@/components/quiz/modules/types"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth"

interface EnhancedQuizListSectionProps {
  quizzes: Quiz[]
  questionHistory: Record<string, QuestionHistory>
  onStartQuiz: (quiz: Quiz) => Promise<void>
  onDeleteQuiz: (quizId: string) => void
  onResetStats: (quizId: string) => void
  onOpenSettings: () => void
}

interface QuizProgress {
  [key: string]: number // quizId -> completed questions count
}

export function EnhancedQuizListSection({
  quizzes,
  questionHistory,
  onStartQuiz,
  onDeleteQuiz,
  onOpenSettings,
  onResetStats
}: EnhancedQuizListSectionProps) {
  const { user } = useAuth()
  const [sessionProgress, setSessionProgress] = useState<Record<string, number>>({})

  // Fetch cumulative progress data for each quiz
  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) return
      
      const progress: Record<string, number> = {}
      console.log("Fetching cumulative progress data for all quizzes...");
      
      for (const quiz of quizzes) {
        try {
          // Query to get ALL sessions for this quiz to calculate cumulative progress
          const { data: allSessions, error: sessionsError } = await supabase
            .from('user_activities')
            .select('activity_data')
            .eq('user_id', user.id)
            .eq('content_id', quiz.id)
            .eq('content_type', 'quiz')
            .eq('activity_type', 'quiz_completion')
            .order('created_at', { ascending: true })
          
          if (sessionsError) {
            throw sessionsError;
          }
          
          if (allSessions && allSessions.length > 0) {
            // Track unique answered questions across all sessions
            const answeredQuestions = new Set<string>();
            
            // Process each session to find unique answered questions
            allSessions.forEach(session => {
              if (session.activity_data &&
                  session.activity_data.questions &&
                  Array.isArray(session.activity_data.questions)) {
                // Add each question to the set of answered questions
                session.activity_data.questions.forEach((q: any) => {
                  if (q.question) {
                    answeredQuestions.add(q.question);
                  }
                });
              }
            });
            
            // Total unique questions answered is the size of the set
            const uniqueQuestionsAnswered = answeredQuestions.size;
            
            progress[quiz.id] = uniqueQuestionsAnswered;
            console.log(`Calculated progress for quiz ${quiz.id}:`, {
              totalSessions: allSessions.length,
              uniqueQuestionsAnswered,
              totalQuestions: quiz.totalQuestions
            });
          } else {
            console.log(`No session data for quiz ${quiz.id}`);
            progress[quiz.id] = 0;
          }
        } catch (error) {
          console.error(`Error fetching progress data for quiz ${quiz.id}:`, error);
          progress[quiz.id] = 0;
        }
      }
      
      console.log("Quiz progress updated:", progress);
      setSessionProgress(progress);
    }

    fetchProgressData();
    
    // This will re-fetch data whenever quizzes change or question history updates
  }, [quizzes, user, questionHistory])

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center my-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Quizzes</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Create and take interactive quizzes to test your knowledge
          </p>
        </div>
        <div className="flex gap-3">
          <ClientButton
            variant="outline"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Study Settings
          </ClientButton>
          <Link href="/manage">
            <ClientButton className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              Create New Quiz
            </ClientButton>
          </Link>
        </div>
      </div>

      {quizzes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => {
            // Get completed questions from latest session
            const completedQuestions = sessionProgress[quiz.id] || 0
            
            return (
              <EnhancedQuizCard
                key={quiz.id}
                quiz={quiz}
                completedCount={completedQuestions}
                onStartAction={() => onStartQuiz(quiz)}
                onDelete={() => onDeleteQuiz(quiz.id)}
                onResetStats={() => onResetStats(quiz.id)}
                colorIndex={index}
              />
            )
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Quizzes Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Create your first quiz to start testing your knowledge. Quizzes are a powerful way to reinforce learning through active recall.
          </p>
          <Link href="/manage">
            <ClientButton className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              Create Your First Quiz
            </ClientButton>
          </Link>
        </div>
      )}
    </div>
  )
}