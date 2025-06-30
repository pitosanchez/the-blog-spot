import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { TimeRangeHelper, EngagementScorer } from '@/lib/analytics';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') as '24h' | '7d' | '30d' | '90d' | '1y' || '30d';
    const { startDate, endDate } = TimeRangeHelper.getDateRange(timeRange);

    let dashboardData;

    if (session.user.role === 'CREATOR') {
      dashboardData = await getCreatorAnalytics(session.user.id, startDate, endDate);
    } else if (session.user.role === 'ADMIN') {
      dashboardData = await getPlatformAnalytics(startDate, endDate);
    } else {
      dashboardData = await getUserAnalytics(session.user.id, startDate, endDate);
    }

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

async function getCreatorAnalytics(userId: string, startDate: Date, endDate: Date) {
  // Get creator's publications
  const publications = await prisma.publication.findMany({
    where: { authorId: userId },
    select: { id: true, title: true, createdAt: true },
  });

  const publicationIds = publications.map(p => p.id);

  // Get publication metrics
  const publicationMetrics = await prisma.publicationMetrics.findMany({
    where: {
      publicationId: { in: publicationIds },
      date: { gte: startDate, lte: endDate },
    },
  });

  // Aggregate metrics by publication
  const publicationStats = publications.map(pub => {
    const metrics = publicationMetrics.filter(m => m.publicationId === pub.id);
    const totalViews = metrics.reduce((sum, m) => sum + m.views, 0);
    const totalLikes = metrics.reduce((sum, m) => sum + m.likes, 0);
    const totalShares = metrics.reduce((sum, m) => sum + m.shares, 0);
    const totalComments = metrics.reduce((sum, m) => sum + m.comments, 0);
    const totalBookmarks = metrics.reduce((sum, m) => sum + m.bookmarks, 0);
    const uniqueViews = metrics.reduce((sum, m) => sum + m.uniqueViews, 0);
    const cmeCompletions = metrics.reduce((sum, m) => sum + m.cmeCompletions, 0);

    const engagementScore = EngagementScorer.calculateEngagementScore({
      views: totalViews,
      uniqueViews,
      likes: totalLikes,
      shares: totalShares,
      bookmarks: totalBookmarks,
      comments: totalComments,
      cmeCompletions,
    });

    return {
      id: pub.id,
      title: pub.title,
      createdAt: pub.createdAt,
      views: totalViews,
      uniqueViews,
      likes: totalLikes,
      shares: totalShares,
      comments: totalComments,
      bookmarks: totalBookmarks,
      cmeCompletions,
      engagementScore,
    };
  });

  // Get top performing content
  const topContent = publicationStats
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 10);

  // Get time series data for views
  const viewsTimeSeries = await getTimeSeriesData(publicationIds, startDate, endDate, 'views');
  const engagementTimeSeries = await getTimeSeriesData(publicationIds, startDate, endDate, 'engagement');

  // Get audience insights
  const audienceInsights = await getAudienceInsights(publicationIds, startDate, endDate);

  // Calculate totals
  const totalViews = publicationStats.reduce((sum, p) => sum + p.views, 0);
  const totalEngagement = publicationStats.reduce((sum, p) => sum + p.likes + p.shares + p.comments, 0);
  const avgEngagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

  return {
    overview: {
      totalPublications: publications.length,
      totalViews,
      totalEngagement,
      avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
      topPerformingContent: topContent[0]?.title || 'No content yet',
    },
    publicationStats,
    topContent,
    timeSeries: {
      views: viewsTimeSeries,
      engagement: engagementTimeSeries,
    },
    audienceInsights,
  };
}

async function getPlatformAnalytics(startDate: Date, endDate: Date) {
  // Total users and growth
  const totalUsers = await prisma.user.count();
  const newUsers = await prisma.user.count({
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
  });

  // Active users
  const activeUsers = await prisma.userActivity.groupBy({
    by: ['userId'],
    where: {
      date: { gte: startDate, lte: endDate },
    },
    _count: { userId: true },
  });

  // Content metrics
  const totalPublications = await prisma.publication.count();
  const newPublications = await prisma.publication.count({
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
  });

  // Platform-wide engagement
  const platformMetrics = await prisma.publicationMetrics.aggregate({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    _sum: {
      views: true,
      likes: true,
      shares: true,
      comments: true,
      bookmarks: true,
    },
  });

  // Top content across platform
  const topPublications = await getTopPublications(startDate, endDate, 20);

  // Search analytics
  const popularSearches = await prisma.searchMetrics.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { searchCount: 'desc' },
    take: 10,
  });

  // Revenue metrics (if user has access)
  const subscriptions = await prisma.subscription.count({
    where: {
      status: 'ACTIVE',
    },
  });

  return {
    overview: {
      totalUsers,
      newUsers,
      activeUsers: activeUsers.length,
      totalPublications,
      newPublications,
      totalSubscriptions: subscriptions,
    },
    engagement: {
      totalViews: platformMetrics._sum.views || 0,
      totalLikes: platformMetrics._sum.likes || 0,
      totalShares: platformMetrics._sum.shares || 0,
      totalComments: platformMetrics._sum.comments || 0,
    },
    topContent: topPublications,
    popularSearches,
    userGrowth: await getUserGrowthData(startDate, endDate),
  };
}

