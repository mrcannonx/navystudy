import { useEffect, useState, useCallback } from 'react'
import { AlertCircle } from 'lucide-react'
import { sounds } from '@/lib/sounds'

interface TimerProps {
  timePerQuestion: number
  totalTimeLimit: number | null
  onQuestionTimeUp: () => void
  onTotalTimeUp: () => void
  isActive: boolean
  soundEffects: boolean
  currentQuestionIndex: number
}

export function Timer({
  timePerQuestion,
  totalTimeLimit,
  onQuestionTimeUp,
  onTotalTimeUp,
  isActive,
  soundEffects,
  currentQuestionIndex
}: TimerProps) {
  const [questionTimeLeft, setQuestionTimeLeft] = useState(timePerQuestion)
  const [totalTimeLeft, setTotalTimeLeft] = useState(totalTimeLimit ? totalTimeLimit * 60 : null)
  const [showWarning, setShowWarning] = useState(false)

  // Reset timer when moving to a new question or when isActive changes
  useEffect(() => {
    if (isActive) {
      setQuestionTimeLeft(timePerQuestion)
      setShowWarning(false)
    }
  }, [isActive, timePerQuestion, currentQuestionIndex])

  // Reset total timer only when quiz starts/restarts
  useEffect(() => {
    if (isActive && currentQuestionIndex === 0) {
      setTotalTimeLeft(totalTimeLimit ? totalTimeLimit * 60 : null)
    }
  }, [isActive, totalTimeLimit, currentQuestionIndex])

  // Timer logic
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      // Update question timer
      setQuestionTimeLeft((prev) => {
        if (prev <= 0) return 0
        
        // Show warning when 10 seconds remaining
        if (prev === 10) {
          setShowWarning(true)
          if (soundEffects) {
            sounds.warning()
          }
        }
        
        // Time's up for question
        if (prev === 1) {
          onQuestionTimeUp()
          if (soundEffects) {
            sounds.timeUp()
          }
        }
        
        return prev - 1
      })

      // Update total timer if set
      if (totalTimeLeft !== null) {
        setTotalTimeLeft((prev) => {
          if (prev === null) return null
          if (prev <= 0) return 0
          
          // Show warning when 60 seconds remaining on total time
          if (prev === 60) {
            if (soundEffects) {
              sounds.warning()
            }
          }
          
          // Total time's up
          if (prev === 1) {
            onTotalTimeUp()
            if (soundEffects) {
              sounds.timeUp()
            }
          }
          
          return prev - 1
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onQuestionTimeUp, onTotalTimeUp, totalTimeLeft, soundEffects])

  // Format time for display
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className="flex items-center gap-4">
      {/* Question Timer */}
      <div className={`flex items-center gap-2 ${showWarning ? 'text-red-500' : ''}`}>
        <span className="text-sm font-medium">Question Time:</span>
        <span className="font-mono">{formatTime(questionTimeLeft)}</span>
        {showWarning && (
          <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
        )}
      </div>

      {/* Total Timer (if enabled) */}
      {totalTimeLeft !== null && (
        <div className={`flex items-center gap-2 ${totalTimeLeft <= 60 ? 'text-red-500' : ''}`}>
          <span className="text-sm font-medium">Total Time:</span>
          <span className="font-mono">{formatTime(totalTimeLeft)}</span>
          {totalTimeLeft <= 60 && (
            <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
          )}
        </div>
      )}
    </div>
  )
} 