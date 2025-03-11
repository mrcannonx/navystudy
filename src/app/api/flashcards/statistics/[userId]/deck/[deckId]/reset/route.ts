import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

type RouteParams = {
  userId: string
  deckId: string
}

type RouteContext = {
  params: Promise<RouteParams>
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId, deckId } = await context.params
    console.log('Resetting statistics for deck:', { userId, deckId })

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

    // Delete existing statistics for this deck
    const { error: deleteError } = await supabase
      .from('flashcard_statistics')
      .delete()
      .eq('user_id', userId)
      .eq('deck_id', deckId)

    if (deleteError) {
      console.error('Error deleting deck statistics:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete deck statistics' },
        { status: 500 }
      )
    }

    // Get the deck to update its metadata
    const { data: deck, error: getDeckError } = await supabase
      .from('flashcards')
      .select('metadata')
      .eq('id', deckId)
      .eq('user_id', userId)
      .single()
      
    if (getDeckError) {
      console.error('Error getting deck metadata:', getDeckError)
      return NextResponse.json(
        { error: 'Failed to get deck metadata' },
        { status: 500 }
      )
    }
    
    // Clear confidence ratings from metadata
    const metadata = deck?.metadata || {}
    delete metadata.cardRatings
    
    // Update the deck with cleared confidence ratings
    const { error: updateMetadataError } = await supabase
      .from('flashcards')
      .update({
        metadata
      })
      .eq('id', deckId)
      .eq('user_id', userId)
      
    if (updateMetadataError) {
      console.error('Error clearing confidence ratings from metadata:', updateMetadataError)
      return NextResponse.json(
        { error: 'Failed to clear confidence ratings' },
        { status: 500 }
      )
    }

    // Delete card progress for this deck
    const { error: deleteProgressError } = await supabase
      .from('card_progress')
      .delete()
      .eq('user_id', userId)
      .eq('deck_id', deckId)

    if (deleteProgressError) {
      console.error('Error deleting card progress:', deleteProgressError)
      return NextResponse.json(
        { error: 'Failed to delete card progress' },
        { status: 500 }
      )
    }

    // Create fresh statistics record
    const { error: createError } = await supabase
      .from('flashcard_statistics')
      .insert({
        user_id: userId,
        deck_id: deckId,
        statistics: {
          cardsStudied: 0,
          timeSpent: 0,
          lastStudied: new Date().toISOString(),
          studiedCardIds: []
        }
      })

    if (createError) {
      console.error('Error creating fresh statistics:', createError)
      return NextResponse.json(
        { error: 'Failed to create fresh statistics' },
        { status: 500 }
      )
    }

    // Return the fresh statistics
    return NextResponse.json({
      cardsStudied: 0,
      timeSpent: 0,
      lastStudied: new Date().toISOString(),
      studiedCardIds: []
    })
  } catch (error) {
    console.error('Error in reset statistics endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 