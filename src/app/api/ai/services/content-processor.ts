/**
 * Content processor service for AI content generation
 * Handles preprocessing, chunking, and processing of content
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { getSystemPrompt, generateUserPrompt } from '../generate/prompts';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * ContentProcessor class for processing text content for AI generation
 */
export class ContentProcessor {
  /**
   * Preprocess content to optimize it for chunking and processing
   * @param content Raw text content to preprocess
   * @returns Preprocessed content
   */
  public preprocessContent(content: string): string {
    // Remove excessive whitespace
    let processed = content.replace(/\s+/g, ' ');
    
    // Normalize newlines
    processed = processed.replace(/\r\n/g, '\n');
    
    // Ensure section breaks are preserved
    processed = processed.replace(/\n\s*\n/g, '\n\n');
    
    // Remove any control characters
    processed = processed.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    return processed.trim();
  }
  
  /**
   * Chunk content into manageable pieces for processing
   * @param content Preprocessed content to chunk
   * @param maxTokensPerChunk Maximum tokens per chunk
   * @returns Array of content chunks
   */
  public chunkContent(content: string, maxTokensPerChunk: number = 2000): string[] {
    // Split content by double newlines (paragraph breaks)
    const paragraphs = content.split('\n\n');
    
    const chunks: string[] = [];
    let currentChunk = '';
    let currentTokenCount = 0;
    let topics = '';
    
    // Check if content starts with topics
    if (content.startsWith('TOPICS:')) {
      const topicEndIndex = content.indexOf('\n\n');
      if (topicEndIndex > 0) {
        topics = content.substring(7, topicEndIndex).trim();
        // Remove topics from content to process
        content = content.substring(topicEndIndex + 2);
      }
    }
    
    // Process paragraphs into chunks
    for (const paragraph of paragraphs) {
      // Rough token estimation (4 chars ≈ 1 token)
      const paragraphTokens = Math.ceil(paragraph.length / 4);
      
      if (currentTokenCount + paragraphTokens > maxTokensPerChunk && currentChunk.length > 0) {
        // Add topics to chunk if present
        if (topics && !currentChunk.startsWith('TOPICS:')) {
          currentChunk = `TOPICS: ${topics}\n\n${currentChunk}`;
        }
        
        chunks.push(currentChunk);
        currentChunk = paragraph;
        currentTokenCount = paragraphTokens;
      } else {
        if (currentChunk.length > 0) {
          currentChunk += '\n\n';
        }
        currentChunk += paragraph;
        currentTokenCount += paragraphTokens;
      }
    }
    
    // Add the last chunk if not empty
    if (currentChunk.length > 0) {
      // Add topics to chunk if present
      if (topics && !currentChunk.startsWith('TOPICS:')) {
        currentChunk = `TOPICS: ${topics}\n\n${currentChunk}`;
      }
      
      chunks.push(currentChunk);
    }
    
    return chunks;
  }
  
  /**
   * Process content with chunking for large content
   * @param title Content title
   * @param description Optional content description
   * @param material Content material
   * @param type Content type (quiz or flashcards)
   * @returns Processed content result
   */
  public async processContentWithChunking(
    title: string,
    description: string | undefined,
    material: string,
    type: 'quiz' | 'flashcards'
  ): Promise<any[]> {
    // Preprocess content
    const preprocessed = this.preprocessContent(material);
    
    // Generate chunks intelligently
    const maxTokensPerChunk = 2000; // Conservative token estimation
    const chunks = this.chunkContent(preprocessed, maxTokensPerChunk);
    console.log(`Generated ${chunks.length} chunks for processing`);
    
    // Process chunks
    const results = await this.processChunks(
      chunks.map((chunk, index) => {
        // Extract topics if present at the beginning of the chunk
        let topics = "";
        let processedChunk = chunk;
        
        if (chunk.startsWith("TOPICS:")) {
          const topicEndIndex = chunk.indexOf("\n\n");
          if (topicEndIndex > 0) {
            topics = chunk.substring(7, topicEndIndex).trim();
            processedChunk = chunk.substring(topicEndIndex + 2);
          }
        }
        
        // Create user prompt for this chunk
        return generateUserPrompt(
          type,
          title,
          description,
          processedChunk,
          true,
          index,
          topics
        );
      }),
      type
    );
    
    return results;
  }
  
