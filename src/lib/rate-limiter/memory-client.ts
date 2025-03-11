import { memoryRateLimiter } from './memory-rate-limiter';

/**
 * In-memory client that mimics the Redis client interface used in the application
 * This allows us to remove the Redis dependency while maintaining the same API
 */
export const memoryClient = {
  // Increment a counter
  incr: async (key: string): Promise<number> => {
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
    return memoryRateLimiter.increment(key, windowMs);
  },
  
  // Set expiration time (no-op since the memory rate limiter handles this internally)
  expire: async (key: string, seconds: number): Promise<boolean> => {
    // The expiration is already handled in the increment method
    // This is just a compatibility method to match the Redis interface
    return true;
  },
  
  // Get time-to-live in seconds
  ttl: async (key: string): Promise<number> => {
    return memoryRateLimiter.ttl(key);
  },
  
  // Get a value
  get: async <T>(key: string): Promise<T | null> => {
    const value = await memoryRateLimiter.get(key);
    return value as unknown as T;
  },
  
  // Ping to check connection (always succeeds for in-memory)
  ping: async (): Promise<string> => {
    return 'PONG';
  }
};

// Helper function to check connection
export async function checkMemoryConnection(): Promise<boolean> {
  try {
    await memoryClient.ping();
    console.log('✅ Memory client connection successful');
    return true;
  } catch (error) {
    console.error('❌ Memory client connection failed:', error);
    return false;
  }
}

// Helper function to get rate limit info
export async function getRateLimitInfo(ip: string): Promise<{
  remaining: number;
  reset: number;
  total: number;
}> {
  const key = `rate_limit:${ip}`;
  const count = await memoryClient.get<number>(key);
  const ttl = await memoryClient.ttl(key);
  
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
  const maxRequests = parseInt(process.env.MAX_REQUESTS_PER_WINDOW || '10', 10);
  
  return {
    remaining: Math.max(0, maxRequests - (count || 0)),
    reset: Date.now() + (ttl * 1000 || windowMs),
    total: maxRequests,
  };
}