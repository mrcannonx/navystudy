import { ClientButton } from "@/components/ui/client-button"
import { getFontSizeClasses } from "@/lib/utils"
import { exportQuizResults } from "@/lib/quiz-export"
import { Download, RotateCcw, ArrowLeft } from "lucide-react"
import { useMemo } from "react"
import confetti from "canvas-confetti"

const motivationalQuotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

interface QuizCompletionProps {
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
  onRetry: () => void
  onExit: () => void
  isNavigating?: boolean
  settings?: {
    fontSize: 'small' | 'medium' | 'large'
    allowExport: boolean
    showExplanations: boolean
  }
}

export function QuizCompletion({
  title,
  score,
  totalQuestions,
  answers,
  timeSpent,
  questions,
  onRetry,
  onExit,
  settings,
  isNavigating
}: QuizCompletionProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const fontSizeClasses = getFontSizeClasses(settings?.fontSize || 'medium')

  const randomEmoji = useMemo(() => {
    const emojis = ['🎉', '🌟', '🎯', '🏆', '💫', '⭐️', '🌈', '🚀'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }, []);

  const randomQuote = useMemo(() => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  }, []);

  const handleExport = () => {
    const results = questions.map((q, index) => ({
      questionId: q.id,
      correct: answers[index],
      question: q.question,
      selectedAnswer: q.selectedAnswer,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }))
    
    exportQuizResults(title, score, totalQuestions, timeSpent, results)
  }

  // Trigger confetti effect on mount
  useMemo(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="flex items-center justify-center p-6">
      <div className="text-center space-y-3 max-w-md w-full bg-white dark:bg-gray-800 p-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="text-6xl animate-bounce">{randomEmoji}</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quiz Complete!
            </h1>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {title}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-2">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {totalQuestions - score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect Answers</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 dark:bg-blue-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <p className={`${fontSizeClasses.explanation} text-center mt-4 text-gray-700 dark:text-gray-300`}>
              {percentage >= 80
                ? "Excellent work! You've mastered this topic."
                : percentage >= 60
                ? "Good job! Keep practicing to improve further."
                : "Keep practicing! You'll get better with time."}
            </p>
          </div>

          {/* Quote */}
          <div className="max-w-md mx-auto">
            <p className="text-lg italic text-gray-700 dark:text-gray-300">"{randomQuote.text}"</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">- {randomQuote.author}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4">
            <ClientButton
              action={onRetry}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Review Again
            </ClientButton>
            <ClientButton
              action={onExit}
              disabled={isNavigating}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quizzes
            </ClientButton>
            {settings?.allowExport && (
              <ClientButton
                variant="outline"
                action={handleExport}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Results
              </ClientButton>
            )}
          </div>
        </div>
    </div>
  )
}
