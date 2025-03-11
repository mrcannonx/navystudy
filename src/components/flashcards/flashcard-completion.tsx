"use client"

import { ClientButton } from "@/components/ui/client-button"

interface FlashcardCompletionProps {
  deckTitle: string
  totalCards: number
  onRestartAction: () => Promise<void>
  onBackToDeckAction: () => Promise<void>
}

export function FlashcardCompletion({
  deckTitle,
  totalCards,
  onRestartAction,
  onBackToDeckAction,
}: FlashcardCompletionProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-card rounded-xl shadow-lg text-center">
      <div className="mb-8">
        <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
          <svg
            className="w-12 h-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Deck Completed!</h2>
        <p className="text-muted-foreground">
          You&apos;ve completed all {totalCards} cards in &quot;{deckTitle}&quot;
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <ClientButton
            variant="default"
            onClick={async () => {
              try {
                await onRestartAction()
              } catch (err) {
                console.error("Error restarting deck:", err)
              }
            }}
            className="flex-1 max-w-[200px] mx-auto"
          >
            Study Again
          </ClientButton>
          <ClientButton
            variant="outline"
            onClick={async () => {
              try {
                await onBackToDeckAction()
              } catch (err) {
                console.error("Error returning to deck:", err)
              }
            }}
            className="flex-1 max-w-[200px] mx-auto"
          >
            Back to Decks
          </ClientButton>
        </div>
      </div>
    </div>
  )
}
