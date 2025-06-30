import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { SearchAnalytics, type TrendingTopic } from '@/lib/search';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const timeWindow = parseInt(searchParams.get('timeWindow') || '7'); // days
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const category = searchParams.get('category'); // optional filter by medical specialty

    // Get trending topics
    const trendingTopics = await getTrendingTopics(timeWindow, limit, category);

    // Get trending content
    const trendingContent = await getTrendingContent(timeWindow, limit, category);

    // Get popular searches by category
    const searchCategories = await getSearchByCategory(timeWindow);

    // Get search volume trends
    const searchVolumeTrend = await getSearchVolumeTrend(timeWindow);

    return NextResponse.json({
      trendingTopics,
      trendingContent,
      searchCategories,
      searchVolumeTrend,
      timeWindow,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Trending topics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    );
  }
}

async function getTrendingTopics(timeWindow: number, limit: number, category?: string): Promise<TrendingTopic[]> {
  const cutoffDate = new Date(Date.now() - timeWindow * 24 * 60 * 60 * 1000);

  // Get search data for the time window
  const searchData = await prisma.searchQuery.findMany({
    where: {
      timestamp: { gte: cutoffDate },
    },
    select: {
      query: true,
      timestamp: true,
      resultsCount: true,
    },
  });

  // Use SearchAnalytics to identify trending topics
  const trendingTopics = SearchAnalytics.identifyTrendingTopics(searchData, timeWindow);

  // Filter by category if specified
  const filteredTopics = category 
    ? trendingTopics.filter(topic => topic.category === category)
    : trendingTopics;

  return filteredTopics.slice(0, limit);
}

async function getTrendingContent(timeWindow: number, limit: number, category?: string) {
  const cutoffDate = new Date(Date.now() - timeWindow * 24 * 60 * 60 * 1000);

  // Get publications with high engagement in the time window
  const publicationMetrics = await prisma.publicationMetrics.groupBy({
    by: ['publicationId'],
    where: {
      date: { gte: cutoffDate },
    },
    _sum: {
      views: true,
      likes: true,
      shares: true,
      comments: true,
    },
    orderBy: {
      _sum: {
        views: 'desc',
      },
    },
    take: limit * 2, // Get more to allow for filtering
  });

  // Get publication details
  const publicationIds = publicationMetrics.map(m => m.publicationId);
  const publications = await prisma.publication.findMany({
    where: {
      id: { in: publicationIds },
      publishedAt: { not: null },
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          specialties: true,
        },
      },
    },
  });

  // Filter by category (specialty) if specified
  const filteredPublications = category
    ? publications.filter(pub => 
        pub.author.specialties?.some(specialty => 
          specialty.toLowerCase().includes(category.toLowerCase())
        )
      )
    : publications;

  // Combine metrics with publication data
  const trendingContent = filteredPublications.slice(0, limit).map(pub => {
    const metrics = publicationMetrics.find(m => m.publicationId === pub.id);
    const engagementScore = (metrics?._sum.likes || 0) + 
                           (metrics?._sum.shares || 0) * 2 + 
                           (metrics?._sum.comments || 0) * 1.5;

    return {
      id: pub.id,
      title: pub.title,
      slug: pub.slug,
      type: pub.type,
      author: {
        name: pub.author.email.split('@')[0],
        specialties: pub.author.specialties,
      },
      publishedAt: pub.publishedAt,
      metrics: {
        views: metrics?._sum.views || 0,
        likes: metrics?._sum.likes || 0,
        shares: metrics?._sum.shares || 0,
        comments: metrics?._sum.comments || 0,
        engagementScore,
      },
      trendingRank: filteredPublications.indexOf(pub) + 1,
    };
  });

  return trendingContent;
}

