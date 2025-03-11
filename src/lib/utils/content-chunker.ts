export function chunkContent(content: string, maxChunkSize: number = 1500, overlapPercent: number = 30): string[] {
  if (!content) return [];

  // Define section patterns for technical documentation with expanded technical patterns
  const sectionPatterns = [
    // Major sections with headers
    /(?:\n\s*#{1,6}\s+[^\n]+)/,
    // Numbered sections and lists
    /(?:\n\s*\d+[\.)]\s+[^\n]+)/,
    // Technical specifications and part numbers
    /(?:\n\s*[A-Z][^.!?]+[:]\s+)/,
    // Procedural steps
    /(?:\n\s*[-•*]\s+[^\n]+)/,
    // Part numbers and codes
    /(?:\n\s*(?:Part|Code|Type|Model|Number|Serial|ID)\s+[^\n]+)/,
    // Maintenance procedures
    /(?:\n\s*(?:Maintenance|Repair|Service|Install|Remove|Inspect|Test|Check|Verify|Monitor)\s+[^\n]+)/,
    // Naval terms and ranks
    /(?:\n\s*(?:Officer|Petty Officer|Chief|Commander|Captain|Lieutenant|Admiral|Sailor|Rating)\s+[^\n]+)/,
    // Technical terminology
    /(?:\n\s*(?:Equipment|System|Procedure|Operation|Qualification|Standard|Requirement|Criteria)\s+[^\n]+)/
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
  let overlapBuffer = ''; // Store content for overlapping
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
        
      // Keep technical context from the previous chunk
      contextBuffer = extractContext(currentChunk);
      
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

  // Extract and include topic tags for each chunk
  return chunks.map(chunk => {
    const topics = extractTopics(chunk);
    return topics ? `TOPICS: ${topics}\n\n${chunk}` : chunk;
  });
}

export function extractContext(chunk: string, maxContextLength: number = 300): string {
  // Extract key information from the chunk to provide context
  const lines = chunk.split('\n');
  const contextLines = [];
  
  for (const line of lines) {
    // Look for important technical information with expanded patterns
    if (
      line.match(/(?:Part|Code|Type|Model|Number|Serial|ID|Maintenance|Repair|Service|Install|Remove|Inspect|Test|Check|Verify|Monitor)/i) ||
      line.match(/(?:Officer|Petty Officer|Chief|Commander|Captain|Lieutenant|Admiral|Sailor|Rating)/i) ||
      line.match(/(?:Equipment|System|Procedure|Operation|Qualification|Standard|Requirement|Criteria)/i) ||
      line.match(/^[A-Z].*[:]/) || // Section headers
      line.match(/^\d+[\.)]\s+/) || // Numbered items
      line.match(/^[-•*]\s+/) // Bulleted items
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

/**
 * Extract topic categories from chunk content to facilitate better organization
 * and spaced repetition learning
 */
export function extractTopics(chunk: string): string {
  const topicMap: {[key: string]: number} = {};
  
  // Naval/military topic keywords and their related terms
  const topicPatterns = {
    'Maintenance': /maintenance|repair|service|troubleshoot|fix|inspect|check/i,
    'Supply': /supply|inventory|requisition|part|stock|order|material|consumable/i,
    'Personnel': /officer|petty officer|chief|sailor|personnel|staff|crew|rating/i,
    'Equipment': /equipment|tool|machinery|system|device|apparatus|gear|cese/i,
    'Procedures': /procedure|process|protocol|step|instruction|guideline|method/i,
    'Safety': /safety|hazard|risk|caution|warning|danger|protection|ppe/i,
    'Administration': /administration|paperwork|form|document|record|report|log/i,
    'Operations': /operation|mission|task|deployment|exercise|evolution|maneuver/i,
    'Technical': /technical|specification|parameter|measurement|tolerance|standard/i,
    'Training': /training|qualification|certification|course|education|instruction/i
  };

  // Count occurrences of each topic
  const text = chunk.toLowerCase();
  Object.entries(topicPatterns).forEach(([topic, pattern]) => {
    const matches = text.match(pattern);
    if (matches) {
      topicMap[topic] = matches.length;
    }
  });

  // Get top 3 topics
  const sortedTopics = Object.entries(topicMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);

  return sortedTopics.length > 0 ? sortedTopics.join(', ') : '';
}

export function preprocessContent(content: string): string {
  if (!content) return '';

  // Preserve important technical formatting
  content = content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/\t/g, '    ') // Convert tabs to spaces
    .trim();

  // Preserve technical symbols and formatting
  content = content.replace(/[^\w\s.,!?;:()"'\-–—<>@#$%&*+=`~/\\|[\]{}]/g, ' ');

  return content;
}
