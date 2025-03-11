"use client"

import { Trash2, CheckCircle2, Brain, MoreVertical, Play, Quote } from "lucide-react"
import { startQuizAction } from "@/components/quiz/actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClientButton } from "@/components/ui/client-button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface QuizCardProps {
  title: string
  description: string
  questionCount: number
  completedCount?: number
  onStartAction: () => Promise<void>
  onDelete?: () => void
  onResetStats?: () => void
}

export function QuizCard({
  title,
  description,
  questionCount,
  completedCount = 0,
  onStartAction,
  onDelete,
  onResetStats,
}: QuizCardProps) {
  // Ensure we always have a valid questionCount
  const actualQuestionCount = questionCount || 0;
  const isCompleted = actualQuestionCount > 0 && completedCount >= actualQuestionCount;
  
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
  ];
  
  // State to store the selected quote
  const [quote, setQuote] = useState<string>("Believe in yourself.");
  
  // Select a random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <Brain className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {description}
              </p>
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
                <DropdownMenuItem onClick={onResetStats}>
                  Reset Stats
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-red-600 dark:text-red-400"
                >
                  Delete Quiz
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">
            {completedCount} of {actualQuestionCount} Questions Completed
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${actualQuestionCount > 0 ? (completedCount / actualQuestionCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Quote className="h-4 w-4 mr-2" />
            <span className="text-sm italic">{quote}</span>
          </div>
          <ClientButton 
            className={`${isCompleted 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-blue-500 hover:bg-blue-600"} 
              text-white px-6 py-1.5 rounded-full font-medium text-sm flex items-center gap-1`}
            onClick={onStartAction}
          >
            <Play className="h-3.5 w-3.5" />
            {isCompleted ? "Review" : "Start"}
          </ClientButton>
        </div>
      </div>
    </div>
  )
}
