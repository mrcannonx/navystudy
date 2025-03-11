'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionPlan } from '@/types/database';
import { CheckIcon } from 'lucide-react';

interface PricingPlansProps {
  plans: SubscriptionPlan[];
}

export default function PricingPlans({ plans }: PricingPlansProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleBillingInterval = () => {
    setBillingInterval(billingInterval === 'month' ? 'year' : 'month');
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      setIsLoading(true);
      
      // Get the price ID based on the billing interval
      const priceId = billingInterval === 'month' 
        ? plan.stripe_monthly_price_id 
        : plan.stripe_yearly_price_id;
      
      // Create a checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });
      
      const { url } = await response.json();
      
      // Redirect to the checkout page
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If no plans are available, show a message
  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">No subscription plans available</h2>
        <p className="mt-2 text-gray-600">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Billing interval toggle */}
      <div className="flex justify-center mb-8">
        <div className="relative flex items-center p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setBillingInterval('month')}
            className={`relative px-4 py-2 text-sm font-medium rounded-md ${
              billingInterval === 'month'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`relative px-4 py-2 text-sm font-medium rounded-md ${
              billingInterval === 'year'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Yearly <span className="text-green-600 font-medium">(Save 15%)</span>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid gap-8 md:grid-cols-1">
        {plans.map((plan) => {
          // Calculate the price based on the billing interval
          const price = billingInterval === 'month'
            ? (plan.price_monthly / 100).toFixed(2)
            : (plan.price_yearly / 100).toFixed(2);
          
          // Parse features from JSON string if needed
          const features = typeof plan.features === 'string'
            ? JSON.parse(plan.features)
            : plan.features;

          return (
            <div
              key={plan.id}
              className="flex flex-col p-6 bg-white rounded-lg border shadow-sm"
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-gray-600">{plan.description}</p>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold">${price}</span>
                <span className="ml-1 text-xl text-gray-600">
                  /{billingInterval}
                </span>
              </div>
              
              <p className="mt-2 text-blue-600">
                Includes {plan.trial_days}-day free trial
              </p>
              
              <ul className="mt-6 space-y-4">
                {Array.isArray(features) && features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading}
                className="mt-8 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm disabled:opacity-70"
              >
                {isLoading ? 'Processing...' : 'Start Free Trial'}
              </button>
              
              <div className="mt-3 text-center">
                <a 
                  href="/signup" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  New user? Sign up with subscription
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
