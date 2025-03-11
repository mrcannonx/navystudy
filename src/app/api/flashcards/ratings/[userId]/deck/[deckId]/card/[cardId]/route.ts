import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

type RouteParams = {
  userId: string
  deckId: string
  cardId: string
}

type RouteContext = {
  params: Promise<RouteParams>
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId, deckId, cardId } = await context.params
    console.log('PUT rating - User ID:', userId, 'Deck ID:', deckId, 'Card ID:', cardId)

    // Get the authorization header
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) {
      console.error('PUT rating - No authorization header')
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

    const { rating } = await request.json()
    console.log('PUT rating - Received rating:', rating)

    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating value' },
        { status: 400 }
      )
    }

    // 1. Update confidence rating in the study_data JSONB column of flashcards table
    const { data: existingDeck, error: fetchError } = await supabaseClient
      .from('flashcards')
      .select('study_data')
      .eq('id', deckId)
      .single()

    if (fetchError) {
      console.error('PUT rating - Error fetching deck:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch deck: ' + fetchError.message },
        { status: 500 }
      )
    }

    const studyData = existingDeck.study_data || {
      cardsStudied: 0,
      timeSpent: 0,
      lastStudied: null,
      streak: 0,
      studiedCardIds: [],
      confidenceRatings: {}
    }

    // Add card to studied cards if not already there
    const studiedCardIds = new Set(studyData.studiedCardIds || [])
    studiedCardIds.add(cardId)

    const updatedStudyData = {
      ...studyData,
      cardsStudied: studiedCardIds.size,
      lastStudied: new Date().toISOString(),
      studiedCardIds: Array.from(studiedCardIds),
      confidenceRatings: {
        ...(studyData.confidenceRatings || {}),
        [cardId]: rating
      }
    }

    // Update the deck with new study data
    const { error: updateError } = await supabaseClient
      .from('flashcards')
      .update({ 
        study_data: updatedStudyData,
        updated_at: new Date().toISOString()
      })
      .eq('id', deckId)

    if (updateError) {
      console.error('PUT rating - Error updating deck:', updateError)
      return NextResponse.json(
        { error: 'Failed to update deck: ' + updateError.message },
        { status: 500 }
      )
    }

    // 2. Update card progress in card_progress
    const { error: progressError } = await supabaseClient
      .from('card_progress')
      .upsert({
        user_id: userId,
        deck_id: deckId,
        card_id: cardId,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,deck_id,card_id'
      })

    if (progressError) {
      console.error('PUT rating - Error updating card progress:', progressError)
      return NextResponse.json(
        { error: 'Failed to update card progress: ' + progressError.message },
        { status: 500 }
      )
    }

    // Return the updated confidence ratings
    return NextResponse.json({
      success: true,
      confidenceRatings: updatedStudyData.confidenceRatings
    })

  } catch (error) {
    console.error('PUT rating - Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 