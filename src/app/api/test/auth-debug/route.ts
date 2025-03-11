import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    // Test RLS by attempting to read from saved_summaries
    const { data: testData, error: testError } = await supabase
      .from('saved_summaries')
      .select('id')
      .limit(1);

    // Get role info directly from RLS context
    const { data: roleData, error: roleError } = await supabase
      .rpc('get_auth_info');

    return NextResponse.json({
      session: {
        id: session?.user?.id,
        email: session?.user?.email,
        role: session?.user?.role,
      },
      test: {
        success: !testError,
        error: testError ? {
          message: testError.message,
          code: testError.code
        } : null
      },
      rls: {
        role: roleData?.role,
        uid: roleData?.uid,
        error: roleError ? {
          message: roleError.message,
          code: roleError.code
        } : null
      }
    });
  } catch (error) {
    console.error('Auth debug error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
