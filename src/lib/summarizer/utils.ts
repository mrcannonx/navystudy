import { SUMMARIZER_CONFIG } from '@/config/summarizer'

export class SummarizerError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean
  ) {
    super(message)
    this.name = 'SummarizerError'
  }
}

export function validateTextSize(text: string): void {
  if (text.length > SUMMARIZER_CONFIG.maxFileSize) {
    throw new SummarizerError(
      'Text exceeds maximum allowed size',
      'MAX_SIZE_EXCEEDED',
      false
    )
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (error instanceof SummarizerError && !error.retryable) {
        throw error
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
  
  throw lastError!
}

export async function summarizeWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = 50000 // 50 seconds to stay within Vercel's 60s limit
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new SummarizerError(
        'Operation timed out',
        'TIMEOUT',
        true
      )), timeoutMs)
    )
  ])
}
