import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  automaticDeserialization: true,
});

// Helper function to check Redis connection
export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    console.log('✅ Redis connection successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
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
  const [count, ttl] = await Promise.all([
    redis.get<number>(key),
    redis.ttl(key),
  ]);

  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
  const maxRequests = parseInt(process.env.MAX_REQUESTS_PER_WINDOW || '10', 10);

  return {
    remaining: Math.max(0, maxRequests - (count || 0)),
    reset: Date.now() + (ttl * 1000 || windowMs),
    total: maxRequests,
  };
} 