import { SUMMARIZER_CONFIG } from '@/config/summarizer';

export interface StreamConfig {
  chunkSize: number;
  maxBatchSize: number;
}

export class StreamProcessor {
  private config: StreamConfig;

  constructor(config: StreamConfig = {
    chunkSize: SUMMARIZER_CONFIG.chunkSize,
    maxBatchSize: 5 // Default to processing 5 chunks at a time
  }) {
    this.config = config;
  }

  async processLargeFile(file: File): Promise<string[]> {
    const chunks: string[] = [];
    let offset = 0;
    
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + this.config.chunkSize);
      const text = await this.readChunk(chunk);
      chunks.push(text);
      offset += this.config.chunkSize;
    }

    return chunks;
  }

  private async readChunk(chunk: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(chunk);
    });
  }

  async processBatchedChunks(chunks: string[]): Promise<string[]> {
    const results: string[] = [];
    
    for (let i = 0; i < chunks.length; i += this.config.maxBatchSize) {
      const batch = chunks.slice(i, i + this.config.maxBatchSize);
      const batchResults = await Promise.all(
        batch.map(chunk => this.processChunk(chunk))
      );
      results.push(...batchResults);
    }

    return results;
  }

  private async processChunk(chunk: string): Promise<string> {
    // This will be replaced with actual summarization logic
    // For now, just return the chunk for testing
    return chunk;
  }
}
