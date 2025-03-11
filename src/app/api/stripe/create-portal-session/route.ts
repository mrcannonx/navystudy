import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the return URL from the request body
    const body = await req.json();
    const { returnUrl } = body;

    // Create a portal session
    const portalSession = await createPortalSession(
      session.user.id,
      returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings`
    );

    // Return the portal session URL
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
