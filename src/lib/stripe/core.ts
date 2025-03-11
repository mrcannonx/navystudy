import { Stripe } from 'stripe';

// Check if we're on the server side
const isServer = typeof window === 'undefined';

// Initialize Stripe with the secret key only on the server side
const stripe = isServer 
  ? new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia',
    })
  : null; // Will be null on the client side

// Constants
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIALING: 'trialing',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  UNPAID: 'unpaid',
};

export { isServer };
export default stripe;
