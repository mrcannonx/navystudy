import { User } from '@supabase/supabase-js';
import type { Summarizer, SummarizerInput, SummarizerUpdateInput } from '@/types/summarizer';
import { supabase } from '@/lib/supabase';
import { cleanSummaryContent } from '@/lib/utils/summary-cleaner';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export async function fetchSummaries(user: User): Promise<Summarizer[]> {
  if (!user?.id) throw new DatabaseError('Authentication required');

  const { data, error } = await supabase
    .from('summarizer')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new DatabaseError(
      `Failed to fetch summaries: ${error.message}`,
      error.code,
      error.details
    );
  }

  return data;
}

export async function createSummary(user: User, input: SummarizerInput): Promise<Summarizer> {
  if (!user?.id) throw new DatabaseError('Authentication required');

  // Debug authentication state
  console.log('Creating summary - Auth debug:', {
    userId: user.id,
    isAuthenticated: !!user,
    email: user.email,
    sessionInfo: await supabase.auth.getSession()
  });

  const summaryData = {
    ...input,
    user_id: user.id,
    format: input.format.toLowerCase(),
    tags: input.tags || [],
    content: cleanSummaryContent(input.content)
  };

  const { data, error } = await supabase
    .from('summarizer')
    .insert([summaryData])
    .select()
    .single();

  if (error) {
    throw new DatabaseError(
      `Failed to save summary: ${error.message}`,
      error.code,
      error.details
    );
  }

  return data;
}

export async function deleteSummary(user: User, summaryId: string): Promise<void> {
  if (!user?.id) throw new DatabaseError('Authentication required');

  const { error } = await supabase
    .from('summarizer')
    .delete()
    .match({ id: summaryId, user_id: user.id });

  if (error) {
    throw new DatabaseError(
      `Failed to delete summary: ${error.message}`,
      error.code,
      error.details
    );
  }
}

export async function updateSummary(
  user: User,
  summaryId: string,
  updates: SummarizerUpdateInput
): Promise<Summarizer> {
  if (!user?.id) throw new DatabaseError('Authentication required');

  const cleanedUpdates = {
    ...updates,
    content: updates.content ? cleanSummaryContent(updates.content) : undefined
  };

  const { data, error } = await supabase
    .from('summarizer')
    .update(cleanedUpdates)
    .match({ id: summaryId, user_id: user.id })
    .select()
    .single();

  if (error) {
    throw new DatabaseError(
      `Failed to update summary: ${error.message}`,
      error.code,
      error.details
    );
  }

  return data;
}