"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useAnalytics, usePageTimeTracking } from '@/hooks/useAnalytics';
import { type SearchResult, type RecommendationResponse } from '@/lib/search';

interface TrendingData {
  trendingTopics: Array<{
    term: string;
    category: string;
    searchCount: number;
    growthRate: number;
    relatedTerms: string[];
  }>;
  trendingContent: Array<{
    id: string;
    title: string;
    slug: string;
    type: string;
    author: {
      name: string;
      specialties: string[];
    };
    publishedAt: string;
    metrics: {
      views: number;
      likes: number;
      shares: number;
      comments: number;
      engagementScore: number;
    };
    trendingRank: number;
  }>;
  searchCategories: Array<{
    category: string;
    totalSearches: number;
    topQueries: Array<{
      query: string;
      count: number;
    }>;
    growthRate: number;
  }>;
}

export default function DiscoverPage() {
  const { data: session } = useSession();
  const { trackEvent } = useAnalytics();
  
  usePageTimeTracking();

  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'personalized' | 'categories'>('trending');

  useEffect(() => {
    fetchDiscoveryData();
  }, [session]);

  const fetchDiscoveryData = async () => {
    setIsLoading(true);
    try {
      // Fetch trending data
      const trendingResponse = await fetch('/api/search/trending?timeWindow=7&limit=20');
      if (trendingResponse.ok) {
        const trending = await trendingResponse.json();
        setTrendingData(trending);
      }

      // Fetch personalized recommendations if user is logged in
      if (session?.user) {
        const recommendationsResponse = await fetch('/api/search/recommendations?type=PERSONALIZED&limit=10');
        if (recommendationsResponse.ok) {
          const recs = await recommendationsResponse.json();
          setRecommendations(recs);
        }
      }
    } catch (error) {
      console.error('Error fetching discovery data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    trackEvent('trending_topic_click', { topic });
    window.location.href = `/search?q=${encodeURIComponent(topic)}`;
  };

  const handleContentClick = (contentId: string, title: string) => {
    trackEvent('trending_content_click', { contentId, title });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Medical Content</h1>
          <p className="mt-2 text-gray-600">
            Explore trending topics, popular content, and personalized recommendations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'trending', label: 'Trending Now', icon: '🔥' },
              { id: 'personalized', label: 'For You', icon: '⭐', requiresAuth: true },
              { id: 'categories', label: 'By Specialty', icon: '🏥' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                disabled={tab.requiresAuth && !session}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'trending' && trendingData && (
          <TrendingTab data={trendingData} onTopicClick={handleTopicClick} onContentClick={handleContentClick} />
        )}

        {activeTab === 'personalized' && (
          <PersonalizedTab 
            recommendations={recommendations} 
            isLoggedIn={!!session}
            onContentClick={handleContentClick}
          />
        )}

        {activeTab === 'categories' && trendingData && (
          <CategoriesTab data={trendingData} onTopicClick={handleTopicClick} />
        )}
      </div>
    </div>
  );
}

function TrendingTab({ 
  data, 
  onTopicClick, 
  onContentClick 
}: { 
  data: TrendingData; 
  onTopicClick: (topic: string) => void;
  onContentClick: (contentId: string, title: string) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Trending Topics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">🔥 Trending Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.trendingTopics.slice(0, 9).map((topic, index) => (
            <div
              key={topic.term}
              onClick={() => onTopicClick(topic.term)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 capitalize">{topic.term}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 capitalize">{topic.category}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{topic.searchCount} searches</span>
                <span className={`font-semibold ${
                  topic.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {topic.growthRate > 0 ? '+' : ''}{topic.growthRate.toFixed(1)}%
                </span>
              </div>
              {topic.relatedTerms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {topic.relatedTerms.slice(0, 2).map(term => (
                    <span key={term} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {term}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trending Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">📈 Trending Content</h2>
        <div className="space-y-4">
          {data.trendingContent.slice(0, 8).map((content) => (
            <div key={content.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-blue-600">#{content.trendingRank}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    content.type === 'ARTICLE' ? 'bg-blue-100 text-blue-800' :
                    content.type === 'VIDEO' ? 'bg-purple-100 text-purple-800' :
                    content.type === 'CASE_STUDY' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {content.type}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                  <Link 
                    href={`/article/${content.slug}`}
                    onClick={() => onContentClick(content.id, content.title)}
                  >
                    {content.title}
                  </Link>
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>By {content.author.name}</span>
                  <span>• {new Date(content.publishedAt).toLocaleDateString()}</span>
                  {content.author.specialties.length > 0 && (
                    <span>• {content.author.specialties[0]}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {content.metrics.views.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">views</div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                  <span>❤️ {content.metrics.likes}</span>
                  <span>💬 {content.metrics.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonalizedTab({ 
  recommendations, 
  isLoggedIn,
  onContentClick 
}: { 
  recommendations: RecommendationResponse | null;
  isLoggedIn: boolean;
  onContentClick: (contentId: string, title: string) => void;
}) {
  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">🔐</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in for Personalized Recommendations</h3>
        <p className="text-gray-600 mb-6">
          Get content recommendations tailored to your medical specialties and interests.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your personalized recommendations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">⭐ Recommended for You</h2>
          <div className="text-sm text-gray-500">
            Confidence: {Math.round(recommendations.confidence * 100)}%
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">{recommendations.reason}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.recommendations.map((content) => (
            <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  content.type === 'ARTICLE' ? 'bg-blue-100 text-blue-800' :
                  content.type === 'VIDEO' ? 'bg-purple-100 text-purple-800' :
                  content.type === 'CASE_STUDY' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {content.type}
                </span>
                
                {content.cmeCredits && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {content.cmeCredits} CME
                  </span>
                )}
              </div>

              <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                <Link 
                  href={`/article/${content.slug}`}
                  onClick={() => onContentClick(content.id, content.title)}
                >
                  {content.title}
                </Link>
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.excerpt}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {content.author.name}</span>
                <span>{content.metrics.views.toLocaleString()} views</span>
              </div>

              {content.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {content.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoriesTab({ 
  data, 
  onTopicClick 
}: { 
  data: TrendingData;
  onTopicClick: (topic: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.searchCategories.slice(0, 9).map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {category.category === 'general' ? 'General Medicine' : category.category}
              </h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                category.growthRate > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.growthRate > 0 ? '+' : ''}{category.growthRate.toFixed(1)}%
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {category.totalSearches.toLocaleString()} searches this week
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Top Searches:</h4>
              {category.topQueries.slice(0, 3).map((query, index) => (
                <div
                  key={query.query}
                  onClick={() => onTopicClick(query.query)}
                  className="flex justify-between items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <span className="text-sm text-gray-700">
                    {index + 1}. {query.query}
                  </span>
                  <span className="text-xs text-gray-500">{query.count}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = `/search?specialties=${category.category}`}
              className="w-full mt-4 py-2 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
            >
              Explore {category.category}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}