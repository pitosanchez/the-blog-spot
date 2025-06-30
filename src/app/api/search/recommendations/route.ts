import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { 
  ContentRecommendationEngine,
  type RecommendationRequest,
  type RecommendationResponse,
  type SearchResult 
} from '@/lib/search';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') as RecommendationRequest['type'] || 'PERSONALIZED';
    const contentId = searchParams.get('contentId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20);
    const specialties = searchParams.get('specialties')?.split(',');

    let recommendations: RecommendationResponse;

    switch (type) {
      case 'SIMILAR':
        if (!contentId) {
          return NextResponse.json(
            { error: 'contentId required for similar recommendations' },
            { status: 400 }
          );
        }
        recommendations = await getSimilarContent(contentId, limit);
        break;

      case 'PERSONALIZED':
        if (!session?.user) {
          return NextResponse.json(
            { error: 'Authentication required for personalized recommendations' },
            { status: 401 }
          );
        }
        recommendations = await getPersonalizedRecommendations(session.user.id, limit);
        break;

      case 'TRENDING':
        recommendations = await getTrendingRecommendations(limit);
        break;

      case 'SPECIALTY_BASED':
        if (!specialties?.length) {
          return NextResponse.json(
            { error: 'specialties required for specialty-based recommendations' },
            { status: 400 }
          );
        }
        recommendations = await getSpecialtyBasedRecommendations(specialties, limit);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid recommendation type' },
          { status: 400 }
        );
    }

    // Track recommendation request
    if (session?.user) {
      await trackRecommendationRequest(session.user.id, type, contentId);
    }

    return NextResponse.json(recommendations);

  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

async function getSimilarContent(contentId: string, limit: number): Promise<RecommendationResponse> {
  // Get the reference content
  const referenceContent = await prisma.publication.findUnique({
    where: { id: contentId },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          specialties: true,
          medicalCredentials: true,
        },
      },
    },
  });

  if (!referenceContent) {
    return {
      recommendations: [],
      reason: 'Reference content not found',
      confidence: 0.0,
    };
  }

  // Get other published content (excluding the reference)
  const otherContent = await prisma.publication.findMany({
    where: {
      id: { not: contentId },
      publishedAt: { not: null },
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          specialties: true,
          medicalCredentials: true,
        },
      },
    },
    take: 100, // Limit for performance
  });

  // Convert to SearchResult format
  const referenceResult = await convertToSearchResult(referenceContent);
  const otherResults = await Promise.all(
    otherContent.map(content => convertToSearchResult(content))
  );

  // Calculate similarity scores
  const scoredResults = otherResults.map(content => ({
    content,
    similarity: ContentRecommendationEngine.calculateContentSimilarity(referenceResult, content),
  }));

  // Sort by similarity and take top results
  const topResults = scoredResults
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.content);

  return {
    recommendations: topResults,
    reason: `Based on similarity to "${referenceContent.title}"`,
    confidence: topResults.length > 0 ? 0.8 : 0.0,
  };
}

async function getPersonalizedRecommendations(userId: string, limit: number): Promise<RecommendationResponse> {
  // Get user profile and interaction history
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      specialties: true,
      publicationViews: {
        orderBy: { lastViewedAt: 'desc' },
        take: 50,
        select: { publicationId: true },
      },
    },
  });

  if (!user) {
    return {
      recommendations: [],
      reason: 'User not found',
      confidence: 0.0,
    };
  }

  // Get available content (excluding already viewed)
  const viewedIds = user.publicationViews.map(view => view.publicationId);
  const availableContent = await prisma.publication.findMany({
    where: {
      publishedAt: { not: null },
      id: { notIn: viewedIds },
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          specialties: true,
          medicalCredentials: true,
        },
      },
    },
    take: 100,
  });

  // Convert to SearchResult format
  const searchResults = await Promise.all(
    availableContent.map(content => convertToSearchResult(content))
  );

  // Generate personalized recommendations
  const userProfile = {
    specialties: user.specialties || [],
    interactionHistory: viewedIds,
    readingLevel: 'INTERMEDIATE' as const,
    preferredContentTypes: ['ARTICLE', 'CASE_STUDY'] as const,
  };

  const recommendations = ContentRecommendationEngine.generatePersonalizedRecommendations(
    userProfile,
    searchResults,
    limit
  );

  return recommendations;
}

