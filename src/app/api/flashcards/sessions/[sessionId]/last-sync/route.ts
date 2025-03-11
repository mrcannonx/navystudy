import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

interface RouteParams {
  sessionId: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const resolvedParams = await params;
  const supabase = createRouteHandlerClient({ cookies });
  const sessionId = resolvedParams.sessionId;

  try {
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get last sync time from user profile
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

    // Verify the session exists
    const { error: sessionError } = await supabase
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

    return Response.json({
      timestamp: profile?.preferences?.lastSync ? new Date(profile.preferences.lastSync).getTime() : null,
    });
  } catch (error) {
    console.error('Last sync timestamp error:', error);
    return Response.json(
      { error: 'Failed to get last sync timestamp' },
      { status: 500 }
    );
  }
}

export type RouteSegment = {
  params: { sessionId: string };
};
