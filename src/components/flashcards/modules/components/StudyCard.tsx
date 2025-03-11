"use client"

import { Flashcard } from "@/types/flashcard"
import { ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface StudyCardProps {
    card: Flashcard & { isFlipped?: boolean }
    isFlipped: boolean
    onFlipAction: () => void
    onAnswerAction: (confidence: number) => void
    onNavigate?: (direction: 'previous' | 'next') => void
    canNavigatePrevious?: boolean
    deckTitle?: string
}

export function StudyCard({
    card,
    isFlipped,
    onFlipAction,
    onAnswerAction,
    onNavigate,
    canNavigatePrevious,
    deckTitle
}: StudyCardProps) {

    // Format cloze content if needed
    const formatClozeContent = (content: string) => {
        if (card.type !== 'cloze') return content;
        return isFlipped
            ? content
            : content.replace(/\{\{([^}]+)\}\}/g, (_, p1) => '_'.repeat(p1.length));
    };

    const frontContent = formatClozeContent(card.front);
    const backContent = formatClozeContent(card.back);

    return (
        <div className="study-card-container">
            <div
                className={`study-card ${isFlipped ? 'is-flipped' : ''}`}
                onClick={onFlipAction}
            >
                <div className="study-card__face study-card__face--front">
                    <div className="study-card__content">
                        {deckTitle && (
                            <div className="text-center text-sm text-gray-500 mb-4">
                                {deckTitle}
                            </div>
                        )}
                        {(card.isFlipped && (
                            <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
                                <ArrowLeftRight className="h-4 w-4" />
                            </div>
                        ))}
                        <div className="flex-1 flex justify-center">
                            <h2 className="text-xl font-medium text-left">
                                {frontContent}
                            </h2>
                        </div>
                    </div>
                </div>
                
                <div className="study-card__face study-card__face--back">
                    <div className="study-card__content">
                        {deckTitle && (
                            <div className="text-center text-sm text-gray-500 mb-4">
                                {deckTitle}
                            </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center">
                            <p className="text-xl text-left mb-2">{backContent}</p>
                        </div>
                        <div className="flex justify-between gap-3 w-full">
                            <button
                                className="nav-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate?.('previous');
                                }}
                                disabled={!canNavigatePrevious}
                            >
                                Previous
                            </button>
                            <button
                                className="nav-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Use medium difficulty as default
                                    onAnswerAction(3);
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .study-card-container {
                    perspective: 1000px;
                    padding: 20px;
                    height: 400px;
                    min-width: 600px;
                    width: 100%;
                }

                .study-card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    transform-style: preserve-3d;
                    transition: transform 0.6s;
                }

                .study-card.is-flipped {
                    transform: rotateY(180deg);
                }

                .study-card__face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    background: white;
                    padding: 2rem;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                :global(.dark) .study-card__face {
                    background: #1f2937;
                    border-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
                }

                .study-card__face--front {
                    background: white;
                }

                :global(.dark) .study-card__face--front {
                    background: #1f2937;
                }

                .study-card__face--back {
                    background: white;
                    transform: rotateY(180deg);
                }

                :global(.dark) .study-card__face--back {
                    background: #1f2937;
                }

                .study-card__content {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 1.5rem 0;
                }

                :global(.dark) .study-card__content {
                    color: white;
                }

                .difficulty-btn {
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    color: #1a1a1a;
                    background: white;
                    transition: all 0.2s;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    font-size: 0.875rem;
                }

                :global(.dark) .difficulty-btn {
                    color: white;
                    background: #374151;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .difficulty-btn:hover {
                    transform: translateY(-1px);
                    background: #f8f9fa;
                    border-color: rgba(0, 0, 0, 0.15);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
                }

                :global(.dark) .difficulty-btn:hover {
                    background: #4b5563;
                    border-color: rgba(255, 255, 255, 0.15);
                }

                .difficulty-btn:active {
                    transform: translateY(0);
                    background: #f1f3f5;
                }

                :global(.dark) .difficulty-btn:active {
                    background: #374151;
                }

                /* Selected state styles */
                .difficulty-btn--selected {
                    transform: translateY(-1px);
                    font-weight: 600;
                }

                .difficulty-btn--hard {
                    background: #fee2e2;
                    border-color: #fecaca;
                    color: #b91c1c;
                }

                .difficulty-btn--medium {
                    background: #fef3c7;
                    border-color: #fde68a;
                    color: #b45309;
                }

                .difficulty-btn--easy {
                    background: #d1fae5;
                    border-color: #a7f3d0;
                    color: #047857;
                }

                :global(.dark) .difficulty-btn--hard {
                    background: rgba(220, 38, 38, 0.2);
                    color: #ef4444;
                }

                :global(.dark) .difficulty-btn--medium {
                    background: rgba(245, 158, 11, 0.2);
                    color: #f59e0b;
                }

                :global(.dark) .difficulty-btn--easy {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }

                .nav-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    color: #1a1a1a;
                    background: white;
                    transition: all 0.2s;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    font-size: 0.875rem;
                    flex: 1;
                }

                :global(.dark) .nav-btn {
                    color: white;
                    background: #374151;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .nav-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    background: #f8f9fa;
                    border-color: rgba(0, 0, 0, 0.15);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
                }

                :global(.dark) .nav-btn:hover:not(:disabled) {
                    background: #4b5563;
                    border-color: rgba(255, 255, 255, 0.15);
                }

                .nav-btn:active:not(:disabled) {
                    transform: translateY(0);
                    background: #f1f3f5;
                }

                :global(.dark) .nav-btn:active:not(:disabled) {
                    background: #374151;
                }

                .nav-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                :global(.dark) .nav-btn:disabled {
                    opacity: 0.3;
                }
            `}</style>
        </div>
    )
}