async function getTrendingRecommendations(limit: number): Promise<RecommendationResponse> {
  // Get recent search analytics
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const searchAnalytics = await prisma.searchQuery.findMany({
    where: {
      timestamp: { gte: sevenDaysAgo },
    },
    select: {
      query: true,
      timestamp: true,
      resultsCount: true,
    },
  });

  // Get recent content with high engagement
  const recentContent = await prisma.publication.findMany({
    where: {
      publishedAt: { 
        not: null,
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          specialties: true,
          medicalCredentials: true,
        },
      },
    },
    orderBy: { viewCount: 'desc' },
    take: 50,
  });

  // Convert to SearchResult format
  const searchResults = await Promise.all(
    recentContent.map(content => convertToSearchResult(content))
  );

  // Generate trending content
  const trendingContent = ContentRecommendationEngine.generateTrendingContent(
    searchAnalytics.map(search => ({
      query: search.query,
      count: 1, // Each search record represents one search
      date: search.timestamp,
    })),
    searchResults,
    limit
  );

  return {
    recommendations: trendingContent,
    reason: 'Based on recent search trends and high engagement',
    confidence: 0.85,
  };
}

async function getSpecialtyBasedRecommendations(specialties: string[], limit: number): Promise<RecommendationResponse> {
  // Get content from authors with matching specialties
  const content = await prisma.publication.findMany({
    where: {
      publishedAt: { not: null },
      author: {
        specialties: {
          hasSome: specialties,
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          specialties: true,
          medicalCredentials: true,
        },
      },
    },
    orderBy: [
      { viewCount: 'desc' },
      { publishedAt: 'desc' },
    ],
    take: limit * 2, // Get more to allow for filtering
  });

  // Convert to SearchResult format
  const searchResults = await Promise.all(
    content.map(c => convertToSearchResult(c))
  );

  // Score by specialty relevance
  const scoredResults = searchResults.map(result => {
    const specialtyMatches = result.specialties.filter(s => specialties.includes(s)).length;
    const authorSpecialtyMatches = result.author.specialty.filter(s => specialties.includes(s)).length;
    
    const score = (specialtyMatches * 10) + (authorSpecialtyMatches * 5) + result.metrics.engagementScore;
    
    return { result, score };
  });

  // Sort by score and take top results
  const topResults = scoredResults
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.result);

  return {
    recommendations: topResults,
    reason: `Based on ${specialties.join(', ')} specialty focus`,
    confidence: 0.75,
  };
}

async function convertToSearchResult(publication: any): Promise<SearchResult> {
  // Get metrics for this publication
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const metrics = await prisma.publicationMetrics.aggregate({
    where: {
      publicationId: publication.id,
      date: { gte: thirtyDaysAgo },
    },
    _sum: {
      views: true,
      likes: true,
      shares: true,
      comments: true,
    },
  });

  const engagementScore = (metrics._sum.likes || 0) + 
                         (metrics._sum.shares || 0) * 2 + 
                         (metrics._sum.comments || 0) * 1.5;

  return {
    id: publication.id,
    title: publication.title,
    slug: publication.slug,
    content: publication.content,
    excerpt: generateExcerpt(publication.content),
    author: {
      id: publication.author.id,
      name: publication.author.email.split('@')[0],
      specialty: publication.author.specialties || [],
      credentials: extractCredentials(publication.author.medicalCredentials),
    },
    type: publication.type,
    accessType: publication.accessType,
    price: publication.price ? parseFloat(publication.price.toString()) : undefined,
    cmeCredits: publication.cmeCredits || undefined,
    tags: publication.tags || [],
    specialties: publication.author.specialties || [],
    difficulty: 'INTERMEDIATE' as const,
    publishedAt: publication.publishedAt!,
    updatedAt: publication.updatedAt,
    metrics: {
      views: metrics._sum.views || publication.viewCount || 0,
      likes: metrics._sum.likes || 0,
      shares: metrics._sum.shares || 0,
      comments: metrics._sum.comments || 0,
      rating: 4.2, // Mock rating
      engagementScore,
    },
    highlighted: {},
  };
}

function generateExcerpt(content: string, maxLength: number = 200): string {
  const plainText = content.replace(/<[^>]*>/g, '');
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

function extractCredentials(medicalCredentials: any): string {
  if (!medicalCredentials) return '';
  
  const credentials = [];
  if (medicalCredentials.degree) credentials.push(medicalCredentials.degree);
  if (medicalCredentials.certifications) credentials.push(...medicalCredentials.certifications);
  
  return credentials.join(', ');
}

async function trackRecommendationRequest(userId: string, type: string, contentId?: string) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        sessionId: `rec_${Date.now()}`,
        eventType: 'recommendation_request',
        eventData: {
          type,
          contentId,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Error tracking recommendation request:', error);
  }
}