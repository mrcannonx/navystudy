// Import the new hook
import { useSummarizerData } from './use-summarizer-data';

// For backward compatibility, re-export the hook with the old name
export function useSavedSummaries() {
  return useSummarizerData();
}
