import { NextResponse } from 'next/server'
import { createClient, PostgrestError } from '@supabase/supabase-js'
import { headers } from 'next/headers'

type RouteParams = {
  userId: string
  deckId: string
}

type RouteContext = {
  params: Promise<RouteParams>
}

interface StudyStats {
  cardsStudied: number
  timeSpent: number
  lastStudied: string | null
  confidenceRatings: Record<string, number>
  studiedCardIds: string[]
  streak: number
}

interface RequestStats {
  cardsStudied?: number
  timeSpent?: number
  lastStudied?: string
  studiedCardIds?: string[]
  streak?: number
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId, deckId } = await context.params
    console.log('GET statistics - User ID:', userId, 'Deck ID:', deckId)

    // Get the authorization header
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) {
      console.error('GET statistics - No authorization header')
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

    const { data, error } = await supabaseClient
      .from('flashcard_statistics')
      .select('statistics')
      .eq('user_id', userId)
      .eq('deck_id', deckId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No statistics found, return default values
        return NextResponse.json({
          cardsStudied: 0,
          timeSpent: 0,
          confidenceRatings: {},
          lastStudied: null,
          streak: 0
        })
      }
      throw error
    }

    return NextResponse.json(data.statistics)
  } catch (error) {
    console.error('Error fetching deck statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deck statistics' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId, deckId } = await context.params
    const { stats, confidenceRatings } = await request.json() as { 
      stats: RequestStats, 
      confidenceRatings: Record<string, number> 
    }

    // Get the authorization header
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) {
      console.error('PUT statistics - No authorization header')
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

    // First check if statistics exist
    const { data: existingData, error: fetchError } = await supabaseClient
      .from('flashcard_statistics')
      .select('statistics')
      .eq('user_id', userId)
      .eq('deck_id', deckId)
      .single()

    console.log('PUT statistics - Existing data:', JSON.stringify(existingData), 'Fetch error:', fetchError)

    let dbOperation
    if (!existingData || (fetchError && typeof fetchError === 'object' && 'code' in fetchError && (fetchError as { code: string }).code === 'PGRST116')) {
      // For new entries, create a properly structured statistics object
      const newStats: StudyStats = {
        cardsStudied: stats.cardsStudied || 0,
        timeSpent: stats.timeSpent || 0,
        lastStudied: stats.lastStudied || new Date().toISOString(),
        confidenceRatings: confidenceRatings || {},
        studiedCardIds: stats.studiedCardIds || [],
        streak: stats.streak || 1 // Initialize streak to 1 for new entries
      }

      console.log('PUT statistics - Creating new stats:', JSON.stringify(newStats))

      // Insert new statistics
      dbOperation = await supabaseClient
        .from('flashcard_statistics')
        .insert({
          user_id: userId,
          deck_id: deckId,
          statistics: newStats
        })
    } else {
      // For updates, merge with existing data
      const existingStats = existingData.statistics as StudyStats || {}
      
      // Calculate total cards studied (don't double count cards)
      const existingCardIds = new Set(existingStats.studiedCardIds || [])
      const newCardIds = stats.studiedCardIds || []
      newCardIds.forEach((id: string) => existingCardIds.add(id))
      
      const updatedStats: StudyStats = {
        cardsStudied: existingCardIds.size,
        timeSpent: (existingStats.timeSpent || 0) + (stats.timeSpent || 0),
        lastStudied: stats.lastStudied || new Date().toISOString(),
        confidenceRatings: {
          ...(existingStats.confidenceRatings || {}),
          ...(confidenceRatings || {})
        },
        studiedCardIds: Array.from(existingCardIds),
        streak: stats.streak || existingStats.streak || 1
      }

      console.log('PUT statistics - Updating with stats:', JSON.stringify(updatedStats))

      dbOperation = await supabaseClient
        .from('flashcard_statistics')
        .update({ statistics: updatedStats })
        .eq('user_id', userId)
        .eq('deck_id', deckId)
    }

    console.log('PUT statistics - DB operation result:', JSON.stringify(dbOperation))

    if (dbOperation.error) {
      console.error('PUT statistics - Database operation error:', dbOperation.error)
      return NextResponse.json(
        { error: 'Failed to update statistics: ' + dbOperation.error.message },
        { status: 500 }
      )
    }

    // Fetch and return the updated statistics
    const { data: updatedData, error: getError } = await supabaseClient
      .from('flashcard_statistics')
      .select('statistics')
      .eq('user_id', userId)
      .eq('deck_id', deckId)
      .single()

    if (getError) {
      console.error('PUT statistics - Error fetching updated statistics:', getError)
      return NextResponse.json({ success: true }) // Still return success since the update worked
    }

    return NextResponse.json(updatedData.statistics)
  } catch (error) {
    console.error('Error updating deck statistics:', error)
    return NextResponse.json(
      { error: 'Failed to update deck statistics' },
      { status: 500 }
    )
  }
} 