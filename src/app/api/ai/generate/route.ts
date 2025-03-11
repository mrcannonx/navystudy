import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { aiSecurityMiddleware } from '@/lib/middleware/ai-security';

import { rateLimiter } from './rate-limiter';
import { contentValidator } from './validator';
import { errorHandler } from './error-handler';
import { getSystemPrompt, generateUserPrompt } from './prompts';
import { queueService } from './queue-service';
import { contentProcessor } from '../services/content-processor';
import { diversitySelector } from '../services/diversity-selector';

// Initialize Anthropic client
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST handler for AI content generation
 */
export async function POST(req: NextRequest) {
  try {
    // Apply AI security middleware
    const securityCheck = await aiSecurityMiddleware(req);
    if (securityCheck) return securityCheck;

    // Check rate limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimiter.checkLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const { title, description, material, type } = await req.json();

    // Validate and sanitize content
    try {
      const validatedContent = contentValidator.validateAndSanitize(
        { title, description, material, type },
        {
          maxContentLength: 25000,
          minContentLength: 50,
          maxRequestSize: 1024 * 1024,
          rateLimitWindowMs: 60000,
          maxRequestsPerWindow: 5,
          trustProxy: true,
        }
      );

      // For smaller content, process directly without chunking
      if (validatedContent.material.length < 2000) {
        const systemPrompt = getSystemPrompt(type as 'quiz' | 'flashcards');
        const userPrompt = generateUserPrompt(
          type as 'quiz' | 'flashcards',
          validatedContent.title,
          validatedContent.description,
          validatedContent.material
        );

        const response = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 4096,
          messages: [
            { role: 'assistant', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
        });

        return NextResponse.json({
          success: true,
          content: response.content[0].type === 'text' ? response.content[0].text : '',
          type,
        });
      }
      
      // For larger content, use chunking and queuing
      return await queueService.enqueueRequest(
        validatedContent,
        type as 'quiz' | 'flashcards'
      );
      
    } catch (validationError) {
      return errorHandler.handleApiError(validationError);
    }
  } catch (error) {
    return errorHandler.handleApiError(error);
  }
}