export const SUMMARIZER_CONFIG = {
  maxFileSize: 104857600, // 100MB in bytes
  chunkSize: 1048576, // 1MB in bytes - reasonable chunk size for text processing
} as const;

export type SummarizerConfig = typeof SUMMARIZER_CONFIG;

// Utility functions for config validation
export function validateFileSize(size: number): boolean {
  return size > 0 && size <= SUMMARIZER_CONFIG.maxFileSize;
}
