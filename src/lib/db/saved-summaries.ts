import { User } from '@supabase/supabase-js';
import type { SavedSummary, SavedSummaryInput, SavedSummaryUpdateInput } from '@/types/saved-summaries';
import {
  fetchSummaries as fetchSummarizersInternal,
  createSummary as createSummarizerInternal,
  deleteSummary as deleteSummarizerInternal,
  updateSummary as updateSummarizerInternal,
  DatabaseError
} from './summarizer';

// Re-export the DatabaseError
export { DatabaseError };

// Wrapper functions for backward compatibility
export async function fetchSummaries(user: User): Promise<SavedSummary[]> {
  return fetchSummarizersInternal(user);
}

export async function createSummary(user: User, input: SavedSummaryInput): Promise<SavedSummary> {
  return createSummarizerInternal(user, input);
}

export async function deleteSummary(user: User, summaryId: string): Promise<void> {
  return deleteSummarizerInternal(user, summaryId);
}

export async function updateSummary(
  user: User,
  summaryId: string,
  updates: SavedSummaryUpdateInput
): Promise<SavedSummary> {
  return updateSummarizerInternal(user, summaryId, updates);
}
