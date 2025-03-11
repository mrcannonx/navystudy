import { MemoryRateLimiter } from './memory-rate-limiter';

describe('MemoryRateLimiter', () => {
  let rateLimiter: MemoryRateLimiter;
  
  beforeEach(() => {
    // Get a fresh instance for each test
    rateLimiter = MemoryRateLimiter.getInstance();
    
    // Clear any existing rate limits by accessing the private property
    // This is a hack for testing purposes
    (rateLimiter as any).rateLimits = new Map();
  });
  
  test('increment should start at 1 for a new key', async () => {
    const count = await rateLimiter.increment('test-key', 60000);
    expect(count).toBe(1);
  });
  
  test('increment should increase count for existing key', async () => {
    await rateLimiter.increment('test-key', 60000);
    const count = await rateLimiter.increment('test-key', 60000);
    expect(count).toBe(2);
  });
  
  test('get should return 0 for non-existent key', async () => {
    const count = await rateLimiter.get('non-existent-key');
    expect(count).toBe(0);
  });
  
  test('get should return count for existing key', async () => {
    await rateLimiter.increment('test-key', 60000);
    await rateLimiter.increment('test-key', 60000);
    const count = await rateLimiter.get('test-key');
    expect(count).toBe(2);
  });
  
  test('ttl should return 0 for non-existent key', async () => {
    const ttl = await rateLimiter.ttl('non-existent-key');
    expect(ttl).toBe(0);
  });
  
  test('ttl should return positive value for existing key', async () => {
    await rateLimiter.increment('test-key', 60000);
    const ttl = await rateLimiter.ttl('test-key');
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(60);
  });
  
  test('cleanup should remove expired entries', async () => {
    // Mock Date.now to return a fixed timestamp
    const originalNow = Date.now;
    const mockNow = jest.fn();
    
    try {
      // Set initial time
      const initialTime = 1000000;
      mockNow.mockReturnValue(initialTime);
      global.Date.now = mockNow;
      
      // Add a rate limit with a 1000ms window
      await rateLimiter.increment('test-key', 1000);
      
      // Verify it exists
      let count = await rateLimiter.get('test-key');
      expect(count).toBe(1);
      
      // Advance time past expiration
      mockNow.mockReturnValue(initialTime + 2000);
      
      // Manually trigger cleanup
      (rateLimiter as any).cleanup();
      
      // Verify it's been removed
      count = await rateLimiter.get('test-key');
      expect(count).toBe(0);
    } finally {
      // Restore original Date.now
      global.Date.now = originalNow;
    }
  });
});