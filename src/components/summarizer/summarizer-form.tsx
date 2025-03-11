"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { summarizeText } from "./summarizer-utils"
import { Sparkles, Eraser, List, Zap, HelpCircle, Loader2 } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { FORMAT_OPTIONS, VALIDATION_CONSTANTS } from "./summarizer-constants"
import { useSummarizerState } from "@/hooks/use-summarizer-state"
import { ProgressIndicator } from "./progress-indicator"
import { SummaryResult } from "./summary-result"

type OutputFormat = "bullets" | "tldr" | "qa";

const formatDescriptions = {
  bullets: "Converts text into clear, concise bullet points. Best for lists of facts, features, or sequential information.",
  tldr: "Creates a brief overview followed by key points. Perfect for quick understanding of long content.",
  qa: "Transforms content into a Q&A format. Ideal for understanding complex topics through questions and answers."
};

const formatOptions = {
  bullets: { icon: List, label: "Bullet Points" },
  tldr: { icon: Zap, label: "TL;DR" },
  qa: { icon: HelpCircle, label: "Q&A" }
} as const;

export function SummarizerForm() {
  const { state, validation, actions } = useSummarizerState();

  return (
    <TooltipProvider>
      <form onSubmit={(e) => { e.preventDefault(); actions.processSummary(); }} className="space-y-6">
        <div className="space-y-4">
          {/* Format Selection - Enhanced for mobile */}
          <div className="flex justify-center overflow-x-auto pb-2 md:pb-0">
            <ToggleGroup 
              type="single" 
              value={state.format}
              onValueChange={actions.updateFormat}
              className="bg-muted dark:bg-gray-800 p-1 rounded-lg flex-nowrap"
            >
              {Object.entries(FORMAT_OPTIONS).map(([value, { icon: Icon, label, description }]) => (
                <TooltipRoot key={value}>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={value}
                      aria-label={label}
                      disabled={state.formatLoadingStates[value as keyof typeof FORMAT_OPTIONS]}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-md whitespace-nowrap transition-all
                        hover:bg-gray-200 dark:hover:bg-gray-700
                        aria-checked:bg-primary aria-checked:text-primary-foreground
                        aria-checked:hover:bg-primary/90
                        disabled:opacity-50 disabled:cursor-not-allowed
                        min-w-[100px] md:min-w-[120px]
                      `}
                    >
                      {state.formatLoadingStates[value as keyof typeof FORMAT_OPTIONS] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      <span className="hidden md:inline">{label}</span>
                      <span className="md:hidden">{label.split(' ')[0]}</span>
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[250px] text-center">
                    {description}
                  </TooltipContent>
                </TooltipRoot>
              ))}
            </ToggleGroup>
          </div>

          {/* Text Input Area */}
          <div className="relative">
            <Textarea
              placeholder="Paste your text here and select a format: Bullet Points for organized lists, TL;DR for quick summaries, or Q&A for structured breakdowns..."
              className={`
                min-h-[200px] resize-y w-full p-4
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                rounded-lg focus:ring-2 focus:ring-primary
                transition-colors
                ${validation.isTextTooLong ? 'border-red-500 focus:ring-red-500' : ''}
                ${validation.isTextTooShort ? 'border-yellow-500 focus:ring-yellow-500' : ''}
              `}
              value={state.text}
              onChange={(e) => actions.updateText(e.target.value)}
              maxLength={validation.maxChars + 100} // Allow slight overflow for better UX
            />
            
            {/* Character count and validation messages */}
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/90 dark:bg-gray-900/90 px-2 py-1 rounded">
              {state.wordCount} words | {state.characterCount} / {validation.maxChars} chars
            </div>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            isProcessing={state.isProcessing}
          />

          {/* Validation Messages */}
          {validation.isTextTooLong && (
            <p className="text-sm text-red-500">
              Text exceeds maximum length of {validation.maxChars} characters
            </p>
          )}
          {validation.isTextTooShort && (
            <p className="text-sm text-yellow-500">
              Text should be at least {validation.minChars} characters long
            </p>
          )}
          {state.error && (
            <p className="text-sm text-red-500">
              {state.error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 order-2 md:order-1">
              <Button 
                type="button"
                variant="outline"
                disabled={!state.text.trim() || state.isProcessing}
                onClick={actions.clearState}
                className="relative inline-flex items-center px-4 py-2 overflow-hidden transition-all duration-300 
                          hover:bg-muted/80 dark:hover:bg-gray-700 hover:scale-105
                          disabled:opacity-50 disabled:hover:scale-100"
              >
                <Eraser className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
            
            <div className="flex-1 md:flex-none order-1 md:order-2">
              <Button 
                type="submit"
                disabled={!state.text.trim() || !state.format || state.isProcessing || validation.isTextTooLong || validation.isTextTooShort}
                className="w-full md:w-auto relative inline-flex items-center px-6 py-2 
                          bg-gradient-to-r from-primary to-primary-dark dark:from-primary-dark dark:to-primary
                          text-white overflow-hidden transition-all duration-300 
                          hover:scale-105 hover:shadow-lg 
                          disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none 
                          min-w-[140px] justify-center"
              >
                {state.isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>Summarize</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Result */}
        {state.result && !state.error && (
          <SummaryResult
            summary={state.result}
            format={state.format!}
            originalLength={state.characterCount}
            onClear={actions.clearState}
          />
        )}
      </form>
    </TooltipProvider>
  );
}
