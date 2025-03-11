import { ContentType, GenerateContentResponse, SummaryFormat } from './types';

interface RequestMetadata {
  chunkIndex?: number;
  totalChunks?: number;
  previousContext?: string;
}

export async function makeAIRequest(
  content: string,
  type: ContentType,
  format?: SummaryFormat,
  metadata?: RequestMetadata,
  retryCount: number = 0,
  maxRetries: number = 3,
  timestamp: number = Date.now()
): Promise<GenerateContentResponse> {
  try {
    const chunkInfo = metadata?.chunkIndex !== undefined && metadata?.totalChunks !== undefined
      ? ` (Chunk ${metadata.chunkIndex + 1}/${metadata.totalChunks})`
      : '';
    
    console.log(`Starting API request for chunk of ${content.length} characters${chunkInfo}`);
    
    // Check if this is a metrics generation request
    let isMetricsRequest = false;
    try {
      const contentObj = JSON.parse(content);
      isMetricsRequest = contentObj.task === 'generate_metrics';
    } catch (e) {
      // Not JSON or doesn't have task field, continue with normal request
    }
    
    const controller = new AbortController();
    const timeoutDuration = 90000; // 90 second timeout
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(new Error(`Request timed out after ${timeoutDuration / 1000} seconds`));
      }, timeoutDuration);
    });

    // Use the metrics-specific endpoint if this is a metrics request
    // Use absolute URLs to avoid "Invalid URL" errors
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const endpoint = isMetricsRequest ? `${baseUrl}/api/ai/generate-metrics` : `${baseUrl}/api/ai`;
    console.log(`Using endpoint: ${endpoint}`);
    
    const fetchPromise = fetch(endpoint, {
      cache: 'no-store', // Disable caching
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        isMetricsRequest
          ? JSON.parse(content) // Send parsed content for metrics
          : {
              content,
              type,
              format,
              metadata,
              timestamp
            }
      ),
      signal: controller.signal,
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error || errorText;
        console.error('Detailed API Error:', errorJson);
      } catch {
        errorDetails = errorText;
        console.error('Raw API Error:', errorText);
      }
      
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url: response.url,
        chunkIndex: metadata?.chunkIndex
      });
      
      throw new Error(`API request failed: ${response.status} ${response.statusText || 'Unknown error'}. Details: ${errorDetails}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }

    // Add chunk metadata to response
    if (metadata) {
      result.metadata = {
        ...result.metadata,
        ...metadata
      };
    }

    return result;

  } catch (error) {
    const chunkInfo = metadata?.chunkIndex !== undefined && metadata?.totalChunks !== undefined
      ? ` (Chunk ${metadata.chunkIndex + 1}/${metadata.totalChunks})`
      : '';
      
    console.error(`Attempt ${retryCount + 1}/${maxRetries + 1} failed${chunkInfo}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Retry logic with exponential backoff
    if (retryCount < maxRetries) {
      const backoffTime = Math.min(5000 * Math.pow(2, retryCount), 45000); // Cap at 45 seconds
      console.log(`Retrying in ${Math.round(backoffTime / 1000)} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return makeAIRequest(content, type, format, metadata, retryCount + 1, maxRetries, Date.now());
    }
    
    throw error;
  }
}
