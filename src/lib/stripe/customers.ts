import { supabase } from '../supabase';
import stripe, { isServer } from './core';

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function createOrRetrieveCustomer(userId: string, email?: string, name?: string) {
  if (!isServer || !stripe) {
    throw new Error('This function can only be called on the server side');
  }

  // Check if the user already has a customer ID
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (subscription?.stripe_customer_id) {
    // Return existing customer
    return await stripe.customers.retrieve(subscription.stripe_customer_id);
  }

  // Get user profile if email or name not provided
  if (!email || !name) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (profile) {
      email = email || profile.email;
      name = name || profile.full_name;
    }
  }

  // Create a new customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  return customer;
}
