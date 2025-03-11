import { useState, useRef, useEffect } from "react"
import { Flashcard } from "@/components/flashcards/flashcard"
import { FlashcardCompletionClient } from "@/components/flashcards/flashcard-completion-client"
import { FlashcardDeck, StudySettings } from "../types"

interface DeckStudySectionProps {
    currentDeck: FlashcardDeck
    currentCardIndex: number
    isCompleted: boolean
    studySettings: StudySettings
    deckConfidenceRatings: Record<string, number>
    onNext: () => void
    onPrevious: () => void
    onConfidenceRated: (rating: number) => void
    onCompleteAction: () => Promise<void>
    onRetryAction: () => Promise<void>
    onBackToDeckAction: () => Promise<void>
}

export function DeckStudySection({
    currentDeck,
    currentCardIndex,
    isCompleted,
    studySettings,
    deckConfidenceRatings,
    onNext,
    onPrevious,
    onConfidenceRated,
    onCompleteAction,
    onRetryAction,
    onBackToDeckAction
}: DeckStudySectionProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const sessionStartTime = useRef(Date.now())
    const [timeSpent, setTimeSpent] = useState(0)
    
    // Track study time
    useEffect(() => {
        if (!isCompleted) return
        
        const endTime = Date.now()
        const sessionTime = Math.floor((endTime - sessionStartTime.current) / 1000)
        setTimeSpent(sessionTime)
    }, [isCompleted])
    
    // Only access currentCard if we're not in completed state to prevent errors
    const currentCard = !isCompleted ? currentDeck.cards[currentCardIndex] : null
    const isLastCard = !isCompleted ? currentCardIndex === currentDeck.cards.length - 1 : false

    if (isCompleted) {
        return <FlashcardCompletionClient 
            onCompleteAction={onCompleteAction}
            onRetryAction={onRetryAction}
            onBackToDeckAction={onBackToDeckAction}
            statistics={{
                cardsStudied: currentDeck.cards.length,
                timeSpent: timeSpent
            }}
        />
    }

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleNext = () => {
        onNext()
        setIsFlipped(false)
    }

    return (
        <div className="space-y-4">
            {currentCard && (
                <Flashcard
                    front={currentCard.front}
                    back={currentCard.back}
                    type={currentCard.type}
                    onNextAction={handleNext}
                    onPreviousAction={onPrevious}
                    showConfidenceRating={false}
                    onConfidenceRatedAction={onConfidenceRated}
                    initialConfidenceRating={deckConfidenceRatings[currentCard.id]}
                    isLastCard={isLastCard}
                    isFlipped={isFlipped}
                    onFlipAction={handleFlip}
                />
            )}
        </div>
    )
}
