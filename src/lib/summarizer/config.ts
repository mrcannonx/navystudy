export const SUMMARIZER_CONFIG = {
  maxFileSize: 104857600, // 100MB in bytes
  chunkSize: 1048576, // 1MB in bytes
  maxTokens: 1500,
  model: 'claude-3-opus-20240229',
  cacheExpiry: 3600, // 1 hour in seconds
  apiKeyPrefix: 'sk-ant-',
  minApiKeyLength: 32,
} as const;

// Utility functions for config validation
export function validateFileSize(size: number): boolean {
  return size > 0 && size <= SUMMARIZER_CONFIG.maxFileSize;
}

export function validateApiKey(apiKey?: string): boolean {
  if (!apiKey) return false;
  return (
    apiKey.startsWith(SUMMARIZER_CONFIG.apiKeyPrefix) &&
    apiKey.length >= SUMMARIZER_CONFIG.minApiKeyLength
  );
}

export function getMaxFileSizeMB(): number {
  return Math.round(SUMMARIZER_CONFIG.maxFileSize / (1024 * 1024));
}
