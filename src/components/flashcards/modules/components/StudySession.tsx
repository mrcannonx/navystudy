import { useState } from "react"
import { ClientButton } from "@/components/ui/client-button"
import { Card } from "@/components/ui/card"
import { FlashcardDeck, StudySettings } from "../types"
import { useFlashcardState } from "../hooks/useFlashcardState"
import { Flashcard } from "@/components/flashcards/flashcard"

interface StudySessionProps {
  deck: FlashcardDeck
  settings: StudySettings
  onConfidenceRated: (cardId: string, rating: number) => void
  onComplete: () => void
  onExit: () => void
}

export function StudySession({
  deck,
  settings,
  onConfidenceRated,
  onComplete,
  onExit,
}: StudySessionProps) {
  const { currentCardIndex, setCurrentCardIndex } = useFlashcardState()
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      onComplete()
    }
  }

  const handleConfidenceRating = (rating: number) => {
    onConfidenceRated(deck.cards[currentCardIndex].id, rating)
    handleNext()
  }

  const currentCard = deck.cards[currentCardIndex]
  const isLastCard = currentCardIndex === deck.cards.length - 1

  return (
    <div className="space-y-6">
      <Flashcard
        front={currentCard.front}
        back={currentCard.back}
        type={currentCard.type}
        difficulty={currentCard.difficulty}
        topics={currentCard.topics || []}
        isFlipped={isFlipped}
        onFlipAction={() => setIsFlipped(!isFlipped)}
        onNextAction={handleNext}
        onPreviousAction={currentCardIndex > 0 ? () => setCurrentCardIndex(currentCardIndex - 1) : undefined}
        showConfidenceRating={false}
        onConfidenceRatedAction={handleConfidenceRating}
        isLastCard={isLastCard}
      />

      <ClientButton variant="outline" onClick={onExit} className="w-full">
        Exit Session
      </ClientButton>
    </div>
  )
}
