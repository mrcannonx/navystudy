import { Metadata } from 'next';
import PricingPlans from '@/components/subscription/PricingPlans';
import { getSubscriptionPlans } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Pricing - NAVY Study',
  description: 'Choose a subscription plan to access all features',
};

export default async function PricingPage() {
  // Get subscription plans or use mock data in development
  const plans = await getSubscriptionPlans();
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get full access to all tools and features with our premium subscription.
          Start with a 3-day free trial.
        </p>
        
        {process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md max-w-2xl mx-auto">
            <p className="text-sm">
              <strong>Development Mode:</strong> Supabase environment variables are not set.
              Using mock data for demonstration purposes.
            </p>
          </div>
        )}
      </div>
      
      <PricingPlans plans={plans} />
    </div>
  );
}
