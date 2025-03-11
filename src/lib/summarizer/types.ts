import { NextRequest, NextResponse } from 'next/server';

export type SummaryFormat = 'bullets' | 'tldr' | 'qa';

export interface FormatPrompt {
  system: string;
  user: (text: string) => string;
}

export type FormatPrompts = {
  [K in SummaryFormat]: FormatPrompt;
};

export interface SummaryRequest {
  text: string;
  format: SummaryFormat;
}

export interface SummaryResponse {
  summary: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export type ApiResponse = NextResponse<{
  summary: string;
} | {
  error: string;
  details?: string;
}>;

export interface SummarizerConfig {
  maxFileSize: number;
  chunkSize: number;
  maxTokens: number;
  model: string;
}
