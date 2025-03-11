import { withRetry, handleApiError, getUserFriendlyErrorMessage } from '@/lib/api/error-handling';

// Optimal chunk size for Claude-3-haiku (about 75% of its context window)
const CHUNK_SIZE = 8000;
const CHUNK_OVERLAP = 200; // Add overlap between chunks to maintain context

export function chunkText(text: string): string[] {
  if (text.length <= CHUNK_SIZE) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = "";
  
  // Enhanced sentence splitting regex that better handles various punctuation and formatting
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)|\s*\n\s*\n\s*|\s*#{1,6}\s+[^\n]+|\s*[-•*]\s+[^\n]+/g) || [text];
  
  let lastChunkEndContext = ""; // Store the end of the previous chunk for context

  for (const sentence of sentences) {
    // If adding the sentence would exceed chunk size
    if ((currentChunk + sentence).length > CHUNK_SIZE) {
      if (currentChunk) {
        // Store the end of this chunk for context in the next one
        lastChunkEndContext = currentChunk.slice(-CHUNK_OVERLAP);
        chunks.push(currentChunk.trim());
      }
      // Start new chunk with overlap from previous chunk for context
      currentChunk = lastChunkEndContext + sentence;
    } else {
      currentChunk += sentence;
    }
  }

  // Add the final chunk if there's anything left
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  // Post-process chunks to ensure they maintain semantic boundaries
  return chunks
    .map(chunk => {
      // Ensure chunks don't break in the middle of markdown formatting
      const cleanedChunk = chunk.replace(/\*\*(?!\s*\*\*)[^*]*$/, '') // Clean incomplete bold
                               .replace(/`(?!\s*`)[^`]*$/, '')         // Clean incomplete code
                               .replace(/\[[^\]]*$/, '')               // Clean incomplete links
                               .trim();
      return cleanedChunk;
    })
    .filter(chunk => chunk.length > 0);
}

import { api } from '@/lib/api';

async function processSingleChunk(chunk: string, format: "bullets" | "tldr" | "qa"): Promise<string> {
  return withRetry(async () => {
    const { data } = await api.post('/api/v1/summarize', {
      text: chunk,
      format
    });
    return data.summary;
  }, {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 5000,
  });
}

export async function summarizeText(
  text: string, 
  format: "bullets" | "tldr" | "qa"
): Promise<string> {
  try {
    const chunks = chunkText(text);
    const summaries = await Promise.all(chunks.map(chunk => processSingleChunk(chunk, format)));
    return summaries.join('\n\n');
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}
