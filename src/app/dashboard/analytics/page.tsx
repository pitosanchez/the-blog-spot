"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { EngagementScorer } from '@/lib/analytics';

interface AnalyticsData {
  overview: {
    totalPublications: number;
    totalViews: number;
    totalEngagement: number;
    avgEngagementRate: number;
    topPerformingContent: string;
  };
  publicationStats: Array<{
    id: string;
    title: string;
    views: number;
    uniqueViews: number;
    likes: number;
    shares: number;
    comments: number;
    bookmarks: number;
    cmeCompletions: number;
    engagementScore: number;
    createdAt: string;
  }>;
  topContent: Array<{
    id: string;
    title: string;
    views: number;
    engagementScore: number;
  }>;
  timeSeries: {
    views: Array<{ date: string; value: number }>;
    engagement: Array<{ date: string; value: number }>;
  };
  audienceInsights: {
    totalUniqueViewers: number;
    roleDistribution: Record<string, number>;
    newVsReturning: {
      new: number;
      returning: number;
    };
  };
}

interface PlatformData {
  overview: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    totalPublications: number;
    newPublications: number;
    totalSubscriptions: number;
  };
  engagement: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
  };
  topContent: Array<{
    id: string;
    title: string;
    author: string;
    views: number;
    engagement: number;
  }>;
  popularSearches: Array<{
    query: string;
    searchCount: number;
  }>;
  userGrowth: Array<{
    date: string;
    newUsers: number;
  }>;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | PlatformData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'audience' | 'engagement'>('overview');

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    fetchAnalyticsData();
  }, [session, status, router, timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load analytics data</h2>
          <button 
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isCreatorView = session?.user?.role === 'CREATOR' && 'publicationStats' in analyticsData;
  const isPlatformView = session?.user?.role === 'ADMIN' && 'userGrowth' in analyticsData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isPlatformView ? 'Platform Analytics' : 'Creator Analytics'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isPlatformView 
                  ? 'Track platform-wide performance and user engagement'
                  : 'Monitor your content performance and audience engagement'
                }
              </p>
            </div>
            
            <div className="flex space-x-4">
              {/* Time Range Filter */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              <button
                onClick={() => fetchAnalyticsData()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'content', label: 'Content Performance', icon: '📄' },
              { id: 'audience', label: 'Audience', icon: '👥' },
              { id: 'engagement', label: 'Engagement', icon: '💬' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <OverviewTab 
            data={analyticsData} 
            isCreatorView={isCreatorView}
            isPlatformView={isPlatformView}
          />
        )}

        {activeTab === 'content' && isCreatorView && (
          <ContentTab data={analyticsData as AnalyticsData} />
        )}

        {activeTab === 'audience' && isCreatorView && (
          <AudienceTab data={analyticsData as AnalyticsData} />
        )}

        {activeTab === 'engagement' && (
          <EngagementTab 
            data={analyticsData} 
            isCreatorView={isCreatorView}
            isPlatformView={isPlatformView}
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({ 
  data, 
  isCreatorView, 
  isPlatformView 
}: { 
  data: AnalyticsData | PlatformData; 
  isCreatorView: boolean;
  isPlatformView: boolean;
}) {
  if (isPlatformView && 'userGrowth' in data) {
    const platformData = data as PlatformData;
    return (
      <div className="space-y-6">
        {/* Platform Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={platformData.overview.totalUsers.toLocaleString()}
            change={`+${platformData.overview.newUsers} new`}
            icon="👥"
            trend="up"
          />
          <StatCard
            title="Active Users"
            value={platformData.overview.activeUsers.toLocaleString()}
            icon="🟢"
          />
          <StatCard
            title="Total Publications"
            value={platformData.overview.totalPublications.toLocaleString()}
            change={`+${platformData.overview.newPublications} new`}
            icon="📄"
            trend="up"
          />
          <StatCard
            title="Total Views"
            value={platformData.engagement.totalViews.toLocaleString()}
            icon="👁️"
          />
          <StatCard
            title="Total Engagement"
            value={(platformData.engagement.totalLikes + platformData.engagement.totalShares + platformData.engagement.totalComments).toLocaleString()}
            icon="💬"
          />
          <StatCard
            title="Subscriptions"
            value={platformData.overview.totalSubscriptions.toLocaleString()}
            icon="💳"
          />
        </div>

        {/* Top Content and Popular Searches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Content</h3>
            <div className="space-y-3">
              {platformData.topContent.slice(0, 5).map((content, index) => (
                <div key={content.id} className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {index + 1}. {content.title}
                    </p>
                    <p className="text-xs text-gray-500">by {content.author}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {content.views.toLocaleString()} views
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Searches</h3>
            <div className="space-y-3">
              {platformData.popularSearches.slice(0, 5).map((search, index) => (
                <div key={search.query} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">
                    {index + 1}. {search.query}
                  </span>
                  <span className="text-sm text-gray-500">
                    {search.searchCount.toLocaleString()} searches
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCreatorView && 'publicationStats' in data) {
    const creatorData = data as AnalyticsData;
    return (
      <div className="space-y-6">
        {/* Creator Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Publications"
            value={creatorData.overview.totalPublications.toString()}
            icon="📄"
          />
          <StatCard
            title="Total Views"
            value={creatorData.overview.totalViews.toLocaleString()}
            icon="👁️"
          />
          <StatCard
            title="Total Engagement"
            value={creatorData.overview.totalEngagement.toLocaleString()}
            icon="💬"
          />
          <StatCard
            title="Engagement Rate"
            value={`${creatorData.overview.avgEngagementRate}%`}
            icon="📈"
          />
        </div>

        {/* Top Performing Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Content</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Content</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Views</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Engagement Score</th>
                </tr>
              </thead>
              <tbody>
                {creatorData.topContent.slice(0, 5).map((content) => (
                  <tr key={content.id} className="border-b border-gray-100">
                    <td className="py-3 px-3 text-sm text-gray-900">{content.title}</td>
                    <td className="py-3 px-3 text-sm text-gray-500">{content.views.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(content.engagementScore, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{content.engagementScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function ContentTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Views</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Unique Views</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Likes</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Shares</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Comments</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Engagement Score</th>
              </tr>
            </thead>
            <tbody>
              {data.publicationStats.map((pub) => (
                <tr key={pub.id} className="border-b border-gray-100">
                  <td className="py-3 px-3 text-sm text-gray-900 max-w-xs truncate">{pub.title}</td>
                  <td className="py-3 px-3 text-sm text-gray-500">{pub.views.toLocaleString()}</td>
                  <td className="py-3 px-3 text-sm text-gray-500">{pub.uniqueViews.toLocaleString()}</td>
                  <td className="py-3 px-3 text-sm text-gray-500">{pub.likes}</td>
                  <td className="py-3 px-3 text-sm text-gray-500">{pub.shares}</td>
                  <td className="py-3 px-3 text-sm text-gray-500">{pub.comments}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pub.engagementScore >= 80 ? 'bg-green-100 text-green-800' :
                      pub.engagementScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      pub.engagementScore >= 40 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {pub.engagementScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AudienceTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Unique Viewers"
          value={data.audienceInsights.totalUniqueViewers.toLocaleString()}
          icon="👥"
        />
        <StatCard
          title="New Viewers"
          value={data.audienceInsights.newVsReturning.new.toLocaleString()}
          icon="🆕"
        />
        <StatCard
          title="Returning Viewers"
          value={data.audienceInsights.newVsReturning.returning.toLocaleString()}
          icon="🔄"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Audience by Role</h3>
        <div className="space-y-3">
          {Object.entries(data.audienceInsights.roleDistribution).map(([role, count]) => (
            <div key={role} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{role}</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(count / data.audienceInsights.totalUniqueViewers) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EngagementTab({ 
  data, 
  isCreatorView, 
  isPlatformView 
}: { 
  data: AnalyticsData | PlatformData; 
  isCreatorView: boolean;
  isPlatformView: boolean;
}) {
  if (isPlatformView && 'engagement' in data) {
    const platformData = data as PlatformData;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Likes"
            value={platformData.engagement.totalLikes.toLocaleString()}
            icon="👍"
          />
          <StatCard
            title="Total Shares"
            value={platformData.engagement.totalShares.toLocaleString()}
            icon="🔄"
          />
          <StatCard
            title="Total Comments"
            value={platformData.engagement.totalComments.toLocaleString()}
            icon="💬"
          />
          <StatCard
            title="Engagement Rate"
            value={`${((platformData.engagement.totalLikes + platformData.engagement.totalShares + platformData.engagement.totalComments) / platformData.engagement.totalViews * 100).toFixed(1)}%`}
            icon="📈"
          />
        </div>
      </div>
    );
  }

  if (isCreatorView && 'publicationStats' in data) {
    const creatorData = data as AnalyticsData;
    const totalLikes = creatorData.publicationStats.reduce((sum, p) => sum + p.likes, 0);
    const totalShares = creatorData.publicationStats.reduce((sum, p) => sum + p.shares, 0);
    const totalComments = creatorData.publicationStats.reduce((sum, p) => sum + p.comments, 0);
    const totalBookmarks = creatorData.publicationStats.reduce((sum, p) => sum + p.bookmarks, 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Likes"
            value={totalLikes.toLocaleString()}
            icon="👍"
          />
          <StatCard
            title="Total Shares"
            value={totalShares.toLocaleString()}
            icon="🔄"
          />
          <StatCard
            title="Total Comments"
            value={totalComments.toLocaleString()}
            icon="💬"
          />
          <StatCard
            title="Total Bookmarks"
            value={totalBookmarks.toLocaleString()}
            icon="🔖"
          />
        </div>
      </div>
    );
  }

  return null;
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  change?: string; 
  icon: string; 
  trend?: 'up' | 'down';
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg">{icon}</span>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}