import Anthropic from '@anthropic-ai/sdk';
import { TextBlock, isTextBlock } from '../../types';
import { AnthropicClient } from './client';
import { getRetryContext } from './prompts';

export class AnthropicRequestHandler {
  private client: AnthropicClient;

  constructor(client: AnthropicClient) {
    this.client = client;
  }

  /**
   * Make a request to the Anthropic API with retry logic
   */
  async makeRequestWithRetry(params: {
    system: string;
    content: string;
    maxRetries?: number;
    contentType?: string;
  }): Promise<string> {
    const maxRetries = params.maxRetries || 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.client.waitForRateLimit();
        
        // Adjust temperature and add retry context for subsequent attempts
        const temperature = attempt === 1 ? 0.7 : Math.max(0.3, 0.7 - (attempt * 0.2));
        const retryContext = getRetryContext(attempt);
        
        // Use Claude 3 Opus specifically for NavAdmin and summarizer
        let model = this.client.getModel();
        if (params.contentType === 'navadmin' || params.contentType === 'summary') {
          model = "claude-3-opus-20240229";
          console.log(`Using Claude 3 Opus model for ${params.contentType} content`);
        }
        
        const response = await this.client.getClient().messages.create({
          model: model,
          max_tokens: 4000,
          temperature,
          system: params.system,
          messages: [{
            role: "user",
            content: retryContext + params.content
          }]
        });

        // Check if response and content exist
        if (!response || !response.content || !Array.isArray(response.content) || response.content.length === 0) {
          console.error('Invalid response structure from Anthropic API:', JSON.stringify(response, null, 2));
          throw new Error('Invalid response structure from Anthropic API');
        }

        const firstContent = response.content[0];
        
        // More robust checking of the response format
        if (!firstContent || typeof firstContent !== 'object') {
          console.error('Invalid content format in Anthropic response:', JSON.stringify(firstContent, null, 2));
          throw new Error('Invalid content format in Anthropic response');
        }
        
        if (!isTextBlock(firstContent)) {
          console.error('Unexpected response format from AI:', JSON.stringify(firstContent, null, 2));
          throw new Error('Unexpected response format from AI');
        }

        return firstContent.text;
      } catch (error) {
        console.error(`Attempt ${attempt}/${maxRetries} failed:`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          type: error instanceof Error ? error.constructor.name : 'Unknown',
          response: error instanceof Error && 'response' in error ? (error as any).response : undefined,
          stack: error instanceof Error ? error.stack : undefined
        });

        lastError = error as Error;
        
        if (attempt < maxRetries) {
          const backoffTime = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
          console.log(`Retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }

    const errorDetails = lastError instanceof Error ? {
      message: lastError.message,
      type: lastError.constructor.name,
      response: 'response' in lastError ? (lastError as any).response : undefined,
      stack: lastError.stack
    } : { message: 'Unknown error' };

    throw new Error(`Failed after ${maxRetries} attempts. Last error: ${JSON.stringify(errorDetails, null, 2)}`);
  }
}