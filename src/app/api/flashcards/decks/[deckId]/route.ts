import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

type RouteParams = {
  deckId: string
}

type RouteContext = {
  params: Promise<RouteParams>
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { deckId } = await context.params
    console.log('DELETE deck - Deck ID:', deckId)

    // Get the authorization header
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) {
      console.error('DELETE deck - No authorization header')
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

    // Get the current user's session
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      console.error('DELETE deck - Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      )
    }

    // First verify the deck belongs to the user
    const { data: deck, error: fetchError } = await supabaseClient
      .from('flashcards')
      .select('user_id')
      .eq('id', deckId)
      .single()

    if (fetchError) {
      console.error('DELETE deck - Error fetching deck:', fetchError)
      return NextResponse.json(
        { error: 'Failed to verify deck ownership' },
        { status: 500 }
      )
    }

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      )
    }

    if (deck.user_id !== user.id) {
      console.error('DELETE deck - User ID mismatch:', {
        deckUserId: deck.user_id,
        authenticatedUserId: user.id
      })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // First explicitly delete associated activity records
    // (this is a safety measure even though there should be ON DELETE CASCADE)
    const { error: deleteActivitiesError } = await supabaseClient
      .from('user_activities')
      .delete()
      .eq('content_id', deckId)
      .eq('content_type', 'flashcard')
      .eq('activity_type', 'flashcard_study')
      .eq('user_id', user.id)
      
    if (deleteActivitiesError) {
      console.error('DELETE deck - Error deleting activity records:', deleteActivitiesError)
      // Continue with deck deletion even if activity deletion fails
    }

    // Delete the deck
    const { error: deleteError } = await supabaseClient
      .from('flashcards')
      .delete()
      .eq('id', deckId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('DELETE deck - Error deleting deck:', deleteError)
      throw deleteError
    }

    console.log('DELETE deck - Successfully deleted deck:', deckId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deck:', error)
    return NextResponse.json(
      { error: 'Failed to delete deck', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 