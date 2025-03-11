export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheError';
  }
}

export function handleSummarizerError(error: unknown): { error: string; status: number; details?: string } {
  console.error('[Summarizer] Error:', {
    name: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });

  if (error instanceof ValidationError) {
    return {
      error: error.message,
      status: 400
    };
  }

  if (error instanceof ServiceError) {
    return {
      error: error.message,
      status: error.status
    };
  }

  if (error instanceof CacheError) {
    return {
      error: 'Cache operation failed',
      status: 503,
      details: error.message
    };
  }

  // Handle Anthropic API key issues
  if (error instanceof Error && 
    (error.message.includes('ANTHROPIC_API_KEY') || 
     error.message.includes('Anthropic API key'))) {
    return {
      error: 'The summarizer service is not properly configured. Please contact support to set up the API key.',
      status: 503
    };
  }

  // Default error response
  return {
    error: 'An unexpected error occurred',
    status: 500,
    details: error instanceof Error ? error.message : 'Unknown error'
  };
}
