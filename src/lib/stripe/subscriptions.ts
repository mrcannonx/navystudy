import { Stripe } from 'stripe';
import { supabase } from '../supabase';
import stripe, { isServer, SUBSCRIPTION_STATUS } from './core';
import { UserSubscription, SubscriptionPlan } from '@/types/database';

/**
 * Get subscription details for a user
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as unknown as UserSubscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', userId)
      .in('status', [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIALING])
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Error checking active subscription:', error);
    // For development, return true to allow access
    return process.env.NODE_ENV === 'development';
  }
}

/**
 * Get all subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .order('price_monthly', { ascending: true });

    if (error || !data) {
      // If there's an error or no data, return a mock plan for development
      if (process.env.NODE_ENV === 'development') {
        return [{
          id: 'mock-plan-id',
          created_at: new Date().toISOString(),
          name: 'Premium Plan',
          description: 'Full access to all tools and features',
          price_monthly: 2000,
          price_yearly: 20400,
          features: [
            'Access to Flashcards Generator',
            'Quiz Generator',
            'AI Summarizer',
            'Eval Builder',
            'Unlimited AI Generation',
          ],
          stripe_monthly_price_id: 'price_mock_monthly',
          stripe_yearly_price_id: 'price_mock_yearly',
          trial_days: 3,
          active: true
        }];
      }
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    // For development, return a mock plan
    if (process.env.NODE_ENV === 'development') {
      return [{
        id: 'mock-plan-id',
        created_at: new Date().toISOString(),
        name: 'Premium Plan',
        description: 'Full access to all tools and features',
        price_monthly: 2000,
        price_yearly: 20400,
        features: [
          'Access to Flashcards Generator',
          'Quiz Generator',
          'AI Summarizer',
          'Eval Builder',
          'Unlimited AI Generation',
        ],
        stripe_monthly_price_id: 'price_mock_monthly',
        stripe_yearly_price_id: 'price_mock_yearly',
        trial_days: 3,
        active: true
      }];
    }
    return [];
  }
}

/**
 * Update subscription in database from Stripe event
 */
export async function updateSubscriptionFromStripeEvent(
  stripeSubscription: Stripe.Subscription
) {
  if (!isServer) {
    throw new Error('This function can only be called on the server side');
  }

  const customerId = stripeSubscription.customer as string;
  
  // Find the user subscription by Stripe customer ID
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('id, user_id, plan_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!subscription) {
    console.error('No subscription found for customer', customerId);
    return;
  }

  // Update the subscription status
  await supabase
    .from('user_subscriptions')
    .update({
      status: stripeSubscription.status,
      current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      trial_end_date: stripeSubscription.trial_end 
        ? new Date(stripeSubscription.trial_end * 1000).toISOString() 
        : null,
    })
    .eq('id', subscription.id);
}

/**
 * Create a new subscription in the database
 */
export async function createSubscriptionRecord(
  userId: string,
  planId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  status: string,
  trialEndDate?: Date | null,
  currentPeriodStart?: Date | null,
  currentPeriodEnd?: Date | null
) {
  if (!isServer) {
    throw new Error('This function can only be called on the server side');
  }
  
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      status,
      trial_end_date: trialEndDate?.toISOString(),
      current_period_start: currentPeriodStart?.toISOString(),
      current_period_end: currentPeriodEnd?.toISOString(),
      cancel_at_period_end: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription record:', error);
    throw error;
  }

  return data;
}
