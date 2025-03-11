import { chunkContent, preprocessContent, processChunks } from '../utils/chunk-processor';

interface SummaryGeneratorOptions {
  maxChunkSize?: number;
  onProgress?: (current: number, message?: string) => void;
}

export async function generateSummary(
  content: string,
  options: SummaryGeneratorOptions = {}
): Promise<string> {
  try {
    // Preprocess content
    const processedContent = preprocessContent(content);
    if (!processedContent) {
      throw new Error('Content preprocessing failed');
    }

    // Chunk content
    const chunks = chunkContent(processedContent, options.maxChunkSize || 2500);
    if (!chunks.length) {
      throw new Error('Content chunking failed');
    }

    // Process chunks to generate summary
    const summaryParts = await processChunks(chunks, 'summary', undefined, options.onProgress);

    // Combine summary parts
    const combinedSummary = summaryParts.join('\n\n');
    if (!combinedSummary.trim()) {
      throw new Error('No valid summary was generated');
    }

    return combinedSummary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}
