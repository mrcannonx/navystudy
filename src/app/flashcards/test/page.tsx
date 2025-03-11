"use client"

import { useState } from 'react'
import { FlashcardDeck, DEFAULT_STUDY_SETTINGS } from '@/types/flashcard'
import { StudyInterface } from '@/components/flashcards/modules/components/study-interface/StudyInterface'
import { Button } from '@/components/ui/button'

// Sample flashcard deck for testing
const sampleDeck: FlashcardDeck = {
  id: 'test-deck-1',
  userId: 'test-user',
  name: 'Test Flashcard Deck',
  title: 'Sample Flashcards',
  description: 'A sample deck for testing the flashcard system',
  cards: [
    {
      id: 'card-1',
      front: 'What is the capital of France?',
      back: 'Paris',
      confidence: 0,
      type: 'basic',
      difficulty: 'easy',
      topics: ['Geography', 'Europe']
    },
    {
      id: 'card-2',
      front: 'What is the largest planet in our solar system?',
      back: 'Jupiter',
      confidence: 0,
      type: 'basic',
      difficulty: 'medium',
      topics: ['Astronomy', 'Science']
    },
    {
      id: 'card-3',
      front: 'In JavaScript, {{null}} is equal to {{undefined}} when using == (loose equality)',
      back: 'In JavaScript, null is equal to undefined when using == (loose equality)',
      confidence: 0,
      type: 'cloze',
      difficulty: 'hard',
      topics: ['Programming', 'JavaScript']
    },
    {
      id: 'card-4',
      front: 'What is the chemical symbol for gold?',
      back: 'Au (Aurum)',
      confidence: 0,
      type: 'basic',
      difficulty: 'medium',
      topics: ['Chemistry', 'Elements']
    },
    {
      id: 'card-5',
      front: 'Who wrote "Romeo and Juliet"?',
      back: 'William Shakespeare',
      confidence: 0,
      type: 'basic',
      difficulty: 'easy',
      topics: ['Literature', 'History']
    }
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  pendingOperations: [],
  total_cards: 5,
  mastered_cards: 0,
  completedCount: 0,
  currentCycle: 1
}

export default function FlashcardTestPage() {
  const [showStudyInterface, setShowStudyInterface] = useState(false)
  const [studyCompleted, setStudyCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleComplete = (deckId: string, results: any) => {
    console.log('Study completed:', { deckId, results })
    setResults(results)
    setStudyCompleted(true)
  }

  const handleStudyAgain = () => {
    setStudyCompleted(false)
    setShowStudyInterface(true)
  }

  const handleBackToDeck = () => {
    setShowStudyInterface(false)
    setStudyCompleted(false)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Flashcard System Test</h1>
      
      {!showStudyInterface ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{sampleDeck.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{sampleDeck.description}</p>
            <p className="mb-4">Cards: {sampleDeck.cards.length}</p>
            <Button onClick={() => setShowStudyInterface(true)}>
              Start Studying
            </Button>
          </div>

          {studyCompleted && results && (
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-400">Study Session Completed</h2>
              <p className="mb-2">Cards studied: {results.totalAnswers}</p>
              <p className="mb-4">Correct answers: {results.correctAnswers}</p>
              <Button variant="outline" onClick={handleStudyAgain} className="mr-2">
                Study Again
              </Button>
            </div>
          )}
        </div>
      ) : (
        <StudyInterface
          deck={sampleDeck}
          onCompleteAction={handleComplete}
          onExitAction={handleBackToDeck}
          onStudyAgainAction={handleStudyAgain}
          studySettings={DEFAULT_STUDY_SETTINGS}
        />
      )}
    </div>
  )
}