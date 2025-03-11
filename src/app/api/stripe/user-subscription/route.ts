import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserSubscription } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the user's subscription
    const subscription = await getUserSubscription(session.user.id);
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
