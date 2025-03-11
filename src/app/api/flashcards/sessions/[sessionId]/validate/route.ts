import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const resolvedParams = await params;
    const sessionId = resolvedParams.sessionId;

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if session exists
    const { data: session, error: sessionError } = await supabase
      .from('user_activities')
      .select('created_at')
      .eq('content_id', sessionId)
      .eq('user_id', user.id)
      .eq('content_type', 'flashcard')
      .eq('activity_type', 'flashcard_study')
      .single();

    if (sessionError) {
      return Response.json(
        { error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get user profile for last sync time
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return Response.json(
        { error: 'Failed to get user preferences' },
        { status: 500 }
      );
    }

    return Response.json({
      valid: true,
      lastSynced: profile?.preferences?.lastSync || null,
      session: {
        id: sessionId,
        startTime: session.created_at,
        currentCardIndex: 0, // This is now tracked client-side
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return Response.json(
      { error: 'Failed to validate session' },
      { status: 500 }
    );
  }
}

export type RouteSegment = {
  params: { sessionId: string };
};
