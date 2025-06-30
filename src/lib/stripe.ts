import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Check if Stripe is configured
const isStripeConfigured = () => {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
};

// Server-side Stripe instance getter
export const getServerStripe = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getServerStripe should only be called on the server');
  }

  if (!isStripeConfigured()) {
    console.warn('⚠️  Stripe is not configured - using mock implementation');
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil',
    typescript: true,
  });
};

// Client-side Stripe instance
let stripePromise: Promise<any>;
export const getClientStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (publishableKey) {
      stripePromise = loadStripe(publishableKey);
    } else {
      console.warn('⚠️  Stripe publishable key not configured');
      stripePromise = Promise.resolve(null);
    }
  }
  return stripePromise;
};

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  INDIVIDUAL: {
    name: 'Individual',
    description: 'Perfect for individual medical professionals',
    monthlyPrice: 29,
    annualPrice: 290, // 2 months free
    stripePriceId: {
      monthly:
        process.env.STRIPE_INDIVIDUAL_PRICE_ID ||
        'price_mock_individual_monthly',
      annual:
        process.env.STRIPE_INDIVIDUAL_ANNUAL_PRICE_ID ||
        'price_mock_individual_annual',
    },
    features: [
      'Access to all medical content',
      'Create unlimited publications',
      'Basic analytics',
      'Email support',
      'CME credit tracking',
      'Mobile app access',
    ],
    limits: {
      publications: -1, // unlimited
      subscribers: -1,
      storage: '10GB',
    },
  },
  PRACTICE: {
    name: 'Practice',
    description: 'Ideal for small practices and clinics',
    monthlyPrice: 99,
    annualPrice: 990,
    stripePriceId: {
      monthly:
        process.env.STRIPE_PRACTICE_PRICE_ID || 'price_mock_practice_monthly',
      annual:
        process.env.STRIPE_PRACTICE_ANNUAL_PRICE_ID ||
        'price_mock_practice_annual',
    },
    features: [
      'Everything in Individual',
      'Up to 5 creator accounts',
      'Advanced analytics',
      'Priority support',
      'Group CME tracking',
      'Custom branding',
      'Team collaboration tools',
    ],
    limits: {
      publications: -1,
      subscribers: -1,
      storage: '100GB',
      teamMembers: 5,
    },
  },
  INSTITUTION: {
    name: 'Institution',
    description: 'For hospitals and large medical institutions',
    monthlyPrice: 499,
    annualPrice: 4990,
    stripePriceId: {
      monthly:
        process.env.STRIPE_INSTITUTION_PRICE_ID ||
        'price_mock_institution_monthly',
      annual:
        process.env.STRIPE_INSTITUTION_ANNUAL_PRICE_ID ||
        'price_mock_institution_annual',
    },
    features: [
      'Everything in Practice',
      'Unlimited creator accounts',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced compliance features',
      'Bulk CME management',
      'API access',
    ],
    limits: {
      publications: -1,
      subscribers: -1,
      storage: '1TB',
      teamMembers: -1, // unlimited
    },
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export type BillingInterval = 'monthly' | 'annual';

// Helper functions
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getAnnualSavings(tier: SubscriptionTier): number {
  const tierConfig = SUBSCRIPTION_TIERS[tier];
  const annualMonthly = tierConfig.monthlyPrice * 12;
  return annualMonthly - tierConfig.annualPrice;
}

export function getAnnualSavingsPercentage(tier: SubscriptionTier): number {
  const tierConfig = SUBSCRIPTION_TIERS[tier];
  const annualMonthly = tierConfig.monthlyPrice * 12;
  const savings = annualMonthly - tierConfig.annualPrice;
  return Math.round((savings / annualMonthly) * 100);
}

// Mock functions for development
const createMockCustomer = async (
  email: string,
  name: string,
  userId: string
) => ({
  id: `cus_mock_${Date.now()}`,
  email,
  name,
  metadata: { userId },
});

const createMockCheckoutSession = async (data: any) => ({
  id: `cs_mock_${Date.now()}`,
  url: `${process.env.NEXTAUTH_URL}/pricing?mock=checkout&tier=${data.metadata?.tier}`,
  customer: data.customer,
  metadata: data.metadata,
});

// Create customer in Stripe
export async function createStripeCustomer(
  email: string,
  name: string,
  userId: string
): Promise<any> {
  const stripe = getServerStripe();

  if (!stripe) {
    return createMockCustomer(email, name, userId);
  }

  return await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });
}

// Create checkout session
export async function createCheckoutSession(params: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  tier: SubscriptionTier;
  interval: BillingInterval;
}): Promise<any> {
  const stripe = getServerStripe();

  if (!stripe) {
    return createMockCheckoutSession({
      customer: `cus_mock_${Date.now()}`,
      metadata: {
        userId: params.userId,
        tier: params.tier,
        interval: params.interval,
      },
    });
  }

  // Check if customer already exists
  let customer: Stripe.Customer;
  const existingCustomers = await stripe.customers.list({
    email: params.userEmail,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
  } else {
    customer = await createStripeCustomer(params.userEmail, '', params.userId);
  }

  return await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      tier: params.tier,
      interval: params.interval,
    },
    subscription_data: {
      metadata: {
        userId: params.userId,
        tier: params.tier,
        interval: params.interval,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer_update: {
      name: 'auto',
      address: 'auto',
    },
  });
}

// Calculate platform fee (8% as specified in requirements)
export const PLATFORM_FEE_PERCENTAGE = 8;

export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * (PLATFORM_FEE_PERCENTAGE / 100) * 100) / 100;
}

export function calculateCreatorEarnings(amount: number): number {
  return amount - calculatePlatformFee(amount);
}

// CME credit pricing
export const CME_CREDIT_PRICE = 50; // $50 per credit as specified

export function calculateCMEPrice(credits: number): number {
  return credits * CME_CREDIT_PRICE;
}

// Conference ticket pricing
export function calculateConferenceFee(ticketPrice: number): number {
  return Math.round(ticketPrice * 0.3 * 100) / 100; // 30% platform fee
}

export function calculateConferenceEarnings(ticketPrice: number): number {
  return ticketPrice - calculateConferenceFee(ticketPrice);
}
