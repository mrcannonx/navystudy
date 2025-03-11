import stripe, { SUBSCRIPTION_STATUS, isServer } from './core';
import { createOrRetrieveCustomer } from './customers';
import { 
  getUserSubscription, 
  hasActiveSubscription, 
  getSubscriptionPlans,
  updateSubscriptionFromStripeEvent,
  createSubscriptionRecord
} from './subscriptions';
import { createCheckoutSession, createPortalSession } from './checkout';
import { getFinancialMetrics } from './analytics';

// Export everything from the modules
export {
  stripe as default,
  SUBSCRIPTION_STATUS,
  isServer,
  createOrRetrieveCustomer,
  getUserSubscription,
  hasActiveSubscription,
  getSubscriptionPlans,
  updateSubscriptionFromStripeEvent,
  createSubscriptionRecord,
  createCheckoutSession,
  createPortalSession,
  getFinancialMetrics
};
