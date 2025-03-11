import stripe, { isServer } from './core';
import { createOrRetrieveCustomer } from './customers';
import { supabase } from '../supabase';

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!isServer || !stripe) {
    throw new Error('This function can only be called on the server side');
  }

  // Validate Stripe API key
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe API key is not configured');
  }

  // Validate inputs
  if (!userId) throw new Error('User ID is required');
  if (!priceId) throw new Error('Price ID is required');
  if (!successUrl) throw new Error('Success URL is required');
  if (!cancelUrl) throw new Error('Cancel URL is required');

  try {
    // In development mode with mock price IDs, we need to use a real test price ID
    // to ensure the Stripe checkout process works correctly
    let actualPriceId = priceId;
    
    if (process.env.NODE_ENV === 'development' && 
        (priceId === 'price_mock_monthly' || priceId === 'price_mock_yearly')) {
      console.log('Development mode detected with mock price ID');
      
      try {
        // Create a test price for development mode
        // This ensures we have a valid price ID to use with Stripe checkout
        const testProduct = await stripe.products.create({
          name: 'Test Premium Access',
          description: 'Test product for development mode',
        });
        
        const testPrice = await stripe.prices.create({
          product: testProduct.id,
          unit_amount: priceId === 'price_mock_yearly' ? 20400 : 2000,
          currency: 'usd',
          recurring: {
            interval: priceId === 'price_mock_yearly' ? 'year' : 'month',
          },
        });
        
        console.log(`Created test price for development: ${testPrice.id}`);
        actualPriceId = testPrice.id;
      } catch (testPriceError) {
        console.error('Error creating test price:', testPriceError);
        throw new Error('Failed to create test price for development mode');
      }
    }
    
    // For real price IDs, proceed with normal flow
    // Get or create customer
    console.log(`Creating/retrieving Stripe customer for user ${userId}`);
    const customer = await createOrRetrieveCustomer(userId);
    console.log(`Using Stripe customer: ${customer.id}`);

    // Validate the price ID exists in Stripe
    try {
      console.log(`Verifying price ID: ${actualPriceId}`);
      await stripe.prices.retrieve(actualPriceId);
    } catch (priceError) {
      console.error('Error retrieving price from Stripe:', priceError);
      throw new Error(`Invalid price ID: ${actualPriceId}. The subscription plan may not exist.`);
    }

    // Create the checkout session
    console.log('Creating Stripe checkout session');
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required', // Force collection of billing address
      customer_update: {
        name: 'auto', // Collect customer name
        address: 'auto' // Sync address with billing address
      },
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 3,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    console.log(`Checkout session created: ${session.id}`);
    return session;
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    
    // Rethrow with more context
    if (error instanceof Error) {
      throw error; // Already has a good error message
    } else {
      throw new Error('Failed to create Stripe checkout session');
    }
  }
}

/**
 * Create a portal session for managing subscriptions
 */
export async function createPortalSession(
  userId: string,
  returnUrl: string
) {
  if (!isServer || !stripe) {
    throw new Error('This function can only be called on the server side');
  }

  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (!subscription?.stripe_customer_id) {
    throw new Error('No subscription found for this user');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: returnUrl,
  });

  return session;
}
