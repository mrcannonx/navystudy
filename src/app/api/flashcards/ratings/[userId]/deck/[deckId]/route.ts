import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

type RouteParams = {
  userId: string
  deckId: string
}

type RouteContext = {
  params: Promise<RouteParams>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId, deckId } = await context.params
    console.log('GET ratings - User ID:', userId, 'Deck ID:', deckId)

    // Get the authorization header
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) {
      console.error('GET ratings - No authorization header')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create a Supabase client with the user's token
    const supabaseClient = createClient(
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

    if (!userId || !deckId) {
      return NextResponse.json(
        { error: 'User ID and Deck ID are required' },
        { status: 400 }
      )
    }

    // Get the deck metadata containing confidence ratings
    const { data: deck, error } = await supabaseClient
      .from('flashcards')
      .select('metadata')
      .eq('id', deckId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('GET ratings - Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch confidence ratings' },
        { status: 500 }
      )
    }

    // Extract card ratings from metadata
    const ratingsObject = deck?.metadata?.cardRatings || {}

    return NextResponse.json(ratingsObject)
  } catch (error) {
    console.error('Error fetching confidence ratings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch confidence ratings' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId, deckId } = await context.params
    const { cardId, rating } = await request.json()

    // Get the authorization header
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) {
      console.error('PUT ratings - No authorization header')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create a Supabase client with the user's token
    const supabaseClient = createClient(
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

    if (!userId || !deckId || !cardId) {
      return NextResponse.json(
        { error: 'User ID, Deck ID, and Card ID are required' },
        { status: 400 }
      )
    }

    // Get the current deck metadata
    const { data: deck, error: fetchError } = await supabaseClient
      .from('flashcards')
      .select('metadata')
      .eq('id', deckId)
      .eq('user_id', userId)
      .single()
      
    if (fetchError) {
      console.error('PUT ratings - Error fetching deck:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch deck metadata' },
        { status: 500 }
      )
    }
    
    // Update the metadata with the new rating
    const metadata = deck?.metadata || {}
    const cardRatings = metadata.cardRatings || {}
    cardRatings[cardId] = rating
    
    // Update the deck with the new metadata
    const { error: updateError } = await supabaseClient
      .from('flashcards')
      .update({
        metadata: {
          ...metadata,
          cardRatings,
          lastUpdated: new Date().toISOString()
        }
      })
      .eq('id', deckId)
      .eq('user_id', userId)
      
    if (updateError) {
      console.error('PUT ratings - Error updating deck:', updateError)
      return NextResponse.json(
        { error: 'Failed to update confidence rating' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating confidence rating:', error)
    return NextResponse.json(
      { error: 'Failed to update confidence rating' },
      { status: 500 }
    )
  }
} 