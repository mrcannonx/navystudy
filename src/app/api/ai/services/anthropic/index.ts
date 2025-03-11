import { ContentType } from '@/lib/types';
import { AnthropicClient } from './client';
import { getSystemPrompt, getUserPrompt } from './prompts';
import { AnthropicRequestHandler } from './request-handler';

/**
 * Main service for interacting with Anthropic's Claude API
 */
export class AnthropicService {
  private client: AnthropicClient;
  private requestHandler: AnthropicRequestHandler;

  constructor() {
    this.client = new AnthropicClient();
    this.requestHandler = new AnthropicRequestHandler(this.client);
  }

  /**
   * Generate content based on the provided text and content type
   */
  async generateContent(content: string, type: ContentType): Promise<string> {
    console.log('Making request to Anthropic API...');
    return this.requestHandler.makeRequestWithRetry({
      system: getSystemPrompt(type),
      content: getUserPrompt(type, content),
      contentType: type
    });
  }

  /**
   * Generate a summary of the provided content in the specified format
   */
  async generateSummary(content: string, format: 'bullet' | 'tldr' | 'qa', chunkIndex: number = 0): Promise<string> {
    console.log(`[AnthropicService] Generating summary with format: ${format}`);
    return this.requestHandler.makeRequestWithRetry({
      system: getSystemPrompt('summary'),
      content: getUserPrompt('summary', content, format, chunkIndex),
      contentType: 'summary'
    });
  }
}

// Re-export types and utilities that might be needed by consumers
export * from './client';
export * from './prompts';
export * from './request-handler';