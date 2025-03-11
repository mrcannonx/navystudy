import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('GET decks - No auth token')
      return NextResponse.json({ error: 'No auth token' }, { status: 401 })
    }

    // Extract the token
    const token = authHeader.split(' ')[1]

    // Create a new Supabase client with the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    // Get the current user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('GET decks - Auth error:', authError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }

    // Verify the requested userId matches the authenticated user
    if (user.id !== userId) {
      console.error('GET decks - User ID mismatch:', { 
        requestedId: userId, 
        authenticatedId: user.id 
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    console.log('GET decks - Fetching decks for user:', userId)
    const { data, error } = await supabase
      .from('flashcards')
      .select(`
        id,
        title,
        description,
        cards,
        user_id,
        created_at
      `)
      .eq('user_id', userId)

    if (error) {
      console.error('GET decks - Database error:', error)
      throw error
    }

    // Transform the data to match the expected deck format
    const decks = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      cards: item.cards,
      userId: item.user_id,
      createdAt: item.created_at
    }))

    console.log('GET decks - Found decks:', decks.length)
    return NextResponse.json(decks)
  } catch (error) {
    console.error('Error fetching decks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch decks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const deckId = searchParams.get('deckId')

  if (!deckId) {
    return NextResponse.json({ error: 'Deck ID is required' }, { status: 400 })
  }

  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('DELETE deck - No auth token')
      return NextResponse.json({ error: 'No auth token' }, { status: 401 })
    }

    // Extract the token
    const token = authHeader.split(' ')[1]

    // Create a new Supabase client with the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    // Get the current user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('DELETE deck - Auth error:', authError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }

    // First, verify the deck belongs to the user
    const { data: deck, error: fetchError } = await supabase
      .from('flashcards')
      .select('user_id')
      .eq('id', deckId)
      .single()

    if (fetchError) {
      console.error('DELETE deck - Error fetching deck:', fetchError)
      return NextResponse.json({ error: 'Failed to verify deck ownership' }, { status: 500 })
    }

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    if (deck.user_id !== user.id) {
      console.error('DELETE deck - User ID mismatch:', {
        deckUserId: deck.user_id,
        authenticatedUserId: user.id
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the deck
    const { error: deleteError } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', deckId)

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