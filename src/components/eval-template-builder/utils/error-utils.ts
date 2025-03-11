import { ToastProps } from '../types';

/**
 * Centralized error handler for the eval-template-builder
 * @param error The error to handle
 * @param addToast The toast function to use for displaying errors
 * @param defaultMessage The default error message to display
 */
export function handleError(
  error: any,
  addToast: (props: ToastProps) => void,
  defaultMessage: string = 'An error occurred'
): void {
  let message = defaultMessage;
  let title = 'Error';
  let variant: ToastProps['variant'] = 'destructive';
  
  // Extract error message based on error type
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = error.message as string;
  }
  
  // Categorize errors for better user feedback
  if (message.includes('network') || message.includes('fetch') || message.includes('API')) {
    title = 'Network Error';
    message = 'There was a problem connecting to the server. Please check your internet connection and try again.';
  } else if (message.includes('permission') || message.includes('unauthorized') || message.includes('auth')) {
    title = 'Authentication Error';
    message = 'You do not have permission to perform this action. Please log in again.';
  } else if (message.includes('parse') || message.includes('JSON')) {
    title = 'Data Error';
    message = 'There was an error processing the data. Please try again.';
  }
  
  // Display toast notification
  addToast({
    title,
    description: message,
    variant
  });
}

/**
 * Debug utility that only logs in development mode
 * @param args Arguments to log
 */
export function debug(...args: any[]): void {
  // Debug logging removed
}