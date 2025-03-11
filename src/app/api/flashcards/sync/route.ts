import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface SyncOperation {
  type: 'card_response' | 'analytics';
  data: any;
  timestamp: number;
  sessionId: string;
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { operations } = await request.json() as { operations: SyncOperation[] };

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Process operations in order
    const results = [];
    for (const operation of operations) {
      try {
        switch (operation.type) {
          case 'card_response': {
            const { cardId, response } = operation.data;
            const { error: responseError } = await supabase
              .from('flashcard_responses')
              .upsert({
                user_id: user.id,
                card_id: cardId,
                confidence: response.confidence,
                responded_at: new Date(response.timestamp).toISOString(),
                study_session_id: operation.sessionId,
              });

            if (responseError) throw responseError;
            results.push({ success: true, operation });
            break;
          }

          case 'analytics': {
            // Record study session in user_activities
            const { error: activityError } = await supabase
              .from('user_activities')
              .insert({
                user_id: user.id,
                activity_type: 'flashcard_study',
                content_id: operation.sessionId,
                content_type: 'flashcard',
                content_title: 'Flashcard Study',
                created_at: new Date(operation.timestamp).toISOString(),
                completed_at: new Date(operation.timestamp).toISOString(),
                activity_data: {
                  score: operation.data.cardsCompleted > 0
                    ? (operation.data.cardsCompleted / operation.data.cardsViewed) * 100
                    : 0,
                  timeSpent: operation.data.timeSpent || 0,
                  questionsAnswered: operation.data.cardsViewed || 0,
                  correctAnswers: operation.data.cardsCompleted || 0,
                  completed: true,
                  currentAnswers: [],
                  metrics: {
                    timeSpent: operation.data.timeSpent || 0,
                    questionsAnswered: operation.data.cardsViewed || 0,
                    correctAnswers: operation.data.cardsCompleted || 0,
                    confidenceRating: operation.data.averageConfidence || null
                  }
                }
              });

            if (activityError) throw activityError;

            results.push({ success: true, operation });
            break;
          }

          default:
            results.push({
              success: false,
              operation,
              error: 'Unknown operation type',
            });
        }
      } catch (error) {
        console.error(`Failed to process operation:`, error);
        results.push({
          success: false,
          operation,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Record last sync in user profile
    await supabase
      .from('profiles')
      .update({ 
        preferences: {
          lastSync: new Date().toISOString()
        }
      })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      results,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to process sync operations' },
      { status: 500 }
    );
  }
}
