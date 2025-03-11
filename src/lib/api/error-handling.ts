import { AxiosError } from 'axios';

// Error types for better error handling
export interface ApiError extends Error {
  code: string;
  status?: number;
  retryable: boolean;
}

export class RateLimitError extends Error implements ApiError {
  code = 'RATE_LIMIT';
  status = 429;
  retryable = true;
  
  constructor(message = 'Rate limit exceeded. Please try again in a moment.', public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends Error implements ApiError {
  code = 'NETWORK_ERROR';
  retryable = true;
  
  constructor(message = 'Network error occurred. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ServiceError extends Error implements ApiError {
  code = 'SERVICE_ERROR';
  retryable = true;
  
  constructor(message = 'Service is temporarily unavailable. Please try again later.', public status = 500) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class ValidationError extends Error implements ApiError {
  code = 'VALIDATION_ERROR';
  status = 400;
  retryable = false;
  
  constructor(message = 'Invalid input provided.') {
    super(message);
    this.name = 'ValidationError';
  }
}

// Retry configuration
interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

// Calculate delay with exponential backoff
function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelay * Math.pow(config.backoffFactor, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

// Sleep utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= fullConfig.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if error is not retryable
      if (error instanceof ValidationError) {
        throw error;
      }
      
      // Handle rate limiting specifically
      if (error instanceof RateLimitError && error.retryAfter) {
        await sleep(error.retryAfter * 1000);
        continue;
      }
      
      // Don't retry on last attempt
      if (attempt === fullConfig.maxRetries) {
        break;
      }
      
      // Calculate and apply backoff delay
      const delay = calculateDelay(attempt, fullConfig);
      await sleep(delay);
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}

// Error handler that converts various error types to our custom errors
export function handleApiError(error: unknown): ApiError {
  if (error instanceof RateLimitError || 
      error instanceof NetworkError || 
      error instanceof ServiceError || 
      error instanceof ValidationError) {
    return error;
  }

  if (error instanceof AxiosError && error.response) {
    const { status } = error.response;
    
    if (status === 429) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10);
      return new RateLimitError(undefined, retryAfter);
    }
    
    if (status === 400) {
      return new ValidationError(error.response.data?.message);
    }
    
    if (status >= 500) {
      return new ServiceError(error.response.data?.message, status);
    }
  }
  
  if (error instanceof AxiosError && !error.response) {
    return new NetworkError();
  }
  
  return new ServiceError('An unexpected error occurred.');
}

// User-friendly error messages
export function getUserFriendlyErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  
  switch (apiError.code) {
    case 'RATE_LIMIT':
      return 'You\'ve made too many requests. Please wait a moment before trying again.';
    case 'NETWORK_ERROR':
      return 'Unable to connect to the service. Please check your internet connection and try again.';
    case 'SERVICE_ERROR':
      return 'The service is temporarily unavailable. Our team has been notified and is working on it.';
    case 'VALIDATION_ERROR':
      return apiError.message || 'Please check your input and try again.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
} 