async function getUserAnalytics(userId: string, startDate: Date, endDate: Date) {
  // User activity
  const userActivity = await prisma.userActivity.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
  });

  // Publications viewed
  const publicationsViewed = await prisma.publicationView.count({
    where: {
      userId,
      firstViewedAt: { gte: startDate, lte: endDate },
    },
  });

  // CME credits earned
  const cmeCredits = await prisma.cmeCompletion.count({
    where: {
      userId,
      completedAt: { gte: startDate, lte: endDate },
    },
  });

  // Search history
  const searchHistory = await prisma.searchQuery.findMany({
    where: {
      userId,
      timestamp: { gte: startDate, lte: endDate },
    },
    orderBy: { timestamp: 'desc' },
    take: 20,
  });

  const totalSessions = userActivity.reduce((sum, a) => sum + a.sessionsCount, 0);
  const totalTimeSpent = userActivity.reduce((sum, a) => sum + a.timeSpent, 0);

  return {
    overview: {
      totalSessions,
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
      publicationsViewed,
      cmeCreditsEarned: cmeCredits,
      avgSessionDuration: totalSessions > 0 ? Math.round(totalTimeSpent / totalSessions / 60) : 0,
    },
    activity: userActivity.map(a => ({
      date: a.date,
      sessions: a.sessionsCount,
      timeSpent: Math.round(a.timeSpent / 60),
    })),
    searchHistory: searchHistory.map(s => ({
      query: s.query,
      timestamp: s.timestamp,
      resultsCount: s.resultsCount,
    })),
  };
}

async function getTimeSeriesData(publicationIds: string[], startDate: Date, endDate: Date, metric: 'views' | 'engagement') {
  const metrics = await prisma.publicationMetrics.findMany({
    where: {
      publicationId: { in: publicationIds },
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'asc' },
  });

  const timeSeriesMap = new Map<string, number>();

  metrics.forEach(m => {
    const dateKey = m.date.toISOString().split('T')[0];
    const value = metric === 'views' ? m.views : (m.likes + m.shares + m.comments);
    timeSeriesMap.set(dateKey, (timeSeriesMap.get(dateKey) || 0) + value);
  });

  return Array.from(timeSeriesMap.entries()).map(([date, value]) => ({
    date,
    value,
  }));
}

async function getAudienceInsights(publicationIds: string[], startDate: Date, endDate: Date) {
  // Get unique viewers and their engagement patterns
  const viewerData = await prisma.publicationView.findMany({
    where: {
      publicationId: { in: publicationIds },
      firstViewedAt: { gte: startDate, lte: endDate },
    },
    include: {
      user: {
        select: {
          role: true,
          createdAt: true,
        },
      },
    },
  });

  const roleDistribution = viewerData.reduce((acc, view) => {
    const role = view.user?.role || 'VIEWER';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalUniqueViewers: viewerData.length,
    roleDistribution,
    newVsReturning: {
      new: viewerData.filter(v => v.user?.createdAt && v.user.createdAt >= startDate).length,
      returning: viewerData.filter(v => v.user?.createdAt && v.user.createdAt < startDate).length,
    },
  };
}

async function getTopPublications(startDate: Date, endDate: Date, limit: number) {
  const publications = await prisma.publicationMetrics.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    include: {
      publication: {
        select: {
          title: true,
          author: {
            select: { name: true },
          },
        },
      },
    },
  });

  const publicationStats = publications.reduce((acc, metric) => {
    const id = metric.publicationId;
    if (!acc[id]) {
      acc[id] = {
        id,
        title: metric.publication.title,
        author: metric.publication.author.name,
        views: 0,
        engagement: 0,
      };
    }
    acc[id].views += metric.views;
    acc[id].engagement += metric.likes + metric.shares + metric.comments;
    return acc;
  }, {} as Record<string, any>);

  return Object.values(publicationStats)
    .sort((a: any, b: any) => b.views - a.views)
    .slice(0, limit);
}

async function getUserGrowthData(startDate: Date, endDate: Date) {
  const usersByDay = await prisma.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    _count: { id: true },
    orderBy: { createdAt: 'asc' },
  });

  return usersByDay.map(day => ({
    date: day.createdAt.toISOString().split('T')[0],
    newUsers: day._count.id,
  }));
}