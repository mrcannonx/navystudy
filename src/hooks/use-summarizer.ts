import { useState, useCallback } from 'react'
import { SUMMARIZER_CONFIG } from '@/config/summarizer'
import { makeAIRequest } from '@/lib/ai-client'
import { SummaryFormat } from '@/lib/types'
import { chunkContent, processChunks, preprocessContent } from '@/lib/utils/chunk-processor'

interface SummarizerState {
  summary: string | null
  error: string | null
  isLoading: boolean
  format: SummaryFormat
  progress: {
    current: number
    total: number
    message?: string
  } | null
}

interface UseSummarizerReturn {
  summarize: (text: string) => Promise<void>
  state: SummarizerState
  reset: () => void
  setFormat: (format: SummaryFormat) => void
}

export function useSummarizer(): UseSummarizerReturn {
  const [state, setState] = useState<SummarizerState>({
    summary: null,
    error: null,
    isLoading: false,
    format: 'bullet',
    progress: null
  })

  const setFormat = useCallback((format: SummaryFormat) => {
    console.log(`[Summarizer] Setting format to: ${format}`)
    setState(prev => ({ ...prev, format }))
  }, [])

  const reset = useCallback(() => {
    setState({
      summary: null,
      error: null,
      isLoading: false,
      format: 'bullet',
      progress: null
    })
  }, [])

  const updateProgress = useCallback((current: number, total: number, message?: string) => {
    setState(prev => ({
      ...prev,
      progress: { current, total, message }
    }))
  }, [])

  const summarize = useCallback(async (text: string) => {
    try {
      // Reset state but keep format
      setState(prev => ({
        ...prev,
        summary: null,
        error: null,
        isLoading: true,
        progress: null
      }))

      // Validate text size
      if (text.length > SUMMARIZER_CONFIG.maxFileSize) {
        throw new Error('Text exceeds maximum allowed size')
      }

      // Preprocess content
      const processedContent = preprocessContent(text)

      // Split into semantic chunks
      const chunks = chunkContent(processedContent)
      console.log(`Content split into ${chunks.length} semantic chunks`)

      console.log(`[Summarizer] Processing content with format: ${state.format}`)
      
      // Process chunks with progress updates
      const results = await processChunks(chunks, 'summary', state.format, (current, message) => {
        updateProgress(current, chunks.length, message)
      })

      if (!results || results.length === 0) {
        throw new Error('No summary was generated')
      }

      // The processChunks function now returns a combined summary
      const summary = results[0]

      setState(prev => ({
        ...prev,
        summary: summary || null,
        isLoading: false,
        progress: null
      }))
    } catch (error) {
      console.error('Summarization error:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
        progress: null
      }))
    }
  }, [state.format, updateProgress])

  return {
    summarize,
    state,
    reset,
    setFormat
  }
}
