import { NextRequest, NextResponse } from 'next/server';
import { ValidationError, ServiceError } from './error-handling';
import { validateApiKey, validateFileSize, SUMMARIZER_CONFIG } from './config';
import { SummaryFormat, ApiResponse } from './types';
import DOMPurify from 'isomorphic-dompurify';

export async function validateRequest(req: NextRequest): Promise<void> {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as SummaryFormat;

    if (!file) {
      throw new ValidationError('No file provided');
    }

    if (!validateFileSize(file.size)) {
      throw new ValidationError(
        `File size exceeds maximum limit of ${Math.round(SUMMARIZER_CONFIG.maxFileSize / (1024 * 1024))}MB`
      );
    }

    validateFormat(format);
  } else if (contentType.includes('application/json')) {
    const body = await req.json();
    
    if (!body.text) {
      throw new ValidationError('Text is required');
    }

    validateFormat(body.format);
  } else {
    throw new ValidationError('Unsupported content type');
  }
}

export function validateFormat(format: unknown): asserts format is SummaryFormat {
  if (!format || !['bullets', 'tldr', 'qa'].includes(format as string)) {
    throw new ValidationError('Valid format (bullets, tldr, or qa) is required');
  }
}

export function validateApiKeyMiddleware(): void {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  
  console.log('[Summarizer] Validating API key:', {
    exists: !!apiKey,
    length: apiKey?.length,
    prefix: apiKey?.substring(0, 7)
  });

  if (!validateApiKey(apiKey)) {
    throw new ServiceError(
      'Invalid Anthropic API key configuration. The API key should start with "sk-ant-" and be at least 32 characters long.',
      503
    );
  }
}

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim());
}

export async function applyMiddleware(req: NextRequest): Promise<ApiResponse | null> {
  try {
    await validateRequest(req);
    validateApiKeyMiddleware();
    return null; // Indicates middleware passed
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof ServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { 
        error: 'Middleware error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
