import { ContentType, GenerateContentResponse } from '../types/content-types';

interface APIRequestOptions {
  content: string;
  type: ContentType;
  timestamp?: number;
}

export async function makeAPIRequest(
  chunk: string,
  type: ContentType,
  retryCount = 0,
  maxRetries = 2
): Promise<GenerateContentResponse> {
  try {
    console.log(`Attempt ${retryCount + 1} for chunk processing`);
    
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: chunk,
        type,
        timestamp: Date.now()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData.error || 'Unknown error',
        details: errorData.details || 'No additional details'
      });
      
      if (retryCount < maxRetries) {
        console.log('Retrying request...');
        return makeAPIRequest(chunk, type, retryCount + 1, maxRetries);
      }
      throw new Error(`Failed to process content after ${maxRetries} attempts`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.error('Invalid response:', {
        success: data.success,
        data: data.data,
        error: data.error || 'No error message provided'
      });
      
      if (retryCount < maxRetries) {
        console.log('Retrying request due to invalid response...');
        return makeAPIRequest(chunk, type, retryCount + 1, maxRetries);
      }
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    if (retryCount < maxRetries) {
      console.log('Retrying after error:', error);
      return makeAPIRequest(chunk, type, retryCount + 1, maxRetries);
    }
    console.error('Error in API request:', error);
    throw error;
  }
}
