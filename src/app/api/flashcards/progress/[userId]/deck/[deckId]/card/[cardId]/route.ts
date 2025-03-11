import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

// Helper function to validate UUID
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

type RouteParams = {
  userId: string
  deckId: string
  cardId: string
}

type RouteContext = {
  params: Promise<RouteParams>
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId, deckId, cardId } = await context.params
    console.log('Recording progress for card:', { userId, deckId, cardId })

    // Validate UUIDs
    if (!isValidUUID(userId) || !isValidUUID(deckId) || !isValidUUID(cardId)) {
      return NextResponse.json(
        { error: 'Invalid UUID format' },
        { status: 400 }
      )
    }

    // Get the authorization header
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      )
    }

    // Create Supabase client with auth header
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    // First check if the card exists in the deck
    const { data: deckData, error: deckError } = await supabase
      .from('flashcards')
      .select('cards')
      .eq('id', deckId)
      .eq('user_id', userId)
      .single()

    if (deckError || !deckData) {
      console.error('Error verifying deck:', deckError)
      return NextResponse.json(
        { error: 'Deck not found or unauthorized' },
        { status: 404 }
      )
    }

    // Verify card exists in deck
    const cards = deckData.cards as any[]
    if (!cards.some(card => card.id === cardId)) {
      return NextResponse.json(
        { error: 'Card not found in deck' },
        { status: 404 }
      )
    }

    // Record progress in card_progress table
    const now = new Date().toISOString()
    const { data, error: progressError } = await supabase
      .from('card_progress')
      .upsert({
        user_id: userId,
        deck_id: deckId,
        card_id: cardId,
        last_reviewed: now,
        next_review: now, // Calculate next review based on spaced repetition later
        review_count: 1,
        status: 'completed',
        created_at: now,
        updated_at: now
      })

    console.log('Upsert result:', { data, error: progressError })

    if (progressError) {
      console.error('Error recording card progress:', {
        error: progressError,
        details: progressError.details,
        hint: progressError.hint,
        code: progressError.code
      })

      // Check if it's a foreign key violation
      if (progressError.code === '23503') {
        return NextResponse.json(
          { error: 'Referenced deck or user not found' },
          { status: 404 }
        )
      }

      // Check if it's a constraint violation
      if (progressError.code === '23505') {
        // Try to update the existing record instead
        const { data: updateData, error: updateError } = await supabase
          .from('card_progress')
          .update({
            last_reviewed: now,
            next_review: now,
            review_count: 1,
            status: 'completed',
            updated_at: now
          })
          .eq('user_id', userId)
          .eq('deck_id', deckId)
          .eq('card_id', cardId)
          .select()

        if (updateError) {
          console.error('Error updating existing card progress:', {
            error: updateError,
            details: updateError.details,
            hint: updateError.hint,
            code: updateError.code
          })
          return NextResponse.json(
            { error: 'Failed to update card progress: ' + updateError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ success: true, data: updateData })
      }

      return NextResponse.json(
        { error: 'Failed to record card progress: ' + progressError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in card progress endpoint:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 