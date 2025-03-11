/**
 * Rate limiting service for AI generation endpoints
 */

// Default rate limit settings
const DEFAULT_MAX_REQUESTS_PER_MINUTE = 10;

/**
 * RateLimiter class for managing API request rate limits
 */
export class RateLimiter {
  private maxRequestsPerMinute: number;
  private rateLimitMap: Map<string, { count: number, timestamp: number }>;
  
  constructor(maxRequestsPerMinute: number = DEFAULT_MAX_REQUESTS_PER_MINUTE) {
    this.maxRequestsPerMinute = maxRequestsPerMinute;
    this.rateLimitMap = new Map<string, { count: number, timestamp: number }>();
  }
  
  /**
   * Check if a request from an IP address is within rate limits
   * @param ip The IP address making the request
   * @returns true if within rate limit, false if exceeded
   */
  public checkLimit(ip: string): boolean {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const key = `${ip}:${minute}`;
    
    const current = this.rateLimitMap.get(key) || { count: 0, timestamp: now };
    
    // Clean up old entries
    this.cleanupOldEntries(now);
    
    if (current.count >= this.maxRequestsPerMinute) {
      return false;
    }
    
    this.rateLimitMap.set(key, {
      count: current.count + 1,
      timestamp: now
    });
    
    return true;
  }
  
  /**
   * Clean up rate limit entries older than 1 minute
   * @param now Current timestamp
   */
  private cleanupOldEntries(now: number): void {
    Array.from(this.rateLimitMap.keys()).forEach(existingKey => {
      const data = this.rateLimitMap.get(existingKey)!;
      if (now - data.timestamp > 60000) {
        this.rateLimitMap.delete(existingKey);
      }
    });
  }
}

// Create and export default instance
export const rateLimiter = new RateLimiter();