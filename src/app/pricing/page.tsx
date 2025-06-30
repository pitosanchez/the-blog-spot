"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  SUBSCRIPTION_TIERS, 
  formatPrice, 
  getAnnualSavings, 
  getAnnualSavingsPercentage,
  type SubscriptionTier,
  type BillingInterval 
} from '@/lib/stripe';
import { useAnalytics, usePageTimeTracking } from '@/hooks/useAnalytics';

export default function PricingPage() {
  const { data: session } = useSession();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [isLoading, setIsLoading] = useState<SubscriptionTier | null>(null);
  const { trackSubscriptionAction, trackEvent } = useAnalytics();
  
  // Track time spent on pricing page
  usePageTimeTracking();

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!session) {
      // Track subscription attempt without login
      trackEvent('subscription_attempt_no_auth', { tier, interval: billingInterval });
      // Redirect to login with return URL
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent('/pricing')}`;
      return;
    }

    // Track subscription start attempt
    trackSubscriptionAction('start', tier);
    trackEvent('subscription_checkout_start', { 
      tier, 
      interval: billingInterval,
      price: billingInterval === 'monthly' 
        ? SUBSCRIPTION_TIERS[tier].monthlyPrice 
        : SUBSCRIPTION_TIERS[tier].annualPrice
    });

    setIsLoading(tier);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          interval: billingInterval,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?subscription=canceled`,
        }),
      });

      const { sessionId } = await response.json();

      if (sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await import('@stripe/stripe-js').then(mod => 
          mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        );
        
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        }
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const PricingCard = ({ 
    tier, 
    config, 
    isPopular = false 
  }: { 
    tier: SubscriptionTier; 
    config: typeof SUBSCRIPTION_TIERS[SubscriptionTier];
    isPopular?: boolean;
  }) => {
    const price = billingInterval === 'monthly' ? config.monthlyPrice : config.annualPrice;
    const annualSavings = getAnnualSavings(tier);
    const savingsPercentage = getAnnualSavingsPercentage(tier);

    return (
      <div className={`relative bg-white rounded-2xl shadow-lg ${isPopular ? 'ring-2 ring-blue-600' : 'border border-gray-200'}`}>
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}

        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900">{config.name}</h3>
          <p className="mt-2 text-gray-600">{config.description}</p>
          
          <div className="mt-6">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(price)}
              </span>
              <span className="text-gray-600 ml-2">
                /{billingInterval === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            
            {billingInterval === 'annual' && annualSavings > 0 && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Save {formatPrice(annualSavings)} ({savingsPercentage}%)
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => handleSubscribe(tier)}
            disabled={isLoading === tier}
            className={`w-full mt-8 px-6 py-3 rounded-lg font-medium transition-colors ${
              isPopular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading === tier ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Processing...
              </div>
            ) : (
              `Get Started with ${config.name}`
            )}
          </button>

          <ul className="mt-8 space-y-4">
            {config.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Limits */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Plan Limits</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Publications:</span>
                <span>{config.limits.publications === -1 ? 'Unlimited' : config.limits.publications}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage:</span>
                <span>{config.limits.storage}</span>
              </div>
              {config.limits.teamMembers && (
                <div className="flex justify-between">
                  <span>Team Members:</span>
                  <span>{config.limits.teamMembers === -1 ? 'Unlimited' : config.limits.teamMembers}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Start sharing medical knowledge with a plan that fits your needs. 
            All plans include HIPAA-compliant features and medical-grade security.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`relative px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                billingInterval === 'monthly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`relative px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                billingInterval === 'annual'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Save up to 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PricingCard
            tier="INDIVIDUAL"
            config={SUBSCRIPTION_TIERS.INDIVIDUAL}
          />
          <PricingCard
            tier="PRACTICE"
            config={SUBSCRIPTION_TIERS.PRACTICE}
            isPopular={true}
          />
          <PricingCard
            tier="INSTITUTION"
            config={SUBSCRIPTION_TIERS.INSTITUTION}
          />
        </div>

        {/* Additional Information */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Model */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Sharing</h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Platform fee: 8% on subscription revenue</p>
                  <p>• CME credits: $50 per credit</p>
                  <p>• Conference tickets: 30% platform fee</p>
                  <p>• Sponsorships: $5,000 - $50,000/month</p>
                </div>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                <div className="space-y-3 text-gray-600">
                  <p>• HIPAA-compliant infrastructure</p>
                  <p>• Medical terminology database</p>
                  <p>• CME credit management</p>
                  <p>• Advanced analytics</p>
                  <p>• Mobile app access</p>
                  <p>• 24/7 technical support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. 
                Changes take effect immediately, and you'll be prorated for any differences.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                All plans come with a 14-day free trial. No credit card required to start.
                You can cancel anytime during the trial period.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does HIPAA compliance work?
              </h3>
              <p className="text-gray-600">
                Our platform is built with HIPAA compliance from the ground up. 
                All data is encrypted, access is logged, and we provide PHI detection tools 
                to help you maintain compliance.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and ACH transfers through Stripe. 
                All payments are processed securely with PCI compliance.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Sharing Medical Knowledge?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of medical professionals already using MediPublish
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!session ? (
                <>
                  <Link
                    href="/auth/register"
                    className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/auth/login"
                    className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  href="/create"
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Creating Content
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}