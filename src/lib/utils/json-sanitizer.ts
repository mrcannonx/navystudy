/**
 * Extracts content from a specific section in the text
 */
function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=DESCRIPTION:|KEYWORDS:|ACHIEVEMENTS:|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim().replace(/"/g, '\\"') : '';
}

/**
 * Attempts to parse a JSON string, returning null if it fails
 */
function tryParseJson(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

/**
 * Sanitizes a JSON string by properly escaping control characters
 * and fixing common JSON formatting issues
 */
export function sanitizeJsonString(jsonString: string): string {
  // Check if we have literal backslash-n sequences that need special handling
  const hasLiteralBackslashN = jsonString.includes('\\n') && !jsonString.includes('\n');
  
  // If we have literal \n sequences, handle them specially
  if (hasLiteralBackslashN) {
    console.log('Detected literal \\n sequences in the string');
    // Replace literal \n with spaces to avoid JSON parsing issues
    jsonString = jsonString.replace(/\\n/g, ' ');
    jsonString = jsonString.replace(/\\r/g, ' ');
  }
  
  // First, handle control characters
  let sanitized = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, (match: string) => {
    // Replace common control characters with their escaped versions
    if (match === '\n') return ' '; // Replace with space instead of \n
    if (match === '\r') return ' '; // Replace with space instead of \r
    if (match === '\t') return ' '; // Replace with space instead of \t
    if (match === '\b') return ' '; // Replace with space instead of \b
    if (match === '\f') return ' '; // Replace with space instead of \f
    // Remove other control characters
    return '';
  });
  
  // Fix common JSON formatting issues
  
  // Fix unescaped quotes in strings
  sanitized = sanitized.replace(/(?<!\\)\\(?!["\\/bfnrtu])/g, '\\\\');
  
  // Fix missing quotes around property names
  sanitized = sanitized.replace(/(\{|\,)\s*([a-zA-Z0-9_]+)\s*\:/g, '$1"$2":');
  
  // Fix trailing commas in objects and arrays
  sanitized = sanitized.replace(/,\s*(\}|\])/g, '$1');
  
  // Ensure the JSON is properly formatted
  sanitized = sanitized.trim();
  if (!sanitized.startsWith('{') && !sanitized.startsWith('[')) {
    sanitized = '{' + sanitized;
  }
  if (!sanitized.endsWith('}') && !sanitized.endsWith(']')) {
    sanitized = sanitized + '}';
  }
  
  return sanitized;
}

/**
 * Safely extracts and parses JSON from a string that might contain
 * unescaped control characters or other formatting issues
 */
export function extractAndParseJson(text: string): any {
  if (!text) return null;
  
  // Try to find JSON-like content in the text using different approaches
  
  // First try the standard approach - find the first { and last }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  
  // If that fails, try a more lenient approach
  if (!jsonMatch) {
    console.log('Standard JSON extraction failed, trying alternative approaches');
    
    // Try to find any content between DESCRIPTION, KEYWORDS, and ACHIEVEMENTS sections
    const hasStructuredSections =
      text.match(/DESCRIPTION/i) &&
      text.match(/KEYWORDS/i) &&
      text.match(/ACHIEVEMENTS/i);
    
    if (hasStructuredSections) {
      // Skip JSON extraction and go straight to section extraction
      return null;
    }
    
    // Try to find any object-like structure
    const objectMatch = text.match(/[\{\[][\s\S]*?[\}\]]/);
    if (objectMatch) {
      console.log('Found alternative object-like structure');
      return tryParseJson(objectMatch[0]);
    }
    
    return null;
  }
  
  try {
    // First try direct parsing
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // If direct parsing fails, try with sanitization
      let sanitizedJson = sanitizeJsonString(jsonMatch[0]);
      
      // Log the sanitized JSON for debugging
      console.log('Sanitized JSON:', sanitizedJson.substring(0, 100) + '...');
      
      // Log the first few characters with their character codes to help diagnose issues
      const charCodes = Array.from(sanitizedJson.substring(0, 20)).map(c =>
        `${c} (${c.charCodeAt(0)})`
      ).join(', ');
      console.log('First 20 characters with codes:', charCodes);
      
      // Handle the specific case we're seeing with literal \n at the start
      if (sanitizedJson.startsWith('{\n') || sanitizedJson.includes('\\n')) {
        console.log('Detected literal newlines in JSON, fixing...');
        // Replace literal \n with actual newlines, then replace all newlines with spaces
        sanitizedJson = sanitizedJson.replace(/\\n/g, '\n').replace(/\n/g, ' ');
        console.log('Fixed JSON:', sanitizedJson.substring(0, 100) + '...');
      }
      
      try {
        return JSON.parse(sanitizedJson);
      } catch (parseError) {
        console.log('Standard parsing still failed, trying more aggressive approach');
        
        // Try to manually construct a valid JSON object from the text
        const manualJson = {
          description: extractSection(text, 'DESCRIPTION'),
          keywords: extractSection(text, 'KEYWORDS'),
          achievements: extractSection(text, 'ACHIEVEMENTS')
        };
        
        if (manualJson.description || manualJson.keywords || manualJson.achievements) {
          console.log('Successfully extracted content manually');
          return manualJson;
        }
        
        throw parseError; // Re-throw to trigger the last resort extraction
      }
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    
    // Last resort: try to extract key parts manually
    try {
      const descriptionMatch = text.match(/description["']?\s*:\s*["']([^"']+)["']/i);
      const keywordsMatch = text.match(/keywords["']?\s*:\s*["']([^"']+)["']/i);
      const achievementsMatch = text.match(/achievements["']?\s*:\s*["']([^"']+)["']/i);
      
      if (descriptionMatch || keywordsMatch || achievementsMatch) {
        return {
          description: descriptionMatch ? descriptionMatch[1] : '',
          keywords: keywordsMatch ? keywordsMatch[1] : '',
          achievements: achievementsMatch ? achievementsMatch[1] : ''
        };
      }
    } catch (e) {
      console.error('Failed manual extraction:', e);
    }
    
    return null;
  }
}