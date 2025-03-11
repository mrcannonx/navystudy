import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

type RouteParams = {
  userId: string
}

type RouteContext = {
  params: Promise<RouteParams>
}

const DEFAULT_SETTINGS = {
  cardsPerSession: 10,
  shuffleCards: true,
  trackStatistics: true,
  useConfidenceRating: true,
  twoSidedPractice: false
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId } = await context.params
    console.log('GET settings - User ID:', userId)

    if (!userId) {
      console.log('GET settings - Missing user ID')
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('GET settings - No auth token')
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
      console.error('GET settings - Auth error:', authError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }

    // Verify the requested userId matches the authenticated user
    if (user.id !== userId) {
      console.error('GET settings - User ID mismatch:', { 
        requestedId: userId, 
        authenticatedId: user.id 
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Try to get existing profile preferences
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    console.log('GET settings - Database response:', { 
      profile, 
      fetchError,
      userId: userId,
      authenticatedUserId: user.id
    })

    // If no settings exist or there's an error, create new settings
    if (!profile?.preferences?.flashcardSettings) {
      console.log('GET settings - No settings found, creating defaults')
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          preferences: {
            ...profile?.preferences,
            flashcardSettings: DEFAULT_SETTINGS
          }
        })
        .eq('id', userId)

      if (updateError) {
        console.error('GET settings - Error creating settings:', updateError)
        return NextResponse.json(
          { error: 'Failed to create settings', details: updateError.message },
          { status: 500 }
        )
      }

      console.log('GET settings - Created new settings:', DEFAULT_SETTINGS)
      return NextResponse.json(DEFAULT_SETTINGS)
    }

    // Return existing settings merged with defaults
    const mergedSettings = {
      ...DEFAULT_SETTINGS,
      ...profile.preferences.flashcardSettings
    }
    console.log('GET settings - Returning merged settings:', mergedSettings)

    return NextResponse.json(mergedSettings)
  } catch (error) {
    console.error('Error in GET settings:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId } = await context.params
    console.log('PUT settings - User ID:', userId)

    if (!userId) {
      console.log('PUT settings - Missing user ID')
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('PUT settings - No auth token')
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
      console.error('PUT settings - Auth error:', authError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }

    // Verify the requested userId matches the authenticated user
    if (user.id !== userId) {
      console.error('PUT settings - User ID mismatch:', { 
        requestedId: userId, 
        authenticatedId: user.id 
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const newSettings = await request.json()
    console.log('PUT settings - New settings received:', newSettings)

    // Validate settings
    if (!newSettings || typeof newSettings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings format' },
        { status: 400 }
      )
    }

    // Merge with defaults
    const mergedSettings = {
      ...DEFAULT_SETTINGS,
      ...newSettings
    }

    // Get current profile preferences first
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (fetchError) {
      console.error('PUT settings - Error fetching profile:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: fetchError.message },
        { status: 500 }
      )
    }

    // Update settings in preferences
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        preferences: {
          ...profile?.preferences,
          flashcardSettings: mergedSettings
        }
      })
      .eq('id', userId)

    if (updateError) {
      console.error('PUT settings - Database error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update settings', details: updateError.message },
        { status: 500 }
      )
    }

    console.log('PUT settings - Successfully saved settings:', mergedSettings)
    return NextResponse.json({ 
      success: true, 
      settings: mergedSettings 
    })
  } catch (error) {
    console.error('Error saving study settings:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
