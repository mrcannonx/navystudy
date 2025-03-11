// In-memory cache implementation
const cache = new Map<string, { summary: string, timestamp: number }>();
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

export class SummarizerCache {
  private static async generateKey(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return `summary:${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;
  }

  static async get(text: string): Promise<string | null> {
    const key = await this.generateKey(text);
    const cached = cache.get(key);
    
    if (!cached) return null;
    
    // Check if cached item has expired
    if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
      cache.delete(key);
      return null;
    }
    
    return cached.summary;
  }

  static async set(text: string, summary: string): Promise<void> {
    const key = await this.generateKey(text);
    cache.set(key, {
      summary,
      timestamp: Date.now()
    });
  }
}
