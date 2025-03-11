import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DeckProgress } from '../DeckProgress'
import { FlashcardDeck } from '@/types/flashcard'

describe('DeckProgress', () => {
  const mockDeck: FlashcardDeck = {
    id: '1',
    userId: 'user1',
    name: 'Test Deck',
    title: 'Test Deck',
    description: 'Test Description',
    cards: [
      { id: '1', front: 'Q1', back: 'A1', confidence: 4 },
      { id: '2', front: 'Q2', back: 'A2', confidence: 3 },
      { id: '3', front: 'Q3', back: 'A3', confidence: 2 },
      { id: '4', front: 'Q4', back: 'A4', confidence: 0 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedCount: 2,
    total_cards: 4,
    pendingOperations: []
  }

  it('shows completion progress for the deck', () => {
    render(<DeckProgress deck={mockDeck} />)
    
    expect(screen.getByText('2 of 4 cards completed')).toBeInTheDocument()
    expect(screen.getByText('Study Progress')).toBeInTheDocument()
  })

  it('shows mastery progress section', () => {
    render(<DeckProgress deck={mockDeck} />)
    
    expect(screen.getByText('Mastery Progress')).toBeInTheDocument()
    
    // Check mastery level counts
    expect(screen.getByText('Expert: 1')).toBeInTheDocument()
    expect(screen.getByText('Proficient: 1')).toBeInTheDocument()
    expect(screen.getByText('Learning: 1')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
  })
})
