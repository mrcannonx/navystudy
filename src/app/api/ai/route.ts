import { NextResponse } from 'next/server';
import { AIRequest, ContentType, SummaryFormat } from '@/lib/types';
import { extractAndParseJson } from '@/lib/utils/json-sanitizer';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { content, type, format, metadata, timestamp }: AIRequest = body;

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!type || !['quiz', 'flashcards', 'summary', 'navadmin', 'metrics'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // For metrics type, we'll handle Navy rating content generation
    if (type === 'metrics') {
      // This is a prompt for generating Navy rating content
      // We'll use Anthropic's Claude API to generate the content
      try {
        // Check if we have an Anthropic API key
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
          throw new Error('Anthropic API key is not configured');
        }

        // Get the model to use (default to claude-3-5-sonnet if not specified)
        const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

        // Call Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: content
              }
            ],
            max_tokens: 2000,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Anthropic API error: ${errorData.error?.message || JSON.stringify(errorData) || 'Unknown error'}`);
        }

        const data = await response.json();
        const generatedText = data.content?.[0]?.text;

        if (!generatedText) {
          throw new Error('No content generated from Anthropic');
        }

        // Try to extract JSON from the response
        let parsedData;
        try {
          // Extract and parse JSON from the response
          const extractedJson = extractAndParseJson(generatedText);
          if (extractedJson) {
            parsedData = extractedJson;
          } else {
            // If no valid JSON found, use the whole text as summary
            parsedData = { summary: generatedText };
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          parsedData = { summary: generatedText };
        }

        return NextResponse.json({
          success: true,
          data: parsedData
        });
      } catch (error) {
        console.error('AI service error:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown AI service error',
            data: { summary: 'AI generation failed. Please try again later.' }
          },
          { status: 500 }
        );
      }
    }

    // Handle summary type requests
    if (type === 'summary') {
      try {
        // Check if we have an Anthropic API key
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
          throw new Error('Anthropic API key is not configured');
        }

        // Get the model to use (default to claude-3-5-sonnet if not specified)
        const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

        // Call Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: content
              }
            ],
            max_tokens: 1000,
            temperature: 0.5
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Anthropic API error: ${errorData.error?.message || JSON.stringify(errorData) || 'Unknown error'}`);
        }

        const data = await response.json();
        const generatedText = data.content?.[0]?.text;

        if (!generatedText) {
          throw new Error('No content generated from Anthropic');
        }

        return NextResponse.json({
          success: true,
          data: { summary: generatedText.trim() }
        });
      } catch (error) {
        console.error('AI service error:', error);
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown AI service error',
            data: { summary: 'AI generation failed. Please try again later.' }
          },
          { status: 500 }
        );
      }
    }

    // For other content types, we would implement different handlers
    // This is a placeholder for future implementation
    return NextResponse.json({
      success: false,
      error: `Content type '${type}' is not yet implemented`,
      data: { summary: 'This feature is not yet available.' }
    });

  } catch (error) {
    console.error('Error in AI API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error in AI API',
        data: { summary: 'An error occurred while processing your request.' }
      },
      { status: 500 }
    );
  }
}
