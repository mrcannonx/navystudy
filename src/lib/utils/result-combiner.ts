export function combineChunks(chunks: string[]): string {
  if (chunks.length === 1) return chunks[0];

  // Remove duplicate introductory text from subsequent chunks
  const introText = "Here is a bullet-point summary of the key points:";
  const cleanChunks = chunks.map((chunk, index) => {
    let cleanChunk = chunk;
    
    // Remove any "Previous Context" sections
    cleanChunk = cleanChunk.replace(/Previous Context:[^]*?\n\n/, '');
    
    // For subsequent chunks, remove the intro text and any surrounding whitespace
    if (index > 0) {
      cleanChunk = cleanChunk.replace(new RegExp(`\\s*${introText}\\s*`), '');
    }
    
    return cleanChunk.trim();
  });

  // Combine while preserving structure
  return cleanChunks.join('\n\n');
}

export function getProcessingMessage(current: number, total: number): string {
  return `Processing chunk ${current} of ${total}...`;
}
