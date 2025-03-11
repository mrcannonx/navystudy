import 'dotenv/config';
import { redis, checkRedisConnection } from './client';

async function testRedisOperations() {
  try {
    console.log('Testing Redis connection with URL:', process.env.UPSTASH_REDIS_REST_URL);
    
    // 1. Test basic connection
    const isConnected = await checkRedisConnection();
    if (!isConnected) {
      console.error('❌ Redis connection test failed');
      return;
    }

    // 2. Test basic operations
    console.log('Testing basic Redis operations...');
    
    // Set operation
    await redis.set('test:key', 'Hello from NAVY Study!');
    console.log('✅ SET operation successful');

    // Get operation
    const value = await redis.get('test:key');
    console.log('✅ GET operation successful:', value);

    // Rate limiting test
    const testKey = 'test:rate_limit';
    await redis.incr(testKey);
    await redis.expire(testKey, 60); // 60 seconds TTL
    const count = await redis.get<number>(testKey);
    console.log('✅ Rate limiting operations successful. Counter:', count);

    // Clean up
    await redis.del('test:key');
    await redis.del(testKey);
    console.log('✅ Cleanup successful');

    console.log('✨ All Redis operations completed successfully!');
  } catch (error) {
    console.error('❌ Redis operations test failed:', error);
  }
}

// Run the test
testRedisOperations();
