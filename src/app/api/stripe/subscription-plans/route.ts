import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionPlans } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    // Get subscription plans
    const plans = await getSubscriptionPlans();
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}
