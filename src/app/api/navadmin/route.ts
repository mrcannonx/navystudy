import { NextRequest, NextResponse } from 'next/server';
import { AnthropicService } from '../ai/services/anthropic';
import {
  chunkNavadminContent,
  preprocessNavadminContent,
  processNavadminChunks
} from '@/lib/navadmin';

// Configure for Edge Runtime
export const runtime = 'edge';

// Maximum size for a single chunk in characters
const MAX_CHUNK_SIZE = 2000;

// Percentage of overlap between chunks
const OVERLAP_PERCENT = 20;

// Streaming response for progress updates
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const { content, url } = await request.json();

    if (!content && !url) {
      return NextResponse.json(
        { error: "Either content or url must be provided" },
        { status: 400 }
      );
    }

    let navadminText = content;

    // If URL is provided, fetch the content
    if (url) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }

        navadminText = await response.text();
      } catch (error) {
        console.error('Error fetching URL:', error);
        return NextResponse.json(
          {
            error: "Failed to fetch content from URL",
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }

    if (!navadminText || typeof navadminText !== 'string' || !navadminText.trim()) {
      return NextResponse.json(
        { error: "No valid content to process" },
        { status: 400 }
      );
    }

    // Initialize Anthropic service
    const anthropicService = new AnthropicService();

    // Preprocess the content
    const processedContent = preprocessNavadminContent(navadminText);
    
    // Check if content needs chunking
    const needsChunking = processedContent.length > MAX_CHUNK_SIZE;
    const chunkCount = needsChunking
      ? Math.ceil(processedContent.length / (MAX_CHUNK_SIZE * (1 - OVERLAP_PERCENT/100)))
      : 1;
    
    // Process the NAVADMIN content
    const formattedContent = await processNavadmin(anthropicService, processedContent, needsChunking);

    return NextResponse.json({
      success: true,
      formattedContent,
      processingInfo: {
        contentLength: processedContent.length,
        chunked: needsChunking,
        chunkCount: chunkCount
      }
    });
  } catch (error) {
    console.error('Unexpected error in NAVADMIN processing:', error);
    
    // Extract more detailed error information
    const errorDetails = error instanceof Error
      ? {
          message: error.message,
          name: error.name,
          stack: error.stack,
          cause: error.cause,
        }
      : 'Unknown error';
    
    console.error('Error details:', JSON.stringify(errorDetails, null, 2));
    
    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing the NAVADMIN",
        details: error instanceof Error ? error.message : 'Unknown error',
        errorInfo: errorDetails
      },
      { status: 500 }
    );
  }
}

async function processNavadmin(anthropicService: AnthropicService, content: string, needsChunking: boolean): Promise<string> {
  try {
    console.log(`Processing NAVADMIN content of length: ${content.length}`);
    
    // Check if content is small enough to process in one go
    if (!needsChunking) {
      console.log('Content is small enough to process in one go');
      
      // Create a custom prompt for NAVADMIN formatting
      const navadminPrompt = `
FORMAT THIS NAVADMIN INTO WELL-STRUCTURED HTML WITH TAILWIND CSS CLASSES:

Follow these guidelines:
1. Identify and extract key sections: header information, subject, references, remarks (RMK), main content, etc.
2. Format the content with proper HTML structure using semantic elements
3. Apply appropriate styling classes for readability
4. Preserve all information from the original NAVADMIN
5. Organize content logically with clear section headings
6. Make lists and tables properly formatted and easy to read
7. Highlight important information
8. Use proper heading elements (h1-h6) for section titles and numbered paragraphs
9. Make numbered paragraphs (like "1.", "2.") into bold headings
10. Ensure RMK/1 sections are properly formatted and highlighted

Use this structure as a guide:
- Header section with NAVADMIN number, date, classification, and routing info
- Subject section with clear heading
- References section with proper formatting
- Remarks section (RMK) with proper formatting and highlighting
- Main content with proper headings, paragraphs, lists, and formatting
- Points of contact section
- Footer with classification and attribution

The HTML should be clean, modern, and professional in appearance.

NAVADMIN CONTENT:
${content}

RETURN ONLY THE FORMATTED HTML WITH NO EXPLANATIONS OR MARKDOWN.
`;

      // Use the navadmin content type
      const response = await anthropicService.generateContent(navadminPrompt, 'navadmin');
      return response;
    } else {
      console.log('Content is too large, processing in chunks');
      
      // Chunk the content
      const chunks = chunkNavadminContent(content, MAX_CHUNK_SIZE, OVERLAP_PERCENT);
      console.log(`Created ${chunks.length} chunks`);
      
      // Process the chunks
      return await processNavadminChunks(chunks, anthropicService, (current, message) => {
        console.log(message || `Processing chunk ${current}/${chunks.length}`);
      });
    }
  } catch (error) {
    console.error('Error processing NAVADMIN:', error);
    throw new Error(`Failed to process NAVADMIN: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}