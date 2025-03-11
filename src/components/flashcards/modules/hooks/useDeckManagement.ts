"use client"

import { useStatistics } from '@/hooks/use-statistics'
import { useDeckFetching } from './useDeckFetching'
import { useStudySession } from './useStudySession'
import { useDeckOperations } from './useDeckManagement.operations'
import { StudyResults } from '@/types/flashcard'

export function useDeckManagement() {
    const { refreshStatistics } = useStatistics()
    const { decks, setDecks, loading, fetchDecks } = useDeckFetching()
    const { handleComplete } = useStudySession()
    const { handleDeleteDeck, handleResetStats } = useDeckOperations()

    return {
        decks,
        loading,
        handleComplete: (deckId: string, results: StudyResults) => 
            handleComplete(deckId, results, decks, setDecks),
        handleDeleteDeck: (deckId: string) => 
            handleDeleteDeck(deckId, setDecks),
        handleResetStats: (deckId: string) => 
            handleResetStats(deckId, setDecks, refreshStatistics)
    };
}