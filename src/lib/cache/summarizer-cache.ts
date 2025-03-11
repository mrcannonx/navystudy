import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class SummarizerCache {
  private static async generateKey(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return `summary:${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`
  }

  static async get(text: string): Promise<string | null> {
    const key = await this.generateKey(text)
    return redis.get(key) as Promise<string | null>
  }

  static async set(text: string, summary: string): Promise<void> {
    const key = await this.generateKey(text)
    await redis.set(key, summary, {
      ex: 3600 // 1 hour expiry
    })
  }

  static async trackProgress(requestId: string, progress: number): Promise<void> {
    const key = `progress:${requestId}`
    await redis.set(key, progress, {
      ex: 300 // 5 minutes expiry
    })
  }

  static async getProgress(requestId: string): Promise<number> {
    const key = `progress:${requestId}`
    const progress = await redis.get<number>(key)
    return progress ?? 0
  }
}
