"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { useAuth } from "@/contexts/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClientLink } from "@/components/ui/client-link"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ClientLoadingState } from "@/components/ui/client-loading-state"
import { EnhancedHeroSection } from "./enhanced-hero-section"
import { EnhancedQuizListSection } from "./enhanced-quiz-list-section"
import { SettingsDialog } from "./settings-dialog"
import { useQuizData } from "./modules/use-quiz-data"
import { Quiz } from "./modules/types"
import QuizInterfaceClient from "./quiz-interface-client"
import { QuizSettingsProvider } from "@/contexts/quiz-settings-context"
import { handleQuizCompletion } from "./modules/quiz-completion-handler"
import { deleteQuiz, resetQuizStats } from "./modules/quiz-operations"
import { handleQuizExitAction } from "@/app/quiz/actions"

// Inner component that uses the context
function EnhancedQuizPageInner() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  
  const {
    quizzes,
    loading,
    questionHistory,
    statistics,
    fetchQuizzes,
    fetchStatistics,
    setQuizzes,
    fetchQuestionHistory
  } = useQuizData()

  // Check for quiz ID in URL parameters on load
  useMemo(() => {
    if (typeof window !== 'undefined' && quizzes.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const quizId = params.get('id');
      
      if (quizId) {
        const foundQuiz = quizzes.find(quiz => quiz.id === quizId);
        if (foundQuiz) {
          console.log('Found quiz from URL parameter:', foundQuiz.title);
          setActiveQuiz(foundQuiz);
        }
      }
    }
  }, [quizzes]);

  const handleQuizComplete = useCallback(async (
    quiz: Quiz, 
    score: number, 
    questionResults: Array<{questionId: string, correct: boolean}>,
    timeSpent: number,
    totalQuestions: number
  ) => {
    try {
      if (!user) return

      await handleQuizCompletion(
        user,
        quiz,
        score,
        questionResults,
        timeSpent,
        totalQuestions
      )

      // Log question history update
      questionResults.forEach((result) => {
        console.log('Question history updated:', { 
          questionId: result.questionId, 
          correct: result.correct 
        })
      })

      // Update statistics
      await fetchStatistics()

      // Show success message
      toast({
        title: "Success",
        description: "Quiz completed successfully",
      })

      // Reset active quiz
      setActiveQuiz(null)
    } catch (error) {
      console.error('Error in handleQuizComplete:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      })
    }
  }, [user, toast, fetchStatistics]);

  const handleQuizExit = useCallback(async () => {
    try {
      const result = await handleQuizExitAction()
      if (result.success) {
        setActiveQuiz(null)
      }
    } catch (err) {
      console.error("Error exiting quiz:", err)
      // Still exit even if the server action fails
      setActiveQuiz(null)
    }
  }, []);

  const handleResetStats = useCallback(async (quizId: string) => {
    try {
      if (!user) return

      console.log("Resetting stats for quiz:", quizId);
      await resetQuizStats(user.id, quizId);
      
      // Re-fetch all data to update UI
      await fetchQuizzes();
      await fetchQuestionHistory();
      await fetchStatistics();
      
      // Force reset the progress for this quiz in the UI
      setQuizzes(prevQuizzes => {
        return prevQuizzes.map(quiz => {
          if (quiz.id === quizId) {
            // Create a new quiz object with the same properties
            // but with completedCount reset to 0 if applicable
            return { ...quiz };
          }
          return quiz;
        });
      });
      
      toast({
        title: "Success",
        description: "Quiz statistics reset successfully",
        variant: "default",
      });
    } catch (err) {
      console.error("Error resetting quiz stats:", err);
      toast({
        title: "Error",
        description: "Failed to reset quiz statistics",
        variant: "destructive",
      });
    }
  }, [user, fetchQuizzes, fetchQuestionHistory, fetchStatistics, setQuizzes, toast]);

  const handleDeleteQuiz = useCallback(async (quizId: string) => {
    try {
      if (!user) return

      await deleteQuiz(user.id, quizId)
      
      setQuizzes((prevQuizzes: Quiz[]) => prevQuizzes.filter((quiz: Quiz) => quiz.id !== quizId))
      toast({
        title: "Success",
        description: "Quiz deleted successfully",
        variant: "default",
      })
    } catch (err) {
      console.error("Error deleting quiz:", err)
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive",
      })
    }
  }, [user, setQuizzes, toast]);

  // Authentication check
  const authContent = useMemo(() => {
    if (!user && !authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-gray-500 dark:text-gray-400">Please sign in to access your quizzes</p>
            <Link href="/auth" className="inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
            </Link>
          </div>
        </div>
      );
    }
    return null;
  }, [user, authLoading]);

  // Loading state
  const loadingContent = useMemo(() => {
    if ((authLoading && !user) || (loading && !user)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <ClientLoadingState />
        </div>
      );
    }
    return null;
  }, [authLoading, loading, user]);

  // If we're in auth or loading states, show those
  if (authContent) return authContent;
  if (loadingContent) return loadingContent;

  // Quiz interface (when a quiz is selected)
  if (activeQuiz) {
    return (
      <QuizSettingsProvider>
        <QuizInterfaceClient
          quizId={activeQuiz.id}
        />
      </QuizSettingsProvider>
    );
  }

  // Main quiz list view
  return (
    <div ref={containerRef} className="pb-16">
      {/* Hero Section - Full Width */}
      <div className="w-full -mt-1">
        <EnhancedHeroSection />
      </div>

      <QuizSettingsProvider>
        <div className="container max-w-7xl mx-auto px-4 mt-10">
          {/* Quizzes Section */}
          <EnhancedQuizListSection
            quizzes={quizzes}
            questionHistory={questionHistory}
            onStartQuiz={async (quiz) => {
              setActiveQuiz(quiz)
              return Promise.resolve()
            }}
            onDeleteQuiz={handleDeleteQuiz}
            onOpenSettings={() => setShowSettings(true)}
            onResetStats={handleResetStats}
          />

          <SettingsDialog
            open={showSettings}
            onOpenChange={setShowSettings}
          />
        </div>
      </QuizSettingsProvider>
    </div>
  );
}

// This is a fixed version of the QuizPageClient that avoids the
// "Expected static flag was missing" error by using useMemo everywhere
export function EnhancedQuizPageClient() {
  return (
    <QuizSettingsProvider>
      <EnhancedQuizPageInner />
    </QuizSettingsProvider>
  );
}