  /**
   * Process a collection of content chunks
   * @param chunkPrompts Array of prepared user prompts for each chunk
   * @param type Content type (quiz or flashcards)
   * @param retryCount Optional retry count for failed chunks
   * @param progressCallback Optional callback for progress tracking
   * @returns Array of processed results from all chunks
   */
  public async processChunks(
    chunkPrompts: string[],
    type: 'quiz' | 'flashcards',
    retryCount: number = 2,
    progressCallback?: (current: number, message?: string) => void
  ): Promise<any[]> {
    const systemPrompt = getSystemPrompt(type);
    const results: any[] = [];
    
    // Process each chunk in sequence
    for (let i = 0; i < chunkPrompts.length; i++) {
      const userPrompt = chunkPrompts[i];
      
      // Update progress if callback provided
      if (progressCallback) {
        progressCallback(i, `Processing chunk ${i + 1}/${chunkPrompts.length}`);
      }
      
      try {
        // Process chunk with AI
        const response = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 4096,
          messages: [
            { role: 'assistant' as const, content: systemPrompt },
            { role: 'user' as const, content: userPrompt }
          ],
          temperature: 0.7,
        });
        
        const responseText = response.content[0].type === 'text' 
          ? response.content[0].text 
          : '';
        
        // Parse response as JSON
        let parsedItems: any[] = [];
        try {
          // Extract JSON array from response
          const jsonMatch = responseText.match(/\[\s*\{[\s\S]+\}\s*\]/);
          if (jsonMatch) {
            parsedItems = JSON.parse(jsonMatch[0]);
          } else {
            console.warn(`Failed to extract JSON from chunk ${i + 1}`);
            continue;
          }
        } catch (parseError) {
          console.error(`Failed to parse JSON from chunk ${i + 1}:`, parseError);
          
          // Retry with more explicit instructions if needed
          if (retryCount > 0) {
            const retryPrompt = `${userPrompt}\n\nIMPORTANT: Your previous response couldn't be parsed correctly. Please ensure your response is VALID JSON starting with '[' and ending with ']'. Do not include any other text, markdown, or code block formatting.`;
            
            const retryResponse = await anthropic.messages.create({
              model: 'claude-3-opus-20240229',
              max_tokens: 4096,
              messages: [
                { role: 'assistant' as const, content: systemPrompt },
                { role: 'user' as const, content: retryPrompt }
              ],
              temperature: 0.7,
            });
            
            const retryText = retryResponse.content[0].type === 'text' 
              ? retryResponse.content[0].text 
              : '';
            
            try {
              // Try to extract JSON again
              const retryJsonMatch = retryText.match(/\[\s*\{[\s\S]+\}\s*\]/);
              if (retryJsonMatch) {
                parsedItems = JSON.parse(retryJsonMatch[0]);
              }
            } catch (retryError) {
              console.error(`Retry failed for chunk ${i + 1}`);
              continue;
            }
          }
        }
        
        // Add valid items to results
        results.push(...parsedItems);
        
        // Report progress
        if (progressCallback) {
          progressCallback(i + 1, `Completed chunk ${i + 1}/${chunkPrompts.length} (${parsedItems.length} items)`);
        }
        
      } catch (error) {
        console.error(`Error processing chunk ${i + 1}:`, error);
        
        // Retry if we have retries left
        if (retryCount > 0) {
          chunkPrompts.push(userPrompt); // Add to end of queue
          
          if (progressCallback) {
            progressCallback(i, `Requeueing chunk ${i + 1} after error`);
          }
        }
      }
    }
    
    return results;
  }
  
  /**
   * Process small content directly without chunking
   * @param title Content title
   * @param description Optional content description
   * @param material Content material
   * @param type Content type (quiz or flashcards)
   * @returns Processed content result
   */
  public async processSmallContent(
    title: string,
    description: string | undefined,
    material: string,
    type: 'quiz' | 'flashcards'
  ): Promise<any[]> {
    const systemPrompt = getSystemPrompt(type);
    const userPrompt = generateUserPrompt(type, title, description, material);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4096,
      messages: [
        { role: 'assistant' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt }
      ],
      temperature: 0.7,
    });
    
    const responseText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';
    
    // Parse JSON from response
    try {
      // Extract JSON array from response
      const jsonMatch = responseText.match(/\[\s*\{[\s\S]+\}\s*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse JSON from response:', error);
    }
    
    return [];
  }
}

// Create and export default instance
export const contentProcessor = new ContentProcessor();