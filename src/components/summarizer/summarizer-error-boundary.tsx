'use client';

import { AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';

interface SummarizerErrorFallback {
  error: Error;
  resetErrorBoundary: () => void;
}

function SummarizerErrorFallback({ error, resetErrorBoundary }: SummarizerErrorFallback) {
  const isApiError = error.message.includes('API') || error.message.includes('network');
  const isMemoryError = error.message.includes('memory') || error.message.includes('heap');
  const isValidationError = error.message.includes('validation') || error.message.includes('invalid');

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center rounded-lg border border-destructive/50 bg-destructive/10">
      <AlertCircle className="w-12 h-12 text-destructive" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {isApiError && 'API Error'}
          {isMemoryError && 'Memory Error'}
          {isValidationError && 'Validation Error'}
          {!isApiError && !isMemoryError && !isValidationError && 'Summarizer Error'}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message}
        </p>
        {isApiError && (
          <p className="text-xs text-muted-foreground">
            Please check your internet connection and try again.
          </p>
        )}
        {isMemoryError && (
          <p className="text-xs text-muted-foreground">
            Try processing a smaller text or breaking it into parts.
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={resetErrorBoundary}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            // Clear local storage or any cached data
            localStorage.removeItem('summarizer-state');
            resetErrorBoundary();
          }}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Start Fresh
        </Button>
      </div>
    </div>
  );
}

export function SummarizerErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<SummarizerErrorFallback error={new Error()} resetErrorBoundary={() => {}} />}>
      {children}
    </ErrorBoundary>
  );
} 