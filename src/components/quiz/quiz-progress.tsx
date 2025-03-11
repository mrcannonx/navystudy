import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface QuizProgressProps {
  currentQuestion: number
  totalQuestions: number
  title: string
  onExit: () => void
  isNavigating?: boolean
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  title,
  onExit,
  isNavigating
}: QuizProgressProps) {
  // Show progress based on total questions answered
  // Ensure the progress percentage is 0 when no questions are answered
  const progressPercentage = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0

  return (
    <>
      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-t-lg overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="sm" onClick={onExit} disabled={isNavigating}>
          Exit Quiz
        </Button>
      </div>

      <CardHeader className="pt-8">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
    </>
  )
}
