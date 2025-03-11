import { NextRequest, NextResponse } from 'next/server';
import { RateLimitError, ValidationError } from '@/lib/api/error-handling';
import { SUMMARIZER_CONFIG } from '@/config/summarizer';
import DOMPurify from 'isomorphic-dompurify';
import { memoryClient, getRateLimitInfo } from '@/lib/rate-limiter/memory-client';

interface AISecurityConfig {
  maxRequestSize: number;
  rateLimitWindowMs: number;
  maxRequestsPerWindow: number;
  trustProxy: boolean;
  maxContentLength: number;
  minContentLength: number;
}

const DEFAULT_AI_SECURITY_CONFIG: AISecurityConfig = {
  maxRequestSize: 1024 * 1024, // 1MB
  rateLimitWindowMs: 60 * 1000, // 1 minute
  maxRequestsPerWindow: 5, // Stricter rate limit for AI endpoints
  trustProxy: true,
  maxContentLength: 25000, // Maximum characters for study content
  minContentLength: 50, // Minimum characters required
};

export async function aiSecurityMiddleware(
  req: NextRequest,
  config: Partial<AISecurityConfig> = {}
): Promise<NextResponse | null> {
  const fullConfig = { ...DEFAULT_AI_SECURITY_CONFIG, ...config };

  try {
    // 1. Check request size
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > fullConfig.maxRequestSize) {
      return NextResponse.json(
        { error: 'Content too large. Please break it into smaller chunks.' },
        { status: 413 }
      );
    }

    // 2. Rate limiting
    const clientIp = getClientIp(req, fullConfig.trustProxy);
    await enforceAIRateLimit(clientIp, fullConfig);

    // Get rate limit info for headers
    const rateLimitInfo = await getRateLimitInfo(clientIp);

    // 3. Add security headers
    const headers = new Headers({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
      'X-RateLimit-Limit': String(rateLimitInfo.total),
      'X-RateLimit-Remaining': String(rateLimitInfo.remaining),
      'X-RateLimit-Reset': String(rateLimitInfo.reset),
    });

    // 4. Return modified response with headers
    return null; // Allow request to proceed with added headers
  } catch (error) {
    if (error instanceof RateLimitError) {
      const rateLimitInfo = await getRateLimitInfo(getClientIp(req, fullConfig.trustProxy));
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please wait before generating more content.',
          retryAfter: error.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(error.retryAfter || 60),
            'X-RateLimit-Limit': String(rateLimitInfo.total),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitInfo.reset),
          }
        }
      );
    }

    console.error('AI security middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get client IP
function getClientIp(req: NextRequest, trustProxy: boolean): string {
  if (trustProxy) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
  }
  
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;
  
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;
  
  const remoteAddr = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  return remoteAddr;
}

// Rate limiting specifically for AI endpoints
async function enforceAIRateLimit(ip: string, config: AISecurityConfig): Promise<void> {
  const key = `ai_rate_limit:${ip}`;

  try {
    const count = await memoryClient.incr(key);
    
    // Set expiration if this is a new key
    if (count === 1) {
      await memoryClient.expire(key, Math.floor(config.rateLimitWindowMs / 1000));
    }
    
    if (count > config.maxRequestsPerWindow) {
      const ttl = await memoryClient.ttl(key);
      throw new RateLimitError('AI rate limit exceeded', ttl);
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('Rate limiting error:', error);
    throw new Error('Rate limiting service unavailable');
  }
}

// Content validation for study materials
export function validateStudyContent(content: {
  title?: string;
  description?: string;
  material: string;
}, config: AISecurityConfig): void {
  // Title validation
  if (!content.title?.trim()) {
    throw new ValidationError('Title is required');
  }
  if (content.title.length > 200) {
    throw new ValidationError('Title must be less than 200 characters');
  }

  // Description validation
  if (content.description && content.description.length > 500) {
    throw new ValidationError('Description must be less than 500 characters');
  }

  // Study material validation
  if (!content.material?.trim()) {
    throw new ValidationError('Study material is required');
  }
  if (content.material.length < config.minContentLength) {
    throw new ValidationError(`Study material must be at least ${config.minContentLength} characters`);
  }
  if (content.material.length > config.maxContentLength) {
    throw new ValidationError(`Study material must be less than ${config.maxContentLength} characters`);
  }
}

// Sanitize study content
export function sanitizeStudyContent(content: {
  title?: string;
  description?: string;
  material: string;
}): typeof content {
  return {
    title: content.title ? DOMPurify.sanitize(content.title).trim() : undefined,
    description: content.description ? DOMPurify.sanitize(content.description).trim() : undefined,
    material: DOMPurify.sanitize(content.material).trim(),
  };
}