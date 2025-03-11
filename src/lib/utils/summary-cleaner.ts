/**
 * Cleans summary content while preserving HTML structure and formatting
 */
export function cleanSummaryContent(content: string): string {
  if (!content) return '';

  // Clean up spacing
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove extra blank lines
  content = content.replace(/^\s+|\s+$/g, ''); // Trim start and end

  // Preserve Q&A format
  content = content.replace(/(?<!<[^>]*)(Q:)/g, '\n\nQ:'); // Add newlines before Q: if not inside a tag

  // Remove any unsafe or script tags
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  content = content.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  return content;
}
