"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { useAuth } from "@/contexts/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClientLink } from "@/components/ui/client-link"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ClientLoadingState } from "@/components/ui/client-loading-state"
import { FlashcardDeck, StudySettings, DEFAULT_STUDY_SETTINGS } from "@/types/flashcard"
import { StudyInterface } from "./modules/components/study-interface/StudyInterface"
import { useDeckManagement } from "./modules/hooks/useDeckManagement"
import { HeroSection } from "./modules/components/HeroSection"
import { DeckGrid } from "./modules/components/DeckGrid"

// Inner component that uses the context
function FlashcardsPageInner() {
    const { user, loading: authLoading } = useAuth()
    const { toast } = useToast()
    const containerRef = useRef<HTMLDivElement>(null)
    const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null)
    
    // Use default settings instead of context
    const settings = DEFAULT_STUDY_SETTINGS;
    const settingsLoading = false;

    const {
        decks,
        loading,
        handleComplete,
        handleDeleteDeck,
        handleResetStats
    } = useDeckManagement()

    // Memoize this handler to prevent recreation
    const handleStartStudying = useCallback((deck: FlashcardDeck) => {
        console.log('Starting study session for deck:', {
            id: deck.id,
            name: deck.name,
            cardCount: deck.cards.length
        });
        
        // Create a fresh copy of the deck to ensure we start with a clean state
        const freshDeck: FlashcardDeck = structuredClone(deck);
        
        setSelectedDeck(freshDeck);
    }, []);

    // Memoize this handler to prevent recreation - this will be called when user clicks "Study Again"
    const handleStudyAgain = useCallback(() => {
        try {
            console.log('Restarting study session by user request...');
            if (selectedDeck) {
                // Create a fresh copy of the deck to ensure we start with a clean state
                const freshDeck: FlashcardDeck = structuredClone(selectedDeck);
                
                // Reset the selected deck to trigger a fresh study session
                setSelectedDeck(null);
                
                // Add a small delay before setting the new deck to ensure the component fully unmounts
                // This is necessary to properly reset the study session state
                setTimeout(() => {
                    console.log('FLASHCARD-LOG: Setting fresh deck after delay');
                    setSelectedDeck(freshDeck);
                }, 50);
            }
        } catch (error) {
            console.error('Error restarting study session:', error);
            // Ignore auth-related errors since they don't affect functionality
            if (error instanceof Error && !error.message.includes('auth')) {
                toast({
                    title: "Error restarting session",
                    description: "There was a problem restarting the study session. Please try going back to deck and starting again.",
                    variant: "destructive",
                });
            }
        }
    }, [selectedDeck, toast]);

    // Memoize this handler to prevent recreation
    const handleBackToDeck = useCallback(() => {
        console.log('Going back to deck list...');
        setSelectedDeck(null);
    }, []);

    // Use fixed components with useMemo for all renders
    
    // Authentication check
    const authContent = useMemo(() => {
        if (!user && !authLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold">Access Denied</h1>
                        <p className="text-gray-500">Please sign in to access flashcards</p>
                        <Link href="/auth" className="inline-block">
                            <Button>Sign In</Button>
                        </Link>
                    </div>
                </div>
            );
        }
        return null;
    }, [user, authLoading]);

    // Loading state
    const loadingContent = useMemo(() => {
        if ((authLoading && !user) || (loading && !user) || (settingsLoading && !user)) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <ClientLoadingState />
                </div>
            );
        }
        return null;
    }, [authLoading, loading, settingsLoading, user]);

    // If we're in auth or loading states, show those
    if (authContent) return authContent;
    if (loadingContent) return loadingContent;

    // Study interface (when a deck is selected)
    if (selectedDeck) {
        // Ensure settings is not undefined before rendering StudyInterface
        if (!settings) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <ClientLoadingState />
                </div>
            );
        }
        
        // Create a simple key for the study interface
        const studyKey = `study-${selectedDeck.id}`;
            
        console.log("FLASHCARD-PAGE-LOG: Rendering StudyInterface with key:", studyKey);
        
        return (
            <StudyInterface
                key={studyKey}
                deck={selectedDeck}
                onCompleteAction={handleComplete}
                onExitAction={handleBackToDeck}
                studySettings={settings}
                onStudyAgainAction={handleStudyAgain}
            />
        );
    }

    // Main deck list view
    return (
        <div ref={containerRef}>
            {/* Hero Section */}
            <HeroSection />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Decks Section */}
                <div className="py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">Your Flashcard Decks</h2>
                            <p className="text-gray-500 dark:text-gray-400">Create and study your flashcard collections</p>
                        </div>
                        <div className="flex gap-3">
                            <ClientLink
                                href="/manage"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Create New Deck
                            </ClientLink>
                        </div>
                    </div>

                    <DeckGrid
                        decks={decks}
                        onStartStudying={handleStartStudying}
                        onDelete={handleDeleteDeck}
                        onResetStats={handleResetStats}
                    />
                </div>
            </div>
        </div>
    );
}

// This is a fixed version of the FlashcardsPageClient that avoids the
// "Expected static flag was missing" error by using useMemo everywhere
export function FlashcardsPageClient() {
    return <FlashcardsPageInner />;
}
