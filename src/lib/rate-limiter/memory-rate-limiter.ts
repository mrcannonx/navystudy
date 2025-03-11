interface RateLimitRecord {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limiter implementation to replace Redis-based rate limiting
 */
export class MemoryRateLimiter {
  private static instance: MemoryRateLimiter;
  private rateLimits: Map<string, RateLimitRecord> = new Map();
  
  // Cleanup interval in milliseconds (5 minutes)
  private readonly cleanupInterval = 5 * 60 * 1000;
  
  private constructor() {
    // Set up periodic cleanup of expired rate limit records
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }
  
  public static getInstance(): MemoryRateLimiter {
    if (!MemoryRateLimiter.instance) {
      MemoryRateLimiter.instance = new MemoryRateLimiter();
    }
    return MemoryRateLimiter.instance;
  }
  
  /**
   * Increment the request count for a key
   * @param key The rate limit key (usually based on IP)
   * @param windowMs The time window in milliseconds
   * @returns The current count
   */
  public async increment(key: string, windowMs: number): Promise<number> {
    const now = Date.now();
    const record = this.rateLimits.get(key);
    
    if (!record || now > record.resetTime) {
      // Create new record if none exists or the existing one has expired
      this.rateLimits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return 1;
    } else {
      // Increment existing record
      record.count += 1;
      return record.count;
    }
  }
  
  /**
   * Get the time-to-live for a key in seconds
   * @param key The rate limit key
   * @returns The TTL in seconds, or 0 if the key doesn't exist
   */
  public async ttl(key: string): Promise<number> {
    const record = this.rateLimits.get(key);
    if (!record) return 0;
    
    const now = Date.now();
    const ttlMs = Math.max(0, record.resetTime - now);
    return Math.ceil(ttlMs / 1000); // Convert to seconds
  }
  
  /**
   * Get the current count for a key
   * @param key The rate limit key
   * @returns The current count, or 0 if the key doesn't exist
   */
  public async get(key: string): Promise<number> {
    const record = this.rateLimits.get(key);
    if (!record) return 0;
    
    const now = Date.now();
    if (now > record.resetTime) {
      this.rateLimits.delete(key);
      return 0;
    }
    
    return record.count;
  }
  
  /**
   * Clean up expired rate limit records
   */
  private cleanup(): void {
    const now = Date.now();
    // Use Array.from to convert Map entries to an array for compatibility
    Array.from(this.rateLimits.entries()).forEach(([key, record]) => {
      if (now > record.resetTime) {
        this.rateLimits.delete(key);
      }
    });
  }
}

// Export a singleton instance
export const memoryRateLimiter = MemoryRateLimiter.getInstance();