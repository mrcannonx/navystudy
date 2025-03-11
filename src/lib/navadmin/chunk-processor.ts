import { AnthropicService } from '@/app/api/ai/services/anthropic';
import { extractNavadminContext } from './content-chunker';

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // Base delay between retries in ms
const CHUNK_DELAY = 1000; // Delay between processing chunks

/**
 * Retry an operation with exponential backoff
 */
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

/**
 * Process NAVADMIN chunks and combine the results
 */
export async function processNavadminChunks(
  chunks: string[],
  anthropicService: AnthropicService,
  onProgress?: (current: number, message?: string) => void
): Promise<string> {
  console.log(`Processing ${chunks.length} NAVADMIN chunks...`);
  onProgress?.(0, `Starting to process ${chunks.length} chunks...`);

  const results: string[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    if (!chunk) {
      console.warn(`Skipping empty chunk ${i + 1}`);
      continue;
    }

    try {
      // Calculate progress percentage (0-100)
      const progressPercent = Math.round((i / chunks.length) * 100);
      onProgress?.(progressPercent, `Processing chunk ${i + 1} of ${chunks.length}...`);
      
      // Add delay between chunks to respect rate limits
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, CHUNK_DELAY));
      }

      // Create a custom prompt for NAVADMIN formatting
      const navadminPrompt = createNavadminPrompt(chunk, i, chunks.length, i > 0 ? extractNavadminContext(chunks[i - 1]) : undefined);

      const makeRequest = async () => {
        return await anthropicService.generateContent(navadminPrompt, 'navadmin');
      };

      const response = await retryWithBackoff(
        makeRequest,
        MAX_RETRIES,
        1,
        (attempt, error) => {
          onProgress?.(progressPercent, `Retry ${attempt}/${MAX_RETRIES} for chunk ${i + 1}: ${error.message}`);
        }
      );

      results.push(response);
      
      // Update progress after each successful chunk processing
      const updatedProgress = Math.round(((i + 1) / chunks.length) * 100);
      onProgress?.(updatedProgress, `Completed chunk ${i + 1} of ${chunks.length}`);
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
      onProgress?.(Math.round((i / chunks.length) * 100), `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Continue processing other chunks instead of throwing
    }
  }

  if (results.length === 0) {
    throw new Error('No valid content was generated from any chunks');
  }

  // Combine the results
  return combineNavadminChunks(results, chunks.length);
}

/**
 * Create a prompt for NAVADMIN formatting
 */
function createNavadminPrompt(
  content: string,
  chunkIndex: number,
  totalChunks: number,
  previousContext?: string
): string {
  const isFirstChunk = chunkIndex === 0;
  const isLastChunk = chunkIndex === totalChunks - 1;
  const chunkInfo = totalChunks > 1 ? `[CHUNK ${chunkIndex + 1}/${totalChunks}]` : '';
  
  let prompt = `
FORMAT THIS NAVADMIN INTO WELL-STRUCTURED HTML WITH TAILWIND CSS CLASSES:

${chunkInfo ? `${chunkInfo} - ` : ''}Follow these guidelines:
1. Identify and extract key sections: header information, subject, references, main content, etc.
2. Format the content with proper HTML structure using semantic elements
3. Apply appropriate styling classes for readability
4. Preserve all information from the original NAVADMIN
5. Organize content logically with clear section headings
6. Make lists and tables properly formatted and easy to read
7. Highlight important information
`;

  if (totalChunks > 1) {
    prompt += `
IMPORTANT: This is ${isFirstChunk ? 'the first' : isLastChunk ? 'the last' : 'an intermediate'} chunk of a larger NAVADMIN document.
${!isFirstChunk ? 'Continue the formatting from previous chunks.' : ''}
${!isLastChunk ? 'This chunk will be followed by additional content.' : ''}

CRITICAL INSTRUCTIONS FOR MULTI-CHUNK PROCESSING:
- ${isFirstChunk ? 'Include the full HTML document structure with DOCTYPE, html, head, and body tags.' : 'Do NOT include DOCTYPE, html, head tags, or opening body tag.'}
- ${isLastChunk ? 'Include the closing body and html tags.' : 'Do NOT include closing body or html tags.'}
- Format your chunk as if it will be directly concatenated with other chunks.
- Do NOT repeat header information that was already in previous chunks.
- Do NOT include "Chunk X of Y" or any other chunk indicators in the output.
`;
  }

  if (previousContext) {
    prompt += `
${previousContext}
`;
  }

  prompt += `
NAVADMIN CONTENT:
${content}

RETURN ONLY THE FORMATTED HTML WITH NO EXPLANATIONS OR MARKDOWN.
`;

  return prompt;
}

/**
 * Combine NAVADMIN chunks into a single HTML document
 */
export function combineNavadminChunks(chunks: string[], totalChunks: number): string {
  if (chunks.length === 1) return chunks[0];
  
  // For multiple chunks, we need to combine them properly
  let combinedHtml = '';
  
  // Extract the document structure from the first chunk
  const firstChunk = chunks[0];
  const docStructure = firstChunk.match(/(<!DOCTYPE html>[\s\S]*?<body[\s\S]*?>)([\s\S]*?)(<\/body>[\s\S]*?<\/html>)/i);
  
  if (!docStructure) {
    // If we can't extract the structure, try a simpler approach
    const mainContentDiv = /<div[^>]*?id="navadmin-content"[^>]*?>([\s\S]*?)<\/div>/i;
    
    // Extract content from each chunk
    const contents = chunks.map(chunk => {
      const match = chunk.match(mainContentDiv);
      return match ? match[1] : chunk;
    });
    
    // Combine the contents
    return `<div id="navadmin-content" class="prose prose-blue max-w-none dark:prose-invert">
      ${contents.join('\n')}
    </div>`;
  }
  
  // Extract the header, content, and footer
  const [_, docHeader, firstContent, docFooter] = docStructure;
  
  // Start with the document header
  combinedHtml += docHeader;
  
  // Add content from all chunks
  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    
    // Remove any "Previous Context" sections
    chunk = chunk.replace(/Previous Context:[^]*?\n\n/, '');
    
    // Extract just the content part
    let content = chunk;
    
    if (i === 0) {
      // For first chunk, we already extracted the content
      content = firstContent;
    } else {
      // For other chunks, extract content between body tags
      const contentMatch = chunk.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
      if (contentMatch) {
        content = contentMatch[1];
      } else {
        // Try to extract content from a main div
        const divMatch = chunk.match(/<div[^>]*?id="navadmin-content"[^>]*?>([\s\S]*?)<\/div>/i);
        if (divMatch) {
          content = divMatch[1];
        }
      }
    }
    
    // Remove duplicate headers that might appear in subsequent chunks
    if (i > 0) {
      // Remove potential duplicate headers (NAVADMIN number, date, etc.)
      content = content.replace(/<h1[^>]*>NAVADMIN[\s\S]*?<\/h1>/i, '');
      content = content.replace(/<div[^>]*class="[^"]*header[^"]*"[^>]*>[\s\S]*?<\/div>/i, '');
    }
    
    combinedHtml += content;
  }
  
  // Add the document footer
  combinedHtml += docFooter;
  
  return combinedHtml;
}

/**
 * Get a processing message for progress updates
 */
export function getNavadminProcessingMessage(current: number, total: number): string {
  return `Processing NAVADMIN chunk ${current} of ${total}...`;
}