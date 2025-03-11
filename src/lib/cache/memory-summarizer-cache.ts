interface CacheEntry {
  summary: string;
  timestamp: number;
}

interface ProgressEntry {
  progress: number;
  timestamp: number;
}

/**
 * In-memory implementation of the summarizer cache to replace Redis-based caching
 */
export class MemorySummarizerCache {
  private static summaryCache: Map<string, CacheEntry> = new Map();
  private static progressCache: Map<string, ProgressEntry> = new Map();
  
  // Cache expiry times in milliseconds
  private static readonly SUMMARY_EXPIRY = 3600 * 1000; // 1 hour
  private static readonly PROGRESS_EXPIRY = 300 * 1000; // 5 minutes
  
  // Maximum cache size
  private static readonly MAX_CACHE_SIZE = 1000;
  
  // Cleanup interval in milliseconds (5 minutes)
  private static readonly CLEANUP_INTERVAL = 5 * 60 * 1000;
  
  static {
    // Set up periodic cleanup of expired cache entries
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }
  
  private static async generateKey(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return `summary:${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;
  }
  
  static async get(text: string): Promise<string | null> {
    const key = await this.generateKey(text);
    const entry = this.summaryCache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.SUMMARY_EXPIRY) {
      this.summaryCache.delete(key);
      return null;
    }
    
    return entry.summary;
  }
  
  static async set(text: string, summary: string): Promise<void> {
    const key = await this.generateKey(text);
    
    this.summaryCache.set(key, {
      summary,
      timestamp: Date.now()
    });
    
    // Manage cache size
    this.manageCacheSize();
  }
  
  static async trackProgress(requestId: string, progress: number): Promise<void> {
    const key = `progress:${requestId}`;
    
    this.progressCache.set(key, {
      progress,
      timestamp: Date.now()
    });
  }
  
  static async getProgress(requestId: string): Promise<number> {
    const key = `progress:${requestId}`;
    const entry = this.progressCache.get(key);
    
    if (!entry) {
      return 0;
    }
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.PROGRESS_EXPIRY) {
      this.progressCache.delete(key);
      return 0;
    }
    
    return entry.progress;
  }
  
  /**
   * Clean up expired cache entries
   */
  private static cleanup(): void {
    const now = Date.now();
    
    // Clean up summary cache
    Array.from(this.summaryCache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.SUMMARY_EXPIRY) {
        this.summaryCache.delete(key);
      }
    });
    
    // Clean up progress cache
    Array.from(this.progressCache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.PROGRESS_EXPIRY) {
        this.progressCache.delete(key);
      }
    });
  }
  
  /**
   * Manage cache size by removing oldest entries when cache exceeds maximum size
   */
  private static manageCacheSize(): void {
    if (this.summaryCache.size <= this.MAX_CACHE_SIZE) {
      return;
    }
    
    // Sort entries by timestamp and remove oldest ones
    const entries = Array.from(this.summaryCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest entries until we're under the limit
    const entriesToRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE);
    entriesToRemove.forEach(([key]) => {
      this.summaryCache.delete(key);
    });
  }
}

// For compatibility with the existing Redis-based implementation
export const SummarizerCache = MemorySummarizerCache;