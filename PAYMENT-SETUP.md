# Payment System Setup Guide

This guide explains how to set up and use the Stripe payment integration for subscription-based access to the application.

## Overview

The payment system allows users to subscribe to a premium plan with the following features:
- Monthly subscription: $20/month
- Yearly subscription: $204/year (15% discount)
- 3-day free trial for all new subscriptions
- Subscription management through Stripe Customer Portal

## Prerequisites

- Stripe account with API keys
- Supabase database set up
- Node.js and npm installed

## Setup Steps

### 1. Environment Variables

Make sure your `.env` file contains the following Stripe-related variables:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Setup

Run the Supabase migration to create the necessary tables:

```bash
npx supabase migration up
```

This will create:
- `subscription_plans` table - Stores available subscription plans
- `user_subscriptions` table - Stores user subscription information

### 3. Create Subscription Plans

Run the setup script to create the subscription plans in both Stripe and your database:

```bash
npm run setup-subscription-plans
```

This script:
- Creates a product in Stripe
- Creates monthly and yearly prices
- Adds the plan to your database with the Stripe price IDs

### 4. Stripe Webhook Setup

For production, set up a Stripe webhook to handle subscription events:

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Create a new webhook endpoint with your application URL:
   - URL: `https://your-domain.com/api/stripe/webhooks`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. Copy the webhook signing secret and add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

For local development, you can use the Stripe CLI to forward webhook events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

## Usage

### Subscription Flow

1. Users visit the pricing page (`/pricing`)
2. They select a plan (monthly or yearly)
3. They click "Start Free Trial"
4. If not logged in, they are prompted to create an account or log in
5. They are redirected to Stripe Checkout to enter payment details
6. After successful payment, they are redirected back to the application
7. They now have access to premium features for the duration of their trial/subscription

### Managing Subscriptions

Users can manage their subscription by:

1. Going to the subscription management page (`/settings/subscription`)
2. Clicking "Manage Subscription"
3. They are redirected to the Stripe Customer Portal where they can:
   - Update payment method
   - Change subscription plan
   - Cancel subscription

## Testing

For testing, you can use Stripe's test cards:

- Success: `4242 4242 4242 4242`
- Requires Authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

Use any future expiration date, any 3-digit CVC, and any postal code.

## Troubleshooting

- **Webhook errors**: Check that your webhook secret is correct and that the webhook is properly configured in Stripe.
- **Payment failures**: Check the Stripe dashboard for detailed error messages.
- **Database issues**: Verify that the migration ran successfully and that the tables were created.

## Files Overview

- `src/lib/stripe.ts` - Stripe utility functions
- `src/app/api/stripe/create-checkout-session/route.ts` - API route for creating checkout sessions
- `src/app/api/stripe/create-portal-session/route.ts` - API route for creating portal sessions
- `src/app/api/stripe/webhooks/route.ts` - Webhook handler for Stripe events
- `src/middleware.ts` - Middleware for protecting routes based on subscription status
- `src/app/pricing/page.tsx` - Pricing page
- `src/components/subscription/PricingPlans.tsx` - Pricing plans component
- `src/app/settings/subscription/page.tsx` - Subscription management page
- `src/components/subscription/SubscriptionManager.tsx` - Subscription management component
- `scripts/setup-subscription-plans.js` - Script to set up subscription plans
