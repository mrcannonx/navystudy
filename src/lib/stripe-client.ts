"use client"

// Constants that can be used on the client side
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIALING: 'trialing',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  UNPAID: 'unpaid',
};

// Keep a reference to the promise of loading the Stripe script
let stripePromise: Promise<any> | null = null;

// Initialize Stripe with the publishable key for client-side usage
export const loadStripe = async () => {
  if (!stripePromise) {
    stripePromise = new Promise((resolve, reject) => {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      
      if (!publishableKey) {
        reject(new Error('Stripe publishable key is missing'));
        return;
      }
      
      // Check if Stripe is already loaded
      if ((window as any).Stripe) {
        resolve((window as any).Stripe(publishableKey));
        return;
      }
      
      // Load the Stripe.js script
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => {
        if ((window as any).Stripe) {
          resolve((window as any).Stripe(publishableKey));
        } else {
          reject(new Error('Stripe.js failed to load'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load Stripe.js'));
      };
      
      document.head.appendChild(script);
    });
  }
  
  return stripePromise;
};

// Client-side function to redirect to checkout
export const redirectToCheckout = async (sessionId: string) => {
  try {
    const stripe = await loadStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });
    
    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Failed to redirect to checkout:', error);
    throw error;
  }
};
