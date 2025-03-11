/**
 * Content validator service for AI generation requests
 * Handles validation and sanitization of user input
 */

import { ValidationError } from '@/lib/api/error-handling';

/**
 * Configuration options for content validation
 */
export interface ValidationOptions {
  maxContentLength?: number;
  minContentLength?: number;
  maxRequestSize?: number;
  rateLimitWindowMs?: number;
  maxRequestsPerWindow?: number;
  trustProxy?: boolean;
}

/**
 * Study content data structure
 */
export interface StudyContent {
  title: string;
  description?: string;
  material: string;
  type?: 'quiz' | 'flashcards';
}

/**
 * ContentValidator class for validating and sanitizing user input
 */
export class ContentValidator {
  /**
   * Validate study content against configured limits
   * @param content The study content to validate
   * @param options Validation options
   * @throws ValidationError if content fails validation
   */
  public validateStudyContent(
    content: StudyContent, 
    options: ValidationOptions = {}
  ): void {
    const {
      maxContentLength = 25000,
      minContentLength = 50
    } = options;
    
    // Check required fields
    if (!content.title || !content.material) {
      throw new ValidationError('Title and material are required fields');
    }
    
    // Validate content length
    if (content.material.length > maxContentLength) {
      throw new ValidationError(`Study material exceeds maximum length of ${maxContentLength} characters`);
    }
    
    if (content.material.length < minContentLength) {
      throw new ValidationError(`Study material must be at least ${minContentLength} characters`);
    }
    
    // Validate content type if provided
    if (content.type && !['quiz', 'flashcards'].includes(content.type)) {
      throw new ValidationError('Invalid content type. Must be "quiz" or "flashcards"');
    }
  }
  
  /**
   * Sanitize study content to prevent injection and other security issues
   * @param content The study content to sanitize
   * @returns Sanitized content
   */
  public sanitizeStudyContent(content: StudyContent): StudyContent {
    return {
      title: this.sanitizeString(content.title),
      description: content.description ? this.sanitizeString(content.description) : undefined,
      material: this.sanitizeString(content.material),
      type: content.type
    };
  }
  
  /**
   * Validate and sanitize content in one operation
   * @param content The content to validate and sanitize
   * @param options Validation options
   * @returns Validated and sanitized content
   * @throws ValidationError if content fails validation
   */
  public validateAndSanitize(
    content: StudyContent,
    options: ValidationOptions = {}
  ): StudyContent {
    this.validateStudyContent(content, options);
    return this.sanitizeStudyContent(content);
  }
  
  /**
   * Sanitize a string to prevent security issues
   * @param input String to sanitize
   * @returns Sanitized string
   */
  private sanitizeString(input: string): string {
    if (!input) return '';
    
    // Remove potential script tags and other dangerous content
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
    
    // Normalize newlines
    sanitized = sanitized.replace(/\r\n/g, '\n');
    
    // Trim whitespace
    return sanitized.trim();
  }
}

// Create and export default instance
export const contentValidator = new ContentValidator();