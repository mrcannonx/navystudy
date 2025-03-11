import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserSubscription } from '@/lib/stripe';
import SubscriptionManager from '@/components/subscription/SubscriptionManager';

export const metadata: Metadata = {
  title: 'Subscription Management - NAVY Study',
  description: 'Manage your subscription',
};

export default async function SubscriptionPage() {
  // Get the current user
  const session = await auth();
  if (!session?.user) {
    redirect('/auth');
  }

  // Get the user's subscription
  const subscription = await getUserSubscription(session.user.id);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
      
      {process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <div className="mb-6 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          <p className="text-sm">
            <strong>Development Mode:</strong> Supabase environment variables are not set.
            Using mock data for demonstration purposes.
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <SubscriptionManager subscription={subscription} />
      </div>
    </div>
  );
}
