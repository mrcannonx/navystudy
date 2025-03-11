import Anthropic from '@anthropic-ai/sdk';
import { StreamProcessor } from '@/lib/summarizer/stream-processor';
import { SummarizerCache } from './cache';
import { SUMMARIZER_CONFIG } from './config';
import { formatPrompts } from './prompts';
import { ServiceError } from './error-handling';
import { SummaryFormat } from './types';

export class SummarizerService {
  private static instance: SummarizerService;
  private anthropic: Anthropic;
  private streamProcessor: StreamProcessor;

  private constructor() {
    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'ROTATE_THIS_KEY') {
      throw new ServiceError('Anthropic API key is not properly configured. Please set up a valid API key.');
    }

    this.anthropic = new Anthropic({ apiKey });
    this.streamProcessor = new StreamProcessor();

    console.log('[Summarizer] Initialized Anthropic client with API key:', {
      exists: !!apiKey,
      length: apiKey.length,
      prefix: apiKey.substring(0, 7)
    });
  }

  public static getInstance(): SummarizerService {
    if (!SummarizerService.instance) {
      SummarizerService.instance = new SummarizerService();
    }
    return SummarizerService.instance;
  }

  public async processFile(file: File, format: SummaryFormat): Promise<string> {
    const chunks = await this.streamProcessor.processLargeFile(file);
    const content = chunks.join(' ');
    return this.summarizeText(content, format);
  }

  public async summarizeText(text: string, format: SummaryFormat): Promise<string> {
    try {
      // Check cache first
      const cachedSummary = await SummarizerCache.get(text);
      if (cachedSummary) {
        console.log('[Summarizer] Cache hit for summary');
        return cachedSummary;
      }

      console.log('[Summarizer] Cache miss, attempting to generate summary');
      console.log('[Summarizer] Creating Anthropic request:', {
        format,
        textLength: text.length,
        model: SUMMARIZER_CONFIG.model
      });
      
      const response = await this.anthropic.messages.create({
        model: SUMMARIZER_CONFIG.model,
        max_tokens: SUMMARIZER_CONFIG.maxTokens,
        system: formatPrompts[format].system,
        messages: [
          {
            role: 'user',
            content: formatPrompts[format].user(text)
          }
        ]
      });
      
      console.log('[Summarizer] Received Anthropic response:', {
        hasContent: !!response.content,
        contentLength: response.content?.length
      });
      
      const summary = response.content[0].type === 'text' ? response.content[0].text : '';
      
      // Cache the result
      await SummarizerCache.set(text, summary);
      console.log('[Summarizer] Cached summary result');
      
      return summary;
    } catch (error) {
      console.error('[Summarizer] Error in summarizeText:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        format,
        textLength: text.length
      });
      throw error;
    }
  }
}

// Export a singleton instance
export const summarizerService = SummarizerService.getInstance();
