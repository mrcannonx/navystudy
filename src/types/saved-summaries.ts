import { SummaryFormat } from '@/lib/types';
import {
  Summarizer,
  SummarizerInput,
  SummarizerState,
  SummarizerUpdateInput
} from './summarizer';

// For backward compatibility
export type SavedSummary = Summarizer;
export type SavedSummaryInput = SummarizerInput;
export type SavedSummariesState = SummarizerState;
export type SavedSummaryUpdateInput = SummarizerUpdateInput;
