import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { AnalyticsEvent } from '@/lib/analytics';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body: AnalyticsEvent = await request.json();

    // Get IP address and user agent from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create analytics event record
    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        userId: session?.user?.id || body.userId,
        sessionId: body.sessionId,
        eventType: body.eventType,
        eventData: body.eventData as any, // Prisma handles JSON
        timestamp: body.timestamp || new Date(),
        userAgent: userAgent,
        ipAddress: ip,
        referrer: body.referrer,
        pageUrl: body.pageUrl,
      },
    });

    // Process specific event types for aggregation
    await processEventForMetrics(body);

    return NextResponse.json({ 
      success: true, 
      eventId: analyticsEvent.id 
    });

  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

async function processEventForMetrics(event: AnalyticsEvent) {
  try {
    switch (event.eventType) {
      case 'publication_view':
        await updatePublicationMetrics(event.eventData.publicationId, 'view', event.userId);
        break;
      
      case 'publication_like':
        await updatePublicationMetrics(event.eventData.publicationId, 'like', event.userId);
        break;
      
      case 'publication_share':
        await updatePublicationMetrics(event.eventData.publicationId, 'share', event.userId);
        break;
      
      case 'publication_bookmark':
        await updatePublicationMetrics(event.eventData.publicationId, 'bookmark', event.userId);
        break;
      
      case 'comment_create':
        await updatePublicationMetrics(event.eventData.publicationId, 'comment', event.userId);
        break;
      
      case 'cme_complete':
        await updateCMEMetrics(event.eventData.publicationId, event.userId!);
        break;
      
      case 'page_view':
        await updatePageMetrics(event.pageUrl!, event.userId);
        break;
      
      case 'user_login':
        await updateUserActivity(event.userId!, 'login');
        break;

      case 'search_query':
        await updateSearchMetrics(event.eventData.query, event.eventData.resultsCount, event.userId);
        break;
    }
  } catch (error) {
    console.error('Error processing event for metrics:', error);
  }
}

async function updatePublicationMetrics(publicationId: string, action: string, userId?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update or create daily publication metrics
  await prisma.publicationMetrics.upsert({
    where: {
      publicationId_date: {
        publicationId,
        date: today,
      },
    },
    update: {
      ...(action === 'view' && { views: { increment: 1 } }),
      ...(action === 'like' && { likes: { increment: 1 } }),
      ...(action === 'share' && { shares: { increment: 1 } }),
      ...(action === 'bookmark' && { bookmarks: { increment: 1 } }),
      ...(action === 'comment' && { comments: { increment: 1 } }),
    },
    create: {
      publicationId,
      date: today,
      views: action === 'view' ? 1 : 0,
      likes: action === 'like' ? 1 : 0,
      shares: action === 'share' ? 1 : 0,
      bookmarks: action === 'bookmark' ? 1 : 0,
      comments: action === 'comment' ? 1 : 0,
      uniqueViews: 0,
    },
  });

  // Track unique views
  if (action === 'view' && userId) {
    const existingView = await prisma.publicationView.findUnique({
      where: {
        userId_publicationId: {
          userId,
          publicationId,
        },
      },
    });

    if (!existingView) {
      await prisma.publicationView.create({
        data: {
          userId,
          publicationId,
          firstViewedAt: new Date(),
        },
      });

      // Increment unique views
      await prisma.publicationMetrics.updateMany({
        where: {
          publicationId,
          date: today,
        },
        data: {
          uniqueViews: { increment: 1 },
        },
      });
    }

    // Update last viewed timestamp
    await prisma.publicationView.upsert({
      where: {
        userId_publicationId: {
          userId,
          publicationId,
        },
      },
      update: {
        lastViewedAt: new Date(),
        viewCount: { increment: 1 },
      },
      create: {
        userId,
        publicationId,
        firstViewedAt: new Date(),
        lastViewedAt: new Date(),
        viewCount: 1,
      },
    });
  }
}

async function updateCMEMetrics(publicationId: string, userId: string) {
  // Record CME completion
  await prisma.cmeCompletion.create({
    data: {
      userId,
      publicationId,
      completedAt: new Date(),
      creditsEarned: 1, // Default 1 credit, adjust based on publication
    },
  });

  // Update publication CME metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.publicationMetrics.upsert({
    where: {
      publicationId_date: {
        publicationId,
        date: today,
      },
    },
    update: {
      cmeCompletions: { increment: 1 },
    },
    create: {
      publicationId,
      date: today,
      views: 0,
      uniqueViews: 0,
      likes: 0,
      shares: 0,
      bookmarks: 0,
      comments: 0,
      cmeCompletions: 1,
    },
  });
}

async function updatePageMetrics(pageUrl: string, userId?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Extract page path from URL
  const url = new URL(pageUrl);
  const pagePath = url.pathname;

  await prisma.pageMetrics.upsert({
    where: {
      pagePath_date: {
        pagePath,
        date: today,
      },
    },
    update: {
      views: { increment: 1 },
      ...(userId && { uniqueViews: { increment: 1 } }),
    },
    create: {
      pagePath,
      date: today,
      views: 1,
      uniqueViews: userId ? 1 : 0,
    },
  });
}

async function updateUserActivity(userId: string, activityType: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.userActivity.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      ...(activityType === 'login' && { logins: { increment: 1 } }),
      lastActiveAt: new Date(),
    },
    create: {
      userId,
      date: today,
      logins: activityType === 'login' ? 1 : 0,
      sessionsCount: 1,
      timeSpent: 0,
      lastActiveAt: new Date(),
    },
  });
}

async function updateSearchMetrics(query: string, resultsCount: number, userId?: string) {
  await prisma.searchQuery.create({
    data: {
      userId,
      query: query.toLowerCase(),
      resultsCount,
      timestamp: new Date(),
    },
  });

  // Update popular search terms
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.searchMetrics.upsert({
    where: {
      query_date: {
        query: query.toLowerCase(),
        date: today,
      },
    },
    update: {
      searchCount: { increment: 1 },
      totalResults: { increment: resultsCount },
    },
    create: {
      query: query.toLowerCase(),
      date: today,
      searchCount: 1,
      totalResults: resultsCount,
    },
  });
}