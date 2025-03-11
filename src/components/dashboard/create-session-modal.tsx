"use client"

import { useState } from "react"
import { BookOpen, Brain, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CreateSessionModalProps {
  onCreateSession: (type: 'quiz' | 'flashcards', duration: number) => Promise<void>
  existingSessionTypes?: ('quiz' | 'flashcards')[]
  isOpen: boolean
  onClose: () => void
}

export function CreateSessionModal({ 
  onCreateSession,
  existingSessionTypes = [],
  isOpen,
  onClose
}: CreateSessionModalProps) {
  const [sessionType, setSessionType] = useState<'quiz' | 'flashcards'>('quiz')
  const [duration, setDuration] = useState(30)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await onCreateSession(sessionType, duration)
      setSessionType('quiz')
      setDuration(30)
    } catch (error) {
      console.error('Failed to create session:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Study Session</DialogTitle>
          <DialogDescription>
            Choose the type of study session and set its duration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Session Type</Label>
            <RadioGroup 
              value={sessionType} 
              onValueChange={(value: 'quiz' | 'flashcards') => setSessionType(value)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="quiz"
                  id="quiz"
                  disabled={existingSessionTypes.includes('quiz')}
                  className="peer sr-only"
                />
                <Label
                  htmlFor="quiz"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Brain className="mb-2 h-6 w-6" />
                  Quiz
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="flashcards"
                  id="flashcards"
                  disabled={existingSessionTypes.includes('flashcards')}
                  className="peer sr-only"
                />
                <Label
                  htmlFor="flashcards"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <BookOpen className="mb-2 h-6 w-6" />
                  Flashcards
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={5}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Plus className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Session
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}