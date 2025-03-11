"use client"

import { useState, useEffect } from "react"
import { ClientButton } from "@/components/ui/client-button"
import { cn } from "@/lib/utils"
import { Star, HelpCircle, Brain, Lightbulb, Eraser, ArrowLeftRight, Activity } from "lucide-react"
import {
  TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FlashcardProps {
  front: string
  back: string
  type?: 'basic' | 'cloze'
  difficulty?: 'easy' | 'medium' | 'hard'
  topics?: string[]
  metadata?: {
    frontLength: number
    backLength: number
    complexityScore?: number
    hasMedia?: boolean
  }
  isFlipped: boolean
  onFlipAction: () => void
  onNextAction?: () => void
  onPreviousAction?: () => void
  onKnownAction?: () => void
  onUnknownAction?: () => void
  showConfidenceRating?: boolean
  onConfidenceRatedAction?: (rating: number) => void
  initialConfidenceRating?: number
  isLastCard?: boolean
}

export function Flashcard({
  front,
  back,
  type = 'basic',
  difficulty,
  topics = [],
  metadata,
  isFlipped,
  onFlipAction,
  onNextAction,
  onPreviousAction,
  onKnownAction,
  onUnknownAction,
  showConfidenceRating = false,
  onConfidenceRatedAction,
  initialConfidenceRating,
  isLastCard = false
}: FlashcardProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [selectedRating, setSelectedRating] = useState<number | null>(initialConfidenceRating || null)

  // Reset card state and update rating when card changes
  useEffect(() => {
    setHoveredRating(null)
    setSelectedRating(initialConfidenceRating || null)
  }, [front, back, initialConfidenceRating])

  const handleConfidenceRating = (rating: number) => {
    setSelectedRating(rating)
    onConfidenceRatedAction?.(rating)
  }

  const formatClozeContent = (content: string) => {
    if (type !== 'cloze') return content
    return isFlipped
      ? content
      : content.replace(/\{\{([^}]+)\}\}/g, (_, p1) => '_'.repeat(p1.length))
  }

  const actualFront = formatClozeContent(front)
  const actualBack = formatClozeContent(back)

  // Confidence rating buttons
  const renderConfidenceButtons = () => {
    if (!isFlipped || !showConfidenceRating) return null;
    
    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        <ClientButton
          variant="outline"
          className={cn(
            "border-red-200 hover:bg-red-50 hover:text-red-700",
            selectedRating === 1 && "bg-red-100 text-red-700"
          )}
          onClick={() => handleConfidenceRating(1)}
        >
          Hard
        </ClientButton>
        <ClientButton
          variant="outline"
          className={cn(
            "border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700",
            selectedRating === 3 && "bg-yellow-100 text-yellow-700"
          )}
          onClick={() => handleConfidenceRating(3)}
        >
          Medium
        </ClientButton>
        <ClientButton
          variant="outline"
          className={cn(
            "border-green-200 hover:bg-green-50 hover:text-green-700",
            selectedRating === 5 && "bg-green-100 text-green-700"
          )}
          onClick={() => handleConfidenceRating(5)}
        >
          Easy
        </ClientButton>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Metadata */}
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          {type && (
            <Badge variant="outline" className="capitalize">
              {type}
            </Badge>
          )}
          {difficulty && (
            <Badge variant="outline" className={cn(
              "capitalize",
              difficulty === 'easy' && "bg-green-500/10 text-green-700 dark:text-green-400",
              difficulty === 'medium' && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
              difficulty === 'hard' && "bg-red-500/10 text-red-700 dark:text-red-400"
            )}>
              {difficulty}
            </Badge>
          )}
          {topics?.map(topic => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Card Content */}
        <div
          className="min-h-[200px] flex items-center justify-center text-lg font-medium text-center cursor-pointer select-none"
          onClick={onFlipAction}
        >
          {isFlipped ? actualBack : actualFront}
        </div>

        {/* Confidence Rating Buttons */}
        {renderConfidenceButtons()}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <ClientButton
            variant="outline"
            onClick={onPreviousAction}
            disabled={!onPreviousAction}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </ClientButton>

          <ClientButton
            variant="outline"
            onClick={onNextAction}
            disabled={!onNextAction || (showConfidenceRating && isFlipped && selectedRating === null)}
          >
            {isLastCard ? 'Finish' : 'Next'}
            {!isLastCard && <ChevronRight className="h-4 w-4 ml-2" />}
          </ClientButton>
        </div>
      </div>
    </Card>
  )
}
