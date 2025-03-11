import { SummaryFormat } from '@/lib/types';

export interface Summarizer {
  id: string;
  user_id: string;
  title: string;
  content: string;
  original_text: string;
  format: SummaryFormat;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface SummarizerInput {
  title: string;
  content: string;
  original_text: string;
  format: SummaryFormat;
  tags?: string[];
}

export interface SummarizerState {
  summaries: Summarizer[];
  isLoading: boolean;
  error: string | null;
}

export type SummarizerUpdateInput = Partial<SummarizerInput>;