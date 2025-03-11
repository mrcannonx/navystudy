import { type ToastProps, type useToast } from "@/components/ui/use-toast"

interface ErrorHandlerOptions {
  toast: ReturnType<typeof useToast>
  context?: string
  silent?: boolean
}

interface ErrorDetails {
  name: string
  message: string
  stack?: string
  context?: string
}

export class AppError extends Error {
  context?: string
  details?: Record<string, unknown>

  constructor(message: string, context?: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'AppError'
    this.context = context
    this.details = details
  }
}

export function handleError(error: unknown, options: ErrorHandlerOptions): ErrorDetails {
  const { toast, context = 'perform operation', silent = false } = options
  
  // Convert unknown error to a typed error object
  const errorDetails: ErrorDetails = {
    name: 'Unknown Error',
    message: 'An unknown error occurred',
    context
  }

  if (error instanceof AppError) {
    errorDetails.name = error.name
    errorDetails.message = error.message
    errorDetails.stack = error.stack
    errorDetails.context = error.context
    
    console.error(`Error in ${error.context || context}:`, {
      message: error.message,
      details: error.details,
      stack: error.stack
    })
  } else if (error instanceof Error) {
    errorDetails.name = error.name
    errorDetails.message = error.message
    errorDetails.stack = error.stack
    
    // Log detailed error information
    console.error(`Error while trying to ${context}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      originalError: error // Include the original error for debugging
    })
  } else {
    console.error(`Unknown error while trying to ${context}:`, error)
  }

  if (!silent) {
    // Show a more user-friendly error message
    const errorMessage = errorDetails.message.includes('not found') 
      ? 'The item you are trying to delete no longer exists.'
      : errorDetails.message;
      
    toast.toast({
      title: "Error",
      description: `Failed to ${context}. ${errorMessage}`,
      variant: "destructive",
    })
  }

  return errorDetails
}

export function createAppError(
  message: string,
  context?: string,
  details?: Record<string, unknown>
): AppError {
  return new AppError(message, context, details)
}
