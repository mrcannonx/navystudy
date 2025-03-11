import { List, Zap, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SummaryFormat = 'bullets' | 'tldr' | 'qa';

export interface FormatOption {
  icon: LucideIcon;
  label: string;
  description: string;
}

export const FORMAT_OPTIONS: Record<SummaryFormat, FormatOption> = {
  bullets: {
    icon: List,
    label: "Bullet Points",
    description: "Converts text into clear, concise bullet points. Best for lists of facts, features, or sequential information."
  },
  tldr: {
    icon: Zap,
    label: "TL;DR",
    description: "Creates a brief overview followed by key points. Perfect for quick understanding of long content."
  },
  qa: {
    icon: HelpCircle,
    label: "Q&A",
    description: "Transforms content into a Q&A format. Ideal for understanding complex topics through questions and answers."
  }
} as const;

export const VALIDATION_CONSTANTS = {
  MAX_CHARS: 25000,
  MIN_CHARS: 10,
  CHUNK_SIZE: 8000,
  CHUNK_OVERLAP: 200
} as const;

export const API_ENDPOINTS = {
  SUMMARIZE: '/api/v1/summarize'
} as const;
