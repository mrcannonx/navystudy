"use client"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { ClientLoadingState } from "@/components/ui/client-loading-state"
import { EnhancedSummarizerHeroSection } from "./enhanced-summarizer-hero-section"
import { useSummarizer } from "@/hooks/use-summarizer"
import { useSavedSummaries } from "@/hooks/use-saved-summaries"
import { FormatSelector } from "./format-selector"
import { TextInput } from "./text-input"
import { SummaryDisplay } from "./summary-display"
import { EnhancedSavedSummariesList } from "./enhanced-saved-summaries-list"

function EnhancedSummarizerInner() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const containerRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState("")
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [summaryTitle, setSummaryTitle] = useState("")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const { state, summarize, reset, setFormat } = useSummarizer()
  const { summaries, isLoading, saveSummary, deleteSummary, updateSummary, fetchSavedSummaries } = useSavedSummaries()

  // Fetch saved summaries when user is available
  useEffect(() => {
    if (user) {
      fetchSavedSummaries()
    }
  }, [user, fetchSavedSummaries])

  const handleSave = useCallback(async () => {
    if (!summaryTitle.trim() || !state.summary) {
      setSaveError("Please enter a title for your summary")
      return
    }
    
    try {
      setIsSaving(true)
      setSaveError(null)

      await saveSummary({
        title: summaryTitle,
        content: state.summary,
        format: state.format,
        original_text: text,
        tags: []
      })

      setSummaryTitle("")
      setIsSaveDialogOpen(false)
      await fetchSavedSummaries()
      
      toast({
        title: "Success",
        description: "Summary saved successfully",
      })
    } catch (error) {
      let errorMessage = "Failed to save summary. Please try again."
      
      if (error instanceof Error) {
        if (error.message.includes("authentication") || error.message.includes("profile")) {
          errorMessage = "Please sign in to save summaries"
        } else if (error.message.includes("format")) {
          errorMessage = "Invalid summary format. Please try again."
        } else {
          errorMessage = error.message
        }
      }
      
      setSaveError(errorMessage)
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }, [summaryTitle, state.summary, state.format, text, saveSummary, fetchSavedSummaries, toast])

  // Authentication check
  const authContent = useMemo(() => {
    if (!user && !authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-gray-500 dark:text-gray-400">Please sign in to use the summarizer</p>
            <Link href="/auth" className="inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
            </Link>
          </div>
        </div>
      )
    }
    return null
  }, [user, authLoading])

  // Loading state
  const loadingContent = useMemo(() => {
    if ((authLoading && !user) || (isLoading && !user)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <ClientLoadingState />
        </div>
      )
    }
    return null
  }, [authLoading, isLoading, user])

  // If we're in auth or loading states, show those
  if (authContent) return authContent
  if (loadingContent) return loadingContent

  return (
    <>
      {/* Hero Section - Full Width */}
      <EnhancedSummarizerHeroSection />

      <div ref={containerRef} className="pb-16">
        <div className="container max-w-7xl mx-auto px-4 mt-10">
          <div className="flex justify-between items-center my-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Summarizer</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Transform lengthy content into concise summaries using AI
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-10">
            <FormatSelector
              selectedFormat={state.format}
              onFormatChange={setFormat}
            />

            <TextInput
              value={text}
              onChange={setText}
              onClear={() => {
                setText("")
                reset()
              }}
              onSummarize={() => text.trim() && summarize(text)}
              isLoading={state.isLoading}
            />

            <SummaryDisplay
              summary={state.summary}
              error={state.error}
              isSaveDialogOpen={isSaveDialogOpen}
              onSaveDialogOpenChange={setIsSaveDialogOpen}
              summaryTitle={summaryTitle}
              onSummaryTitleChange={setSummaryTitle}
              onSave={handleSave}
              isSaving={isSaving}
              saveError={saveError}
            />
          </div>

          {/* Saved Summaries Section */}
          <div className="my-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Summaries</h2>
            </div>
            
            <EnhancedSavedSummariesList
              summaries={summaries}
              onDelete={deleteSummary}
              onEdit={(id: string, title: string) => updateSummary(id, { title })}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export function EnhancedSummarizerClient() {
  return (
    <EnhancedSummarizerInner />
  )
}