async function getSearchByCategory(timeWindow: number) {
  const cutoffDate = new Date(Date.now() - timeWindow * 24 * 60 * 60 * 1000);

  const searches = await prisma.searchQuery.findMany({
    where: {
      timestamp: { gte: cutoffDate },
    },
    select: {
      query: true,
    },
  });

  // Categorize searches by medical specialty
  const categories = {
    cardiology: { queries: [], totalSearches: 0 },
    neurology: { queries: [], totalSearches: 0 },
    oncology: { queries: [], totalSearches: 0 },
    pediatrics: { queries: [], totalSearches: 0 },
    emergency: { queries: [], totalSearches: 0 },
    surgery: { queries: [], totalSearches: 0 },
    infectious: { queries: [], totalSearches: 0 },
    endocrinology: { queries: [], totalSearches: 0 },
    pulmonology: { queries: [], totalSearches: 0 },
    psychiatry: { queries: [], totalSearches: 0 },
    general: { queries: [], totalSearches: 0 },
  };

  const categoryKeywords = {
    cardiology: ['heart', 'cardiac', 'cardio', 'arrhythmia', 'hypertension', 'mi', 'chest pain', 'ecg'],
    neurology: ['brain', 'neuro', 'stroke', 'seizure', 'headache', 'migraine', 'cva', 'alzheimer'],
    oncology: ['cancer', 'tumor', 'malignancy', 'chemotherapy', 'radiation', 'oncology', 'metastasis'],
    pediatrics: ['child', 'pediatric', 'infant', 'newborn', 'adolescent', 'kids', 'baby'],
    emergency: ['trauma', 'emergency', 'critical', 'shock', 'resuscitation', 'urgent', 'acute'],
    surgery: ['surgical', 'operation', 'procedure', 'incision', 'laparoscopic', 'surgery', 'operative'],
    infectious: ['infection', 'bacteria', 'virus', 'antibiotic', 'covid', 'flu', 'sepsis'],
    endocrinology: ['diabetes', 'thyroid', 'hormone', 'insulin', 'glucose', 'endocrine'],
    pulmonology: ['lung', 'respiratory', 'asthma', 'copd', 'pneumonia', 'breathing', 'pulmonary'],
    psychiatry: ['mental', 'depression', 'anxiety', 'psychiatric', 'therapy', 'psychology'],
  };

  searches.forEach(search => {
    const queryLower = search.query.toLowerCase();
    let categorized = false;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        categories[category as keyof typeof categories].queries.push(search.query);
        categories[category as keyof typeof categories].totalSearches++;
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categories.general.queries.push(search.query);
      categories.general.totalSearches++;
    }
  });

  // Get top queries per category
  const result = Object.entries(categories).map(([category, data]) => {
    const topQueries = [...new Set(data.queries)]
      .map(query => ({
        query,
        count: data.queries.filter(q => q === query).length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      category,
      totalSearches: data.totalSearches,
      topQueries,
      growthRate: calculateCategoryGrowth(category, timeWindow), // Mock growth rate
    };
  }).filter(cat => cat.totalSearches > 0)
    .sort((a, b) => b.totalSearches - a.totalSearches);

  return result;
}

async function getSearchVolumeTrend(timeWindow: number) {
  const cutoffDate = new Date(Date.now() - timeWindow * 24 * 60 * 60 * 1000);

  // Group searches by day
  const dailySearches = await prisma.searchQuery.groupBy({
    by: ['timestamp'],
    where: {
      timestamp: { gte: cutoffDate },
    },
    _count: {
      id: true,
    },
  });

  // Create daily buckets
  const dailyBuckets: Record<string, number> = {};
  
  // Initialize all days in the range with 0
  for (let i = 0; i < timeWindow; i++) {
    const date = new Date(cutoffDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateKey = date.toISOString().split('T')[0];
    dailyBuckets[dateKey] = 0;
  }

  // Fill in actual search counts
  dailySearches.forEach(search => {
    const dateKey = search.timestamp.toISOString().split('T')[0];
    if (dailyBuckets[dateKey] !== undefined) {
      dailyBuckets[dateKey] += search._count.id;
    }
  });

  // Convert to array format
  const trend = Object.entries(dailyBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      searchCount: count,
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    }));

  return trend;
}

function calculateCategoryGrowth(category: string, timeWindow: number): number {
  // Mock growth calculation - in a real implementation, you'd compare
  // current period with previous period
  const mockGrowthRates: Record<string, number> = {
    cardiology: 15.2,
    neurology: 8.7,
    oncology: 22.1,
    pediatrics: 5.3,
    emergency: 18.9,
    surgery: 3.4,
    infectious: 45.6, // High due to ongoing health concerns
    endocrinology: 12.8,
    pulmonology: 31.2,
    psychiatry: 28.4,
    general: 10.5,
  };

  return mockGrowthRates[category] || 0;
}

// Additional endpoint for real-time search suggestions
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Get recent popular searches that match the query
    const recentSearches = await prisma.searchQuery.findMany({
      where: {
        query: {
          contains: query.toLowerCase(),
          mode: 'insensitive',
        },
        timestamp: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      select: {
        query: true,
      },
      take: 10,
    });

    // Get unique suggestions and sort by frequency
    const suggestionCounts = recentSearches.reduce((acc, search) => {
      acc[search.query] = (acc[search.query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const suggestions = Object.entries(suggestionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([query]) => query);

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}