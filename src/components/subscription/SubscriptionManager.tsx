'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { UserSubscription } from '@/types/database';
import { SUBSCRIPTION_STATUS } from '@/lib/stripe';

interface SubscriptionManagerProps {
  subscription: UserSubscription | null;
}

export default function SubscriptionManager({ subscription }: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Create a portal session
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });
      
      const { url } = await response.json();
      
      // Redirect to the portal
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If no subscription, show a message and link to pricing
  if (!subscription) {
    return (
      <div className="text-center py-6">
        <h2 className="text-xl font-semibold mb-4">No Active Subscription</h2>
        <p className="mb-6 text-gray-600">
          You don't have an active subscription. Subscribe to get access to all features.
        </p>
        <button
          onClick={() => window.location.href = '/pricing'}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          View Plans
        </button>
      </div>
    );
  }

  // Format dates
  const trialEndDate = subscription.trial_end_date 
    ? new Date(subscription.trial_end_date) 
    : null;
  
  const currentPeriodEnd = subscription.current_period_end 
    ? new Date(subscription.current_period_end) 
    : null;

  // Determine subscription status display
  const isTrialing = subscription.status === SUBSCRIPTION_STATUS.TRIALING;
  const isActive = subscription.status === SUBSCRIPTION_STATUS.ACTIVE;
  const isPastDue = subscription.status === SUBSCRIPTION_STATUS.PAST_DUE;
  const isCanceled = subscription.status === SUBSCRIPTION_STATUS.CANCELED;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Subscription</h2>
      
      <div className="space-y-4">
        {/* Subscription status */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <div className="mt-1">
            {isTrialing && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Trial
              </span>
            )}
            {isActive && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            )}
            {isPastDue && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Past Due
              </span>
            )}
            {isCanceled && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Canceled
              </span>
            )}
          </div>
        </div>
        
        {/* Trial end date */}
        {isTrialing && trialEndDate && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Trial Ends</h3>
            <p className="mt-1 text-sm text-gray-900">
              {format(trialEndDate, 'MMMM d, yyyy')}
            </p>
          </div>
        )}
        
        {/* Current period end */}
        {currentPeriodEnd && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {subscription.cancel_at_period_end ? 'Subscription Ends' : 'Next Billing Date'}
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {format(currentPeriodEnd, 'MMMM d, yyyy')}
            </p>
          </div>
        )}
        
        {/* Cancellation notice */}
        {subscription.cancel_at_period_end && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
            <p className="text-sm">
              Your subscription has been canceled and will end on {currentPeriodEnd && format(currentPeriodEnd, 'MMMM d, yyyy')}.
              You can reactivate your subscription before this date to continue your access.
            </p>
          </div>
        )}
        
        {/* Past due notice */}
        {isPastDue && (
          <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md">
            <p className="text-sm">
              Your payment is past due. Please update your payment method to continue your subscription.
            </p>
          </div>
        )}
        
        {/* Manage subscription button */}
        <div className="mt-6">
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? 'Loading...' : 'Manage Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
}
