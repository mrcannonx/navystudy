"use client"

import { Brain, Sparkles, Clock, RotateCw, Layers } from "lucide-react"

export function FlashcardHero() {
  return (
    <div className="w-full bg-gradient-to-b from-muted/50 to-muted px-8 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Brain className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Active Recall Learning</h2>
              <p className="text-muted-foreground">
                Enhance your understanding through interactive flashcards designed to strengthen your memory and recall abilities.
                Master concepts through spaced repetition and active learning techniques.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium mb-2">Smart Study</h3>
              <p className="text-sm text-muted-foreground">
                AI-generated flashcards that focus on key concepts and important details
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium mb-2">Spaced Repetition</h3>
              <p className="text-sm text-muted-foreground">
                Review cards at optimal intervals to maximize long-term retention
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCw className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium mb-2">Two-Way Learning</h3>
              <p className="text-sm text-muted-foreground">
                Practice both sides of each card to reinforce bidirectional recall
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Layers className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium mb-2">Organized Decks</h3>
              <p className="text-sm text-muted-foreground">
                Group related cards into decks for focused and structured study sessions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 