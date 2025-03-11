import { NextRequest } from 'next/server'
import { AnthropicService } from '../ai/services/anthropic'
import { validateTextSize, SummarizerError } from '@/lib/summarizer/utils'

export const runtime = 'edge'

type SummaryFormat = 'bullet' | 'tldr' | 'qa'

function formatBulletPoints(text: string): string {
  return `<div class="space-y-2">
    ${text.split('\n')
      .filter(point => point.trim())
      .map(point => `<p class="flex gap-2">
        <span class="select-none">•</span>
        <span>${point.trim().replace(/^[-•*]\s*/, '')}</span>
      </p>`)
      .join('\n')}
  </div>`
}

function formatTLDR(text: string): string {
  return `<div class="prose prose-blue dark:prose-invert max-w-none">
    <p class="font-medium">${text.replace(/^TL;DR:\s*/i, '')}</p>
  </div>`
}

function formatQA(text: string): string {
  return `<div class="space-y-4">
    ${text.split('\n\n')
      .filter(qa => qa.trim())
      .map(qa => {
        const [question, answer] = qa.split('\nA: ').map(s => s.replace(/^Q:\s*/, '').trim());
        return `<div class="space-y-2">
          <p class="font-medium">${question}</p>
          <p class="pl-4 border-l-2 border-blue-500">${answer}</p>
        </div>`;
      })
      .join('\n')}
  </div>`
}

async function formatSummary(text: string, format: SummaryFormat): Promise<string> {
  switch (format) {
    case 'bullet':
      return formatBulletPoints(text)
    case 'tldr':
      return formatTLDR(text)
    case 'qa':
      return formatQA(text)
    default:
      return text
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, format = 'bullet' } = await req.json()
    
    // Validate input
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400 }
      )
    }

    if (!['bullet', 'tldr', 'qa'].includes(format)) {
      return new Response(
        JSON.stringify({ error: 'Invalid format' }),
        { status: 400 }
      )
    }

    // Validate text size
    try {
      validateTextSize(text)
    } catch (error) {
      if (error instanceof SummarizerError) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 413 }
        )
      }
      throw error
    }

    // Initialize Anthropic service
    let anthropicService: AnthropicService;
    try {
      anthropicService = new AnthropicService()
    } catch (error) {
      console.error('Failed to initialize Anthropic service:', error)
      return new Response(
        JSON.stringify({ error: 'AI service configuration error' }),
        { status: 500 }
      )
    }

    try {
      // Get AI summary
      const aiSummary = await anthropicService.generateSummary(text, format as SummaryFormat)
      
      // Format the AI response with HTML
      const formattedSummary = await formatSummary(aiSummary, format as SummaryFormat)

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            summary: formattedSummary
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (error) {
      console.error('AI summarization error:', error)
      throw error
    }
  } catch (error) {
    console.error('Summarization error:', error)
    
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    )
  }
}
