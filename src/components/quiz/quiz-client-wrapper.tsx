"use client"

import { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { ClientLoadingState } from '@/components/ui/client-loading-state';
// import { EnhancedQuizPageClient } from './enhanced-quiz-page-client';
// Use absolute path instead:
import { EnhancedQuizPageClient } from '@/components/quiz/enhanced-quiz-page-client';

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
    console.error("Error in quiz component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Oops, something went wrong</h2>
            <p className="text-gray-600 mb-4">
              There was an error loading quizzes. Please try refreshing the page.
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

export function QuizClientWrapper() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ClientLoadingState />}>
        <EnhancedQuizPageClient />
      </Suspense>
    </ErrorBoundary>
  );
}