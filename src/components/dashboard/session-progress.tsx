"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play, Pause, StopCircle, RotateCcw } from "lucide-react"
import { formatDistance } from "date-fns"

interface SessionProgressProps {
  sessionId: string
  contentType: 'quiz' | 'flashcards'
  duration: number
  elapsedSeconds: number
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onRestart: () => void
}

export function SessionProgress({
  sessionId,
  contentType,
  duration,
  elapsedSeconds,
  isPaused,
  onPause,
  onResume,
  onStop,
  onRestart
}: SessionProgressProps) {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const totalSeconds = duration * 60
    const progressPercentage = (elapsedSeconds / totalSeconds) * 100
    setProgress(Math.min(progressPercentage, 100))

    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)
    const now = new Date()
    const future = new Date(now.getTime() + (remainingSeconds * 1000))
    setTimeLeft(formatDistance(future, now))
  }, [duration, elapsedSeconds])

  return (
    <Card className="p-4 bg-white dark:bg-gray-900">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Active {contentType === 'quiz' ? 'Quiz' : 'Flashcard'} Session
            </h3>
            <p className="text-sm text-muted-foreground">
              {timeLeft} remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isPaused ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onResume}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onPause}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onStop}
            >
              <StopCircle className="h-4 w-4 mr-2" />
              End
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRestart}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Session Details:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Duration: {duration} minutes</li>
            <li>Elapsed Time: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s</li>
            <li>Status: {isPaused ? 'Paused' : 'In Progress'}</li>
          </ul>
        </div>
      </div>
    </Card>
  )
} 