"use client"

import { SummarizerForm } from "./summarizer-form"
import { SummarizerErrorBoundary } from "./summarizer-error-boundary"
import { AsyncErrorBoundary } from "@/components/error-boundary/async-error-boundary"

export function SummarizerClient() {
  return (
    <AsyncErrorBoundary>
      <SummarizerErrorBoundary>
        <div className="space-y-8">
          <SummarizerForm />
        </div>
      </SummarizerErrorBoundary>
    </AsyncErrorBoundary>
  )
}
