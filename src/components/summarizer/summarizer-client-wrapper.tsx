"use client"

import { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { ClientLoadingState } from '@/components/ui/client-loading-state';
import { EnhancedSummarizerClient } from './enhanced-summarizer-client';

// Simple custom error boundary
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error in summarizer component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Oops, something went wrong</h2>
            <p className="text-gray-600 mb-4">
              There was an error loading the summarizer. Please try refreshing the page.
            </p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function SummarizerClientWrapper() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ClientLoadingState />}>
        <EnhancedSummarizerClient />
      </Suspense>
    </ErrorBoundary>
  );
}