import { ContentType } from './types';

export function chunkContent(content: string, maxChunkSize: number = 4000): string[] {
  console.log(`Chunking content of length: ${content.length}`);
  
  // If content is small enough, return as single chunk
  if (content.length <= maxChunkSize) {
    return [content];
  }

  // Enhanced semantic split patterns
  const sectionPatterns = [
    /(?:\n\s*#{1,6}\s+[^\n]+)/,  // Markdown headers
    /(?:\n\s*\[\s*[^\]]+\s*\])/,  // Bracketed sections
    /(?:\n\s*\d+\.\s+[^\n]+)/,    // Numbered lists
    /(?:\n\s*[-•*]\s+[^\n]+)/,    // Bullet points
    /(?:\n\s*[A-Z][^.!?]+[:]\s+)/, // Topic sentences
    /(?:[.!?]+\s+)/               // Sentence boundaries
  ];
  
  // Split into initial sections using combined pattern
  const combinedPattern = new RegExp(sectionPatterns.map(p => p.source).join('|'), 'g');
  let sections = content.split(combinedPattern)
    .map(s => s.trim())
    .filter(s => s);
  
  // Keep section markers with their content
  const sectionMarkers = content.match(combinedPattern) || [];
  sections = sections.map((section, i) => 
    sectionMarkers[i] ? sectionMarkers[i] + '\n' + section : section
  );

  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const section of sections) {
    if ((currentChunk + '\n\n' + section).length <= maxChunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + section;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      
      // If section is too large, split it further
      if (section.length > maxChunkSize) {
        const subChunks = section
          .split(/(?<=[.!?])\s+/)
          .reduce((acc: string[], sentence: string) => {
            const lastChunk = acc[acc.length - 1];
            if (!lastChunk || (lastChunk + ' ' + sentence).length > maxChunkSize) {
              acc.push(sentence);
            } else {
              acc[acc.length - 1] = lastChunk + ' ' + sentence;
            }
            return acc;
          }, []);
        
        chunks.push(...subChunks.map(chunk => chunk.trim()));
      } else {
        currentChunk = section;
      }
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  
  // Log chunk information
  console.log(`Created ${chunks.length} chunks:`);
  chunks.forEach((chunk, index) => {
    console.log(`Chunk ${index + 1}: ${chunk.length} characters`);
  });
  
  return chunks;
}

export function preprocessContent(content: string): string {
  console.log('Original content length:', content.length);
  
  const processed = content
    .trim()
    // Normalize whitespace while preserving paragraph breaks
    .replace(/[\t\f\r ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    // Only remove truly problematic characters, keep more punctuation
    .replace(/[^\w\s.,?!;:()\[\]{}"'\-–—<>@#$%&*+=`~/\\|]+/g, "")
    // Clean up any remaining double spaces
    .replace(/\s+/g, " ")
    .trim();

  // Increase token limit to handle more content (Claude can handle up to 200k characters)
  const maxLength = 100000;
  const result = processed.slice(0, maxLength);
  
  console.log('Processed content length:', result.length);
  if (result.length < content.length) {
    console.log('Content was truncated from', content.length, 'to', result.length, 'characters');
  }
  
  return result;
}

export function getProcessingMessage(length: number, type: ContentType): string | undefined {
  const contentType = type === "quiz" ? "quiz" : "flashcards";
  const chunks = Math.ceil(length / 2500); // Match new default chunk size of 2500
  const estimatedTime = chunks * 3; // Increased time estimate to 3 minutes per chunk

  if (chunks > 1) {
    return `Processing ${length} characters in ${chunks} chunks (estimated time: ${estimatedTime} minutes)... Content will be analyzed in parts for comprehensive ${contentType} generation.`;
  }
  if (length > 1000) {
    return `Generating ${contentType} from ${length} characters (estimated time: 1-2 minutes)...`;
  }
  return `Generating ${contentType} from ${length} characters...`;
}
