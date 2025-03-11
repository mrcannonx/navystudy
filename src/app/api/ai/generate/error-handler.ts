/**
 * Error handler service for AI generation API routes
 * Provides consistent error handling across API endpoints
 */

import { NextResponse } from 'next/server';
import { ValidationError } from '@/lib/api/error-handling';

/**
 * ErrorHandler class for handling API errors
 */
export class ErrorHandler {
  /**
   * Handle API errors and return appropriate responses
   * @param error The error to handle
   * @returns NextResponse with appropriate status code and error message
   */
  public handleApiError(error: unknown): NextResponse {
    console.error('AI generation error:', error);

    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Handle rate limit errors
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Generic error for other cases
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

// Create and export default instance
export const errorHandler = new ErrorHandler();