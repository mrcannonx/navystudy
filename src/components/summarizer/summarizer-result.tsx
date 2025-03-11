"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Copy, Check } from "lucide-react"
import { useState } from "react"

interface SummarizerResultProps {
  summary: string
  loading: boolean
  error: string
}

export function SummarizerResult({ summary, loading, error }: SummarizerResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="mt-8 p-6 border rounded-lg bg-muted/50">
        <div className="flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Generating summary...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 p-6 border rounded-lg bg-destructive/10 text-destructive">
        {error}
      </div>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Summary</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="p-6 border rounded-lg bg-muted/50">
        {summary}
      </div>
    </div>
  )
}
