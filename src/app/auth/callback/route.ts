import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // Exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('[Auth Callback] Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(new URL('/auth?error=session_error', request.url))
      }

      // Get the session to verify it worked and ensure cookies are set
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('[Auth Callback] Error getting session:', sessionError)
        return NextResponse.redirect(new URL('/auth?error=session_error', request.url))
      }
      
      if (session) {
        console.log('[Auth Callback] Session established successfully:', {
          userId: session.user.id,
          expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown'
        })
        
        // Create response with redirect
        const response = NextResponse.redirect(new URL(next, request.url))
        
        return response
      } else {
        console.error('[Auth Callback] No session after exchange')
        return NextResponse.redirect(new URL('/auth?error=no_session', request.url))
      }
    }

    console.error('[Auth Callback] No code provided')
    return NextResponse.redirect(new URL('/auth?error=no_code', request.url))
  } catch (error) {
    console.error('[Auth Callback] Unexpected error:', error)
    return NextResponse.redirect(new URL('/auth?error=unknown', request.url))
  }
} 