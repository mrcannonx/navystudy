import { CacheError } from './error-handling';
import { SUMMARIZER_CONFIG } from './config';

export class SummarizerCache {
  private static cache = new Map<string, { summary: string; timestamp: number }>();

  private static generateKey(text: string): string {
    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `summary_${hash}`;
  }

  private static isExpired(timestamp: number): boolean {
    const now = Date.now();
    return (now - timestamp) > (SUMMARIZER_CONFIG.cacheExpiry * 1000);
  }

  static async get(text: string): Promise<string | null> {
    try {
      const key = this.generateKey(text);
      const cached = this.cache.get(key);

      if (!cached) {
        return null;
      }

      if (this.isExpired(cached.timestamp)) {
        this.cache.delete(key);
        return null;
      }

      return cached.summary;
    } catch (error) {
      console.error('[SummarizerCache] Error in get:', error);
      throw new CacheError(error instanceof Error ? error.message : 'Cache retrieval failed');
    }
  }

  static async set(text: string, summary: string): Promise<void> {
    try {
      const key = this.generateKey(text);
      this.cache.set(key, {
        summary,
        timestamp: Date.now()
      });

      // Basic cache size management
      if (this.cache.size > 1000) { // Limit cache to 1000 entries
        const oldestKey = Array.from(this.cache.entries())
          .reduce((oldest, current) => 
            current[1].timestamp < oldest[1].timestamp ? current : oldest
          )[0];
        this.cache.delete(oldestKey);
      }
    } catch (error) {
      console.error('[SummarizerCache] Error in set:', error);
      throw new CacheError(error instanceof Error ? error.message : 'Cache storage failed');
    }
  }

  static async clear(): Promise<void> {
    try {
      this.cache.clear();
    } catch (error) {
      console.error('[SummarizerCache] Error in clear:', error);
      throw new CacheError(error instanceof Error ? error.message : 'Cache clear failed');
    }
  }
}
