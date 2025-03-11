"use client"

import { useState, useEffect, memo } from "react"
import { Trash2, Brain, MoreVertical, Play, Quote, Calendar, BarChart2, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ClientButton } from "@/components/ui/client-button"
import { Quiz } from "@/components/quiz/modules/types"

// List of motivational quotes for learning
const motivationalQuotes = [
  "Never stop learning.",
  "Growth mindset.",
  "Knowledge is power.",
  "Stay curious.",
  "Embrace challenges.",
  "Learn deliberately.",
  "Persist always.",
  "Small steps matter.",
  "Progress daily.",
  "Just keep going."
]

// Color classes for quiz cards
const getColorClass = (index: number) => {
  const colors = [
    {
      accent: "after:bg-blue-500",
      gradient: "quiz-card-gradient-blue",
      border: "border-blue-200 dark:border-blue-800",
      icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
      progress: "bg-blue-500",
      button: "bg-blue-500 hover:bg-blue-600"
    },
    {
      accent: "after:bg-purple-500",
      gradient: "quiz-card-gradient-purple",
      border: "border-purple-200 dark:border-purple-800",
      icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
      progress: "bg-purple-500",
      button: "bg-purple-500 hover:bg-purple-600"
    },
    {
      accent: "after:bg-green-500",
      gradient: "quiz-card-gradient-green",
      border: "border-green-200 dark:border-green-800",
      icon: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
      progress: "bg-green-500",
      button: "bg-green-500 hover:bg-green-600"
    },
    {
      accent: "after:bg-orange-500",
      gradient: "quiz-card-gradient-orange",
      border: "border-orange-200 dark:border-orange-800",
      icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
      progress: "bg-orange-500",
      button: "bg-orange-500 hover:bg-orange-600"
    }
  ];
  
  return colors[index % colors.length];
};

interface EnhancedQuizCardProps {
  quiz: Quiz
  completedCount: number
  onStartAction: () => Promise<void>
  onDelete?: () => void
  onResetStats?: () => void
  colorIndex: number
}

export const EnhancedQuizCard = memo(function EnhancedQuizCard({
  quiz,
  completedCount = 0,
  onStartAction,
  onDelete,
  onResetStats,
  colorIndex
}: EnhancedQuizCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [quote, setQuote] = useState<string>("Believe in yourself.");
  
  // Select a random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    if (onDelete) onDelete();
  };
  
  const handleResetStats = () => {
    setShowResetDialog(false);
    if (onResetStats) onResetStats();
  };

  // Ensure we have a valid question count
  const totalQuestions = quiz.totalQuestions ||
    (quiz.questions && Array.isArray(quiz.questions) ? quiz.questions.length : 0);
  
  const isCompleted = totalQuestions > 0 && completedCount >= totalQuestions;

  // Get color classes based on index
  const colorClass = getColorClass(colorIndex);

  // Format the last updated date
  const lastUpdated = quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : "Recently";

  return (
    <div 
      className={`relative overflow-hidden rounded-lg border shadow-sm hover:shadow transition-all duration-300 hover:translate-y-[-2px] ${colorClass.gradient} ${colorClass.border} after:absolute after:top-0 after:left-0 after:w-full after:h-1 ${colorClass.accent} after:rounded-t-lg`}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${colorClass.icon} shadow-sm`}>
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {quiz.title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Last taken: {lastUpdated}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onResetStats && (
                <DropdownMenuItem 
                  onClick={() => setShowResetDialog(true)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Progress
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Quiz
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description if available */}
        {quiz.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {quiz.description}
          </p>
        )}

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1.5">
            <span className="font-medium">Progress</span>
            <span>{completedCount} of {totalQuestions} Questions</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div 
              className={`h-full ${colorClass.progress} transition-all duration-300`}
              style={{ width: `${totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
          <BarChart2 className="h-4 w-4" />
          <span>
            {isCompleted ? "Completed" : `${Math.round((completedCount / Math.max(totalQuestions, 1)) * 100)}% complete`}
          </span>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Quote className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm italic truncate max-w-[180px]">{quote}</span>
          </div>
          <ClientButton 
            className={`${isCompleted 
              ? "bg-green-500 hover:bg-green-600" 
              : colorClass.button} 
              text-white px-6 py-1.5 rounded-full font-medium text-sm flex items-center gap-1`}
            onClick={onStartAction}
          >
            <Play className="h-3.5 w-3.5" />
            {isCompleted ? "Review" : "Start"}
          </ClientButton>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "{quiz.title}" quiz and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset quiz progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all progress for "{quiz.title}" quiz. Your questions will remain, but all study progress and statistics will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetStats}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Reset Progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
});