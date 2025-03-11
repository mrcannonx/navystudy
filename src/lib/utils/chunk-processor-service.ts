import { makeAIRequest } from '../ai-client';
import { Flashcard, isFlashcardResponse, isFlashcardsArray, isSummaryResponse } from '../types/chunk-types';
import { ContentType, SummaryFormat } from '../types';
import { extractContext } from './content-chunker';
import { combineChunks } from './result-combiner';

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // Base delay between retries in ms
const CHUNK_DELAY = 1000; // Delay between processing chunks

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  attempt: number = 1,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (attempt >= maxRetries) throw error;
    
    const delay = Math.min(BASE_DELAY * Math.pow(2, attempt - 1), 8000);
    console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
    onRetry?.(attempt, error as Error);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(operation, maxRetries, attempt + 1, onRetry);
  }
}

export async function processChunks(
  chunks: string[],
  type: ContentType,
  format?: SummaryFormat,
  onProgress?: (current: number, message?: string) => void
): Promise<any[]> {
  console.log(`Processing ${chunks.length} chunks of content...`);
  onProgress?.(0, `Starting to process ${chunks.length} chunks...`);

  const results = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    if (!chunk) {
      console.warn(`Skipping empty chunk ${i + 1}`);
      continue;
    }

    try {
      onProgress?.(i + 1, `Processing chunk ${i + 1} of ${chunks.length}...`);
      
      // Add delay between chunks to respect rate limits
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, CHUNK_DELAY));
      }

      const makeRequest = async () => {
        return await makeAIRequest(chunk, type, format, {
          chunkIndex: i,
          totalChunks: chunks.length,
          previousContext: i > 0 ? extractContext(chunks[i - 1]) : undefined
        });
      };

      const response = await retryWithBackoff(
        makeRequest,
        MAX_RETRIES,
        1,
        (attempt, error) => {
          onProgress?.(i + 1, `Retry ${attempt}/${MAX_RETRIES} for chunk ${i + 1}: ${error.message}`);
        }
      );

      if (!response.data) {
        throw new Error(`No data in response for chunk ${i + 1}`);
      }

      if (type === 'quiz') {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const validQuestions = response.data.slice(0, 3); // Take up to 3 questions per chunk
          results.push(...validQuestions);
        } else {
          // Try with reduced content
          const reducedContent = chunk.split('\n').slice(0, 5).join('\n');
          const retryResponse = await retryWithBackoff(
            async () => makeAIRequest(reducedContent, type, format, {
              chunkIndex: i,
              totalChunks: chunks.length
            }),
            2,
            1,
            (attempt, error) => {
              onProgress?.(i + 1, `Retry ${attempt}/2 with reduced content: ${error.message}`);
            }
          );

          if (Array.isArray(retryResponse.data) && retryResponse.data.length > 0) {
            const validQuestions = retryResponse.data.slice(0, 2);
            results.push(...validQuestions);
          }
        }
      } else if (type === 'summary') {
        results.push(response.data.summary);
      } else if (type === 'flashcards' && Array.isArray(response.data)) {
        results.push(...response.data);
      }
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
      onProgress?.(i + 1, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Continue processing other chunks instead of throwing
    }
  }

  if (results.length === 0) {
    throw new Error('No valid content was generated from any chunks');
  }

  return type === 'summary' ? [combineChunks(results)] : results;
}
