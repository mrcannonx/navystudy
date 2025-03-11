import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react"

type Confidence = 'easy' | 'medium' | 'hard'

interface ConfidenceRatingProps {
  onRate: (confidence: Confidence) => void
  className?: string
}

export function ConfidenceRating({ onRate, className }: ConfidenceRatingProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className="text-center text-sm text-muted-foreground">How well did you know this?</p>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400"
          onClick={() => onRate('easy')}
        >
          <ThumbsUp className="h-4 w-4" />
          Easy
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
          onClick={() => onRate('medium')}
        >
          <Minus className="h-4 w-4" />
          Medium
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400"
          onClick={() => onRate('hard')}
        >
          <ThumbsDown className="h-4 w-4" />
          Hard
        </Button>
      </div>
    </div>
  )
} 