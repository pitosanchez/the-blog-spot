"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatPrice, SUBSCRIPTION_TIERS, type SubscriptionTier } from '@/lib/stripe';

interface SubscriptionData {
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INACTIVE';
  tier: SubscriptionTier | null;
  interval: 'MONTHLY' | 'ANNUAL';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  nextBillingDate: string;
  amount: number;
  stripeCustomerId: string;
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    fetchSubscriptionData();
  }, [session, status, router]);

  const fetchSubscriptionData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/dashboard/subscription`,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert('Failed to open subscription management portal');
      }
    } catch (error) {
      alert('Error opening subscription management portal');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PAST_DUE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'PAST_DUE':
        return 'Past Due';
      case 'CANCELED':
        return 'Canceled';
      case 'INACTIVE':
        return 'No Subscription';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your MediPublish subscription and billing information
          </p>
        </div>

        {subscriptionData ? (
          <div className="space-y-6">
            {/* Current Subscription */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Current Subscription</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(subscriptionData.status)}`}>
                    {getStatusText(subscriptionData.status)}
                  </span>
                </div>
              </div>
              
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Plan</h4>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {subscriptionData.tier ? SUBSCRIPTION_TIERS[subscriptionData.tier].name : 'No Plan'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {subscriptionData.interval === 'ANNUAL' ? 'Annual' : 'Monthly'} billing
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {formatPrice(subscriptionData.amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      per {subscriptionData.interval === 'ANNUAL' ? 'year' : 'month'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      {subscriptionData.cancelAtPeriodEnd ? 'Expires' : 'Next billing'}
                    </h4>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {new Date(subscriptionData.nextBillingDate).toLocaleDateString()}
                    </p>
                    {subscriptionData.cancelAtPeriodEnd && (
                      <p className="text-sm text-orange-600">
                        Subscription will be canceled
                      </p>
                    )}
                  </div>
                </div>

                {/* Plan Features */}
                {subscriptionData.tier && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Plan Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SUBSCRIPTION_TIERS[subscriptionData.tier].features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Actions</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleManageSubscription}
                  disabled={isUpdating}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Loading...' : 'Manage Subscription'}
                </button>
                
                {subscriptionData.status === 'ACTIVE' && subscriptionData.tier !== 'INSTITUTION' && (
                  <button
                    onClick={handleUpgrade}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Upgrade Plan
                  </button>
                )}
              </div>
              
              <p className="mt-4 text-sm text-gray-600">
                Use "Manage Subscription" to update payment methods, change billing cycle, 
                download invoices, or cancel your subscription.
              </p>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">
                  Access your complete billing history and download invoices through the 
                  subscription management portal.
                </p>
                <button
                  onClick={handleManageSubscription}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Billing History →
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-800 mb-4">
                Have questions about your subscription or need assistance with billing?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:support@medipublish.com"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Contact Support
                </a>
                <a
                  href="/help/billing"
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100"
                >
                  Billing FAQ
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* No Subscription */
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-600">
                You don't have an active subscription. Choose a plan to start sharing medical knowledge.
              </p>
            </div>
            
            <button
              onClick={handleUpgrade}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}