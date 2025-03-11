import Anthropic from '@anthropic-ai/sdk';

export class AnthropicClient {
  private client: Anthropic;
  private lastRequestTime: number = 0;
  private readonly minRequestInterval: number = 100; // Minimum time between requests in ms
  private readonly defaultModel = "claude-3-opus-20240229";

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL;
    
    if (!apiKey) {
      throw new Error('Anthropic API key is missing');
    }
    
    if (model && !model.startsWith('claude-')) {
      console.warn(`Warning: Invalid Anthropic model format "${model}". Using default model "${this.defaultModel}"`);
    }
    
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Get the Anthropic client instance
   */
  getClient(): Anthropic {
    return this.client;
  }

  /**
   * Get the model to use for requests
   */
  getModel(): string {
    return process.env.ANTHROPIC_MODEL?.startsWith('claude-') 
      ? process.env.ANTHROPIC_MODEL 
      : this.defaultModel;
  }

  /**
   * Wait for rate limit to avoid hitting API limits
   */
  async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
}