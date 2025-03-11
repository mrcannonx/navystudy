export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
  type: 'basic' | 'cloze' | 'reversed';
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  hints?: string[];
  mnemonic?: string;
  tags?: string[];
  metadata?: {
    frontLength: number;
    backLength: number;
    complexityScore?: number;
    hasMedia?: boolean;
    clozeData?: Array<{
      text: string;
      answer: string;
      position: number;
    }>;
  };
}

export interface GenerateContentResponse {
  success: boolean;
  error?: string;
  data?: {
    quiz?: QuizQuestion[];
    flashcards?: Flashcard[];
    summary?: string;
  };
}

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string | Array<{
    type: "text";
    text: string;
  }>;
}

export interface ClaudeResponse {
  id: string;
  model: string;
  role: "assistant";
  type: "message";
  content: Array<{
    type: "text";
    text: string;
  }>;
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use" | null;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class TimeoutError extends Error {
  constructor(message: string, public duration: number) {
    super(message);
    this.name = "TimeoutError";
  }
}

export type SummaryFormat = 'bullet' | 'tldr' | 'qa';

// Ensure this matches the database schema
export interface SummarizerInput {
  title: string;
  content: string;
  format: SummaryFormat;
  original_text: string;
  tags?: string[];
}

export interface Summarizer {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  content: string;
  format: SummaryFormat;
  original_text: string;
  tags: string[];
}

// For backward compatibility
export type SavedSummaryInput = SummarizerInput;
export type SavedSummary = Summarizer;

export type ContentType = "quiz" | "flashcards" | "summary" | "navadmin" | "metrics";

export interface RequestMetadata {
  chunkIndex?: number;
  totalChunks?: number;
  previousContext?: string;
}

export interface AIRequest {
  content: string;
  type: ContentType;
  timestamp: number;
  format?: SummaryFormat;
  metadata?: RequestMetadata;
}

export interface SummaryResponse {
  success: boolean;
  error?: string;
  data: {
    summary: string;
  };
}

export interface AIResponse<T = any> {
  success: boolean;
  error?: string;
  data: T;
  metadata?: Record<string, any>;
}
