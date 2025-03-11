import { NextRequest, NextResponse } from 'next/server';
import { summarizerService } from '@/lib/summarizer/service';
import { applyMiddleware, sanitizeInput } from '@/lib/summarizer/middleware';
import { handleSummarizerError } from '@/lib/summarizer/error-handling';
import { ApiResponse, SummaryFormat } from '@/lib/summarizer/types';

export async function POST(req: NextRequest): Promise<ApiResponse> {
  try {
    // Apply middleware checks
    const middlewareResponse = await applyMiddleware(req);
    if (middlewareResponse) return middlewareResponse;

    const contentType = req.headers.get('content-type') || '';
    
    // Handle multipart form data (file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const format = formData.get('format') as SummaryFormat;
      
      const summary = await summarizerService.processFile(file, format);
      return NextResponse.json(
        { summary },
        { status: 200 }
      );
    }
    
    // Handle JSON request (direct text)
    if (contentType.includes('application/json')) {
      const { text, format } = await req.json() as { text: string; format: SummaryFormat };
      const sanitizedText = sanitizeInput(text);
      
      const summary = await summarizerService.summarizeText(sanitizedText, format);
      console.log('[Summarizer] Successfully generated summary:', {
        inputLength: sanitizedText.length,
        outputLength: summary.length
      });

      return NextResponse.json(
        { summary },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Unsupported content type' },
      { status: 400 }
    );

  } catch (error) {
    const { error: errorMessage, status, details } = handleSummarizerError(error);
    
    return NextResponse.json(
      { error: errorMessage, details },
      { status }
    );
  }
}
