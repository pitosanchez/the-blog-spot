"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatPrice, calculateCreatorEarnings, calculatePlatformFee, PLATFORM_FEE_PERCENTAGE } from '@/lib/stripe';

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  platformFees: number;
  subscribers: number;
  publications: number;
  cmeCreditsEarned: number;
  sponsorshipRevenue: number;
  recentTransactions: Transaction[];
  monthlyBreakdown: MonthlyEarning[];
}

interface Transaction {
  id: string;
  type: 'SUBSCRIPTION' | 'CME' | 'SPONSORSHIP' | 'CONFERENCE';
  amount: number;
  platformFee: number;
  netEarnings: number;
  description: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

interface MonthlyEarning {
  month: string;
  earnings: number;
  subscribers: number;
  publications: number;
}

export default function EarningsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "CREATOR") {
      router.push("/auth/login");
      return;
    }

    fetchEarningsData();
  }, [session, status, router, timeRange]);

  const fetchEarningsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/creators/earnings?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setEarningsData(data);
      }
    } catch (error) {
      console.error('Error fetching earnings data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!earningsData || earningsData.totalEarnings < 100) {
      alert('Minimum withdrawal amount is $100');
      return;
    }

    try {
      const response = await fetch('/api/creators/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: earningsData.totalEarnings }),
      });

      if (response.ok) {
        alert('Withdrawal request submitted successfully');
        fetchEarningsData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      alert('Error processing withdrawal request');
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!earningsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load earnings data</h2>
          <button 
            onClick={fetchEarningsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Creator Earnings</h1>
              <p className="mt-2 text-gray-600">
                Track your revenue and subscriber growth
              </p>
            </div>
            
            <div className="flex space-x-4">
              {/* Time Range Filter */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              <button
                onClick={handleWithdraw}
                disabled={earningsData.totalEarnings < 100}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Withdraw Earnings
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">$</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(earningsData.totalEarnings)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{earningsData.subscribers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">📄</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Publications</p>
                <p className="text-2xl font-bold text-gray-900">{earningsData.publications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">🏆</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">CME Credits</p>
                <p className="text-2xl font-bold text-gray-900">{earningsData.cmeCreditsEarned}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Revenue Breakdown</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Subscription Revenue */}
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Subscription Revenue</h4>
                      <p className="text-sm text-gray-600">
                        {earningsData.subscribers} subscribers • {PLATFORM_FEE_PERCENTAGE}% platform fee
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(earningsData.monthlyEarnings)}
                      </p>
                      <p className="text-sm text-gray-500">
                        -{formatPrice(calculatePlatformFee(earningsData.monthlyEarnings))} fee
                      </p>
                    </div>
                  </div>

                  {/* CME Credits */}
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">CME Credits</h4>
                      <p className="text-sm text-gray-600">
                        $50 per credit • {earningsData.cmeCreditsEarned} credits sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(earningsData.cmeCreditsEarned * 50)}
                      </p>
                    </div>
                  </div>

                  {/* Sponsorship Revenue */}
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Sponsorship Revenue</h4>
                      <p className="text-sm text-gray-600">
                        Direct sponsorship deals
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(earningsData.sponsorshipRevenue)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Withdrawal Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Withdrawal</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium">{formatPrice(earningsData.totalEarnings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum</span>
                  <span className="font-medium">$100.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Revenue per User</span>
                  <span className="font-medium">
                    {formatPrice(earningsData.subscribers > 0 ? earningsData.monthlyEarnings / earningsData.subscribers : 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Content Views</span>
                  <span className="font-medium">12,543</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engagement Rate</span>
                  <span className="font-medium">8.2%</span>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Tax Information</h4>
              <p className="text-sm text-yellow-700">
                You'll receive a 1099 form for earnings over $600. 
                Keep records of your expenses for tax deductions.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earningsData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'SUBSCRIPTION' ? 'bg-blue-100 text-blue-800' :
                        transaction.type === 'CME' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.type === 'SPONSORSHIP' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -{formatPrice(transaction.platformFee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(transaction.netEarnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}