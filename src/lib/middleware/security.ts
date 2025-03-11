import { NextRequest, NextResponse } from 'next/server';
import { RateLimitError } from '@/lib/api/error-handling';
import { SUMMARIZER_CONFIG } from '@/config/summarizer';
import DOMPurify from 'isomorphic-dompurify';

interface SecurityConfig {
  maxRequestSize: number;
  rateLimitWindowMs: number;
  maxRequestsPerWindow: number;
  trustProxy: boolean;
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxRequestSize: 50 * 1024 * 1024, // 50MB
  rateLimitWindowMs: 60 * 1000, // 1 minute
  maxRequestsPerWindow: 60, // 60 requests per minute
  trustProxy: true,
};

// In-memory fallback for rate limiting
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

export async function securityMiddleware(
  req: NextRequest,
  config: Partial<SecurityConfig> = {}
): Promise<NextResponse | null> {
  const fullConfig = { ...DEFAULT_SECURITY_CONFIG, ...config };

  try {
    // 1. Check request size
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > fullConfig.maxRequestSize) {
      return NextResponse.json(
        { error: 'Request entity too large' },
        { status: 413 }
      );
    }

    // 3. Add security headers
    const headers = new Headers({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    });

    // 4. Return modified response with headers
    return null; // Allow request to proceed with added headers
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: error.message },
        { 
          status: 429,
          headers: {
            'Retry-After': String(error.retryAfter || 60)
          }
        }
      );
    }

    console.error('Security middleware error:', error);
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
  
  // Get IP from various headers
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;
  
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;
  
  // Get IP from request connection
  const remoteAddr = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  return remoteAddr;
}


// Input sanitization
export function sanitizeInput(input: string): string {
  // Remove any potential XSS content
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });

  // Additional custom sanitization
  return sanitized
    .trim()
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .replace(/[^\x20-\x7E\n]/g, ''); // Only allow printable ASCII and newlines
}

// API key validation
export function validateApiKey(apiKey: string | undefined): boolean {
  if (!apiKey) return false;
  
  // Check minimum length
  if (apiKey.length < 32) return false;
  
  // Check format (should start with 'sk-ant-' for Anthropic)
  if (!apiKey.startsWith('sk-ant-')) return false;
  
  // Check character set
  const validKeyFormat = /^[a-zA-Z0-9_-]+$/;
  return validKeyFormat.test(apiKey);
}

// Secure headers middleware
export function addSecureHeaders(headers: Headers): Headers {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  
  return headers;
}
