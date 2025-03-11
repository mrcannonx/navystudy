export function chunkNavadminContent(content: string, maxChunkSize: number = 2000, overlapPercent: number = 20): string[] {
  if (!content) return [];

  // Define section patterns specific to NAVADMIN format
  const sectionPatterns = [
    // NAVADMIN header sections
    /(?:\n\s*NAVADMIN\s+\d+\/\d+\s*)/i,
    // RTTUZYUW patterns (message routing)
    /(?:\n\s*RTTUZYUW\s+[^\n]+)/i,
    // FM/TO/INFO sections
    /(?:\n\s*(?:FM|TO|INFO)\s+[^\n]+)/i,
    // Subject line
    /(?:\n\s*SUBJ(?:ECT)?[:\/]?\s+[^\n]+)/i,
    // Reference sections
    /(?:\n\s*REF(?:ERENCE)?[S]?[:\/]?\s+[^\n]+)/i,
    // Numbered paragraphs (common in NAVADMINs)
    /(?:\n\s*\d+\.\s+[^\n]+)/,
    // Lettered paragraphs
    /(?:\n\s*[A-Z]\.\s+[^\n]+)/,
    // POC (Point of Contact) sections
    /(?:\n\s*(?:POC|POINT OF CONTACT)[S]?[:\/]?\s+[^\n]+)/i,
    // Classification markings
    /(?:\n\s*(?:UNCLAS|UNCLASSIFIED|CONFIDENTIAL|SECRET|TOP SECRET)[^\n]*)/i
  ];

  // Split content into initial sections
  const combinedPattern = new RegExp(sectionPatterns.map(p => p.source).join('|'), 'g');
  let sections = content.split(combinedPattern).filter(Boolean);
  const sectionMarkers = content.match(combinedPattern) || [];

  // Recombine section markers with their content
  sections = sections.map((section, i) => 
    (sectionMarkers[i] || '') + '\n' + section.trim()
  ).filter(s => s.trim());

  // Process sections into overlapping chunks
  const chunks: string[] = [];
  let currentChunk = '';
  let contextBuffer = ''; // Store context from previous chunks
  const overlapSize = Math.floor(maxChunkSize * (overlapPercent / 100));

  for (const section of sections) {
    // If adding this section would exceed maxChunkSize
    if (currentChunk && (currentChunk.length + section.length > maxChunkSize)) {
      // Store the current chunk
      chunks.push(currentChunk.trim());
      
      // Calculate overlap from current chunk for next chunk
      const contentToOverlap = currentChunk.length > overlapSize 
        ? currentChunk.substring(currentChunk.length - overlapSize) 
        : currentChunk;
        
      // Keep NAVADMIN context from the previous chunk
      contextBuffer = extractNavadminContext(currentChunk);
      
      // Start new chunk with context and overlap
      currentChunk = contextBuffer + '\n\n' + contentToOverlap + '\n\n' + section;
    } else {
      // Add section to current chunk
      currentChunk += (currentChunk ? '\n\n' : '') + section;
    }
  }

  // Add the final chunk if not empty
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function extractNavadminContext(chunk: string, maxContextLength: number = 300): string {
  // Extract key information from the chunk to provide context
  const lines = chunk.split('\n');
  const contextLines = [];
  
  for (const line of lines) {
    // Look for important NAVADMIN information
    if (
      line.match(/NAVADMIN\s+\d+\/\d+/i) || // NAVADMIN number
      line.match(/(?:FM|TO|INFO)\s+/i) || // Sender/recipient
      line.match(/SUBJ(?:ECT)?[:\/]?\s+/i) || // Subject line
      line.match(/REF(?:ERENCE)?[S]?[:\/]?\s+/i) || // References
      line.match(/^\d+\.\s+/) || // Numbered paragraphs
      line.match(/^[A-Z]\.\s+/) || // Lettered paragraphs
      line.match(/(?:UNCLAS|UNCLASSIFIED|CONFIDENTIAL|SECRET|TOP SECRET)/i) // Classification
    ) {
      contextLines.push(line.trim());
    }
  }

  // Select the most relevant context lines while staying under maxContextLength
  let context = '';
  for (const line of contextLines) {
    if ((context + '\n' + line).length <= maxContextLength) {
      context += (context ? '\n' : '') + line;
    } else {
      break;
    }
  }

  return context ? 'Previous Context:\n' + context : '';
}

export function preprocessNavadminContent(content: string): string {
  if (!content) return '';

  // Normalize line endings and spacing
  content = content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/\t/g, '    ') // Convert tabs to spaces
    .trim();

  return content;
}