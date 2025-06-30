import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { 
  MedicalSearchEngine, 
  type SearchQuery, 
  type SearchResponse,
  type SearchResult,
  type SearchFilters,
  type SortOption 
} from '@/lib/search';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const sort = (searchParams.get('sort') || 'RELEVANCE') as SortOption;
    
    // Parse filters
    const filters: SearchFilters = {
      contentType: searchParams.get('contentType')?.split(',') as any,
      accessType: searchParams.get('accessType')?.split(',') as any,
      specialties: searchParams.get('specialties')?.split(','),
      authors: searchParams.get('authors')?.split(','),
      tags: searchParams.get('tags')?.split(','),
      difficulty: searchParams.get('difficulty')?.split(',') as any,
    };

    // Parse price range
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    if (priceMin || priceMax) {
      filters.priceRange = {
        min: priceMin ? parseFloat(priceMin) : undefined,
        max: priceMax ? parseFloat(priceMax) : undefined,
      };
    }

    // Parse CME credits range
    const cmeMin = searchParams.get('cmeMin');
    const cmeMax = searchParams.get('cmeMax');
    if (cmeMin || cmeMax) {
      filters.cmeCredits = {
        min: cmeMin ? parseInt(cmeMin) : undefined,
        max: cmeMax ? parseInt(cmeMax) : undefined,
      };
    }

    // Parse date range
    const dateStart = searchParams.get('dateStart');
    const dateEnd = searchParams.get('dateEnd');
    if (dateStart || dateEnd) {
      filters.dateRange = {
        start: dateStart ? new Date(dateStart) : undefined,
        end: dateEnd ? new Date(dateEnd) : undefined,
      };
    }

    // Track search query
    if (query) {
      await trackSearchQuery(query, session?.user?.id);
    }

    // Perform search
    const searchResult = await performSearch({
      query,
      filters,
      sort,
      page,
      limit,
    }, session?.user);

    return NextResponse.json(searchResult);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

async function performSearch(
  searchQuery: SearchQuery,
  user?: any
): Promise<SearchResponse> {
  const { query, filters, sort, page, limit } = searchQuery;
  const offset = (page - 1) * limit;

  // Build where clause
  let whereClause: any = {
    publishedAt: { not: null }, // Only published content
  };

  // Apply filters
  if (filters.contentType?.length) {
    whereClause.type = { in: filters.contentType };
  }

  if (filters.accessType?.length) {
    whereClause.accessType = { in: filters.accessType };
  }

  if (filters.authors?.length) {
    whereClause.authorId = { in: filters.authors };
  }

  if (filters.tags?.length) {
    whereClause.tags = { hasSome: filters.tags };
  }

  if (filters.priceRange) {
    const priceConditions: any = {};
    if (filters.priceRange.min !== undefined) {
      priceConditions.gte = filters.priceRange.min;
    }
    if (filters.priceRange.max !== undefined) {
      priceConditions.lte = filters.priceRange.max;
    }
    if (Object.keys(priceConditions).length > 0) {
      whereClause.price = priceConditions;
    }
  }

  if (filters.cmeCredits) {
    const cmeConditions: any = {};
    if (filters.cmeCredits.min !== undefined) {
      cmeConditions.gte = filters.cmeCredits.min;
    }
    if (filters.cmeCredits.max !== undefined) {
      cmeConditions.lte = filters.cmeCredits.max;
    }
    if (Object.keys(cmeConditions).length > 0) {
      whereClause.cmeCredits = cmeConditions;
    }
  }

  if (filters.dateRange) {
    const dateConditions: any = {};
    if (filters.dateRange.start) {
      dateConditions.gte = filters.dateRange.start;
    }
    if (filters.dateRange.end) {
      dateConditions.lte = filters.dateRange.end;
    }
    if (Object.keys(dateConditions).length > 0) {
      whereClause.publishedAt = dateConditions;
    }
  }

  // Text search using expanded medical terms
  if (query) {
    const expandedTerms = MedicalSearchEngine.expandMedicalQuery(query);
    const searchConditions = expandedTerms.map(term => ({
      OR: [
        { title: { contains: term, mode: 'insensitive' } },
        { content: { contains: term, mode: 'insensitive' } },
        { tags: { hasSome: [term] } },
      ],
    }));

    whereClause.OR = searchConditions;
  }

  // Build order by clause
  let orderBy: any = {};
  switch (sort) {
    case 'DATE':
      orderBy = { publishedAt: 'desc' };
      break;
    case 'POPULARITY':
      orderBy = { viewCount: 'desc' };
      break;
    case 'PRICE':
      orderBy = { price: 'asc' };
      break;
    case 'CME_CREDITS':
      orderBy = { cmeCredits: 'desc' };
      break;
    case 'RELEVANCE':
    default:
      // For relevance, we'll sort by a combination of factors
      orderBy = [
        { viewCount: 'desc' },
        { publishedAt: 'desc' },
      ];
      break;
  }

  // Execute search query
  const [publications, totalCount] = await Promise.all([
    prisma.publication.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
            specialties: true,
            institution: true,
            medicalCredentials: true,
          },
        },
      },
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.publication.count({ where: whereClause }),
  ]);

  // Get aggregated metrics for each publication
  const publicationIds = publications.map(p => p.id);
  const metricsData = await getPublicationMetrics(publicationIds);

  // Transform results
  const searchResults: SearchResult[] = publications.map(pub => {
    const metrics = metricsData[pub.id] || {
      views: pub.viewCount || 0,
      likes: 0,
      shares: 0,
      comments: 0,
      rating: 0,
      engagementScore: 0,
    };

    const result: SearchResult = {
      id: pub.id,
      title: pub.title,
      slug: pub.slug,
      content: pub.content,
      excerpt: generateExcerpt(pub.content),
      author: {
        id: pub.author.id,
        name: pub.author.email.split('@')[0], // Use email prefix as name
        specialty: pub.author.specialties || [],
        credentials: extractCredentials(pub.author.medicalCredentials as any),
      },
      type: pub.type as any,
      accessType: pub.accessType as any,
      price: pub.price ? parseFloat(pub.price.toString()) : undefined,
      cmeCredits: pub.cmeCredits || undefined,
      tags: pub.tags || [],
      specialties: pub.author.specialties || [],
      difficulty: 'INTERMEDIATE' as any, // Default difficulty
      publishedAt: pub.publishedAt!,
      updatedAt: pub.updatedAt,
      metrics,
      highlighted: generateHighlights(pub, query),
    };

    return result;
  });

  // Calculate relevance scores if sorting by relevance
  if (sort === 'RELEVANCE' && query) {
    const userSpecialties = user?.specialties || [];
    searchResults.forEach(result => {
      const relevanceScore = MedicalSearchEngine.calculateRelevanceScore(
        query,
        result,
        userSpecialties
      );
      result.metrics.engagementScore = relevanceScore;
    });

    // Re-sort by relevance score
    searchResults.sort((a, b) => b.metrics.engagementScore - a.metrics.engagementScore);
  }

  // Generate aggregations
  const aggregations = await generateAggregations(whereClause, filters);

  // Generate suggestions
  const suggestions = query ? 
    MedicalSearchEngine.generateSearchSuggestions(query, await getRecentSearches(user?.id)) :
    [];

  // Generate related queries
  const relatedQueries = query ? await getRelatedQueries(query) : [];

  return {
    results: searchResults,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    aggregations,
    suggestions,
    relatedQueries,
  };
}

async function getPublicationMetrics(publicationIds: string[]) {
  if (publicationIds.length === 0) return {};

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const metrics = await prisma.publicationMetrics.groupBy({
    by: ['publicationId'],
    where: {
      publicationId: { in: publicationIds },
      date: { gte: thirtyDaysAgo },
    },
    _sum: {
      views: true,
      likes: true,
      shares: true,
      comments: true,
    },
    _avg: {
      bounceRate: true,
    },
  });

  const result: Record<string, any> = {};
  metrics.forEach(metric => {
    const engagementScore = (metric._sum.likes || 0) + 
                           (metric._sum.shares || 0) * 2 + 
                           (metric._sum.comments || 0) * 1.5;
    
    result[metric.publicationId] = {
      views: metric._sum.views || 0,
      likes: metric._sum.likes || 0,
      shares: metric._sum.shares || 0,
      comments: metric._sum.comments || 0,
      rating: 4.2, // Mock rating
      engagementScore,
    };
  });

  return result;
}

async function generateAggregations(whereClause: any, filters: SearchFilters) {
  // Get base publications matching the current filters (excluding the field being aggregated)
  const basePublications = await prisma.publication.findMany({
    where: whereClause,
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

  // Generate aggregations
  const contentTypes = basePublications.reduce((acc, pub) => {
    acc[pub.type] = (acc[pub.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const accessTypes = basePublications.reduce((acc, pub) => {
    acc[pub.accessType] = (acc[pub.accessType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const specialties = basePublications.reduce((acc, pub) => {
    pub.author.specialties?.forEach(specialty => {
      acc[specialty] = (acc[specialty] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const authors = basePublications.reduce((acc, pub) => {
    const authorKey = pub.author.id;
    const authorName = pub.author.email.split('@')[0];
    acc[authorKey] = { name: authorName, count: (acc[authorKey]?.count || 0) + 1 };
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const tags = basePublications.reduce((acc, pub) => {
    pub.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    contentTypes: Object.entries(contentTypes).map(([value, count]) => ({ value: value as any, count })),
    accessTypes: Object.entries(accessTypes).map(([value, count]) => ({ value: value as any, count })),
    specialties: Object.entries(specialties)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([value, count]) => ({ value, count })),
    authors: Object.entries(authors)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10)
      .map(([value, { name, count }]) => ({ value, name, count })),
    tags: Object.entries(tags)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([value, count]) => ({ value, count })),
    priceRanges: [
      { range: 'Free', count: basePublications.filter(p => !p.price || p.price.equals(0)).length },
      { range: '$1-$10', count: basePublications.filter(p => p.price && p.price.gt(0) && p.price.lte(10)).length },
      { range: '$11-$50', count: basePublications.filter(p => p.price && p.price.gt(10) && p.price.lte(50)).length },
      { range: '$51+', count: basePublications.filter(p => p.price && p.price.gt(50)).length },
    ],
    cmeCredits: [
      { range: '1-3 credits', count: basePublications.filter(p => p.cmeCredits && p.cmeCredits >= 1 && p.cmeCredits <= 3).length },
      { range: '4-8 credits', count: basePublications.filter(p => p.cmeCredits && p.cmeCredits >= 4 && p.cmeCredits <= 8).length },
      { range: '9+ credits', count: basePublications.filter(p => p.cmeCredits && p.cmeCredits >= 9).length },
    ],
  };
}

function generateExcerpt(content: string, maxLength: number = 200): string {
  // Remove HTML tags if present
  const plainText = content.replace(/<[^>]*>/g, '');
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }
  
  // If no good sentence break, truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

function generateHighlights(publication: any, query: string): any {
  if (!query) return {};

  const highlights: any = {};
  const queryLower = query.toLowerCase();

  // Highlight title
  if (publication.title.toLowerCase().includes(queryLower)) {
    highlights.title = publication.title.replace(
      new RegExp(query, 'gi'),
      `<mark>$&</mark>`
    );
  }

  // Highlight content snippet
  const contentIndex = publication.content.toLowerCase().indexOf(queryLower);
  if (contentIndex !== -1) {
    const start = Math.max(0, contentIndex - 100);
    const end = Math.min(publication.content.length, contentIndex + query.length + 100);
    const snippet = publication.content.substring(start, end);
    
    highlights.content = snippet.replace(
      new RegExp(query, 'gi'),
      `<mark>$&</mark>`
    );
  }

  // Highlight matching tags
  const matchingTags = publication.tags?.filter((tag: string) =>
    tag.toLowerCase().includes(queryLower)
  );
  if (matchingTags?.length > 0) {
    highlights.tags = matchingTags.map((tag: string) =>
      tag.replace(new RegExp(query, 'gi'), `<mark>$&</mark>`)
    );
  }

  return highlights;
}

function extractCredentials(medicalCredentials: any): string {
  if (!medicalCredentials) return '';
  
  const credentials = [];
  if (medicalCredentials.degree) credentials.push(medicalCredentials.degree);
  if (medicalCredentials.certifications) credentials.push(...medicalCredentials.certifications);
  
  return credentials.join(', ');
}

async function trackSearchQuery(query: string, userId?: string) {
  try {
    await prisma.searchQuery.create({
      data: {
        userId,
        query: query.toLowerCase(),
        resultsCount: 0, // Will be updated after getting results
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Error tracking search query:', error);
  }
}

async function getRecentSearches(userId?: string): Promise<string[]> {
  if (!userId) return [];

  const recentSearches = await prisma.searchQuery.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: 10,
    select: { query: true },
  });

  return recentSearches.map(s => s.query);
}

async function getRelatedQueries(query: string): Promise<string[]> {
  // Find queries that have similar terms or common patterns
  const relatedSearches = await prisma.searchQuery.findMany({
    where: {
      query: {
        contains: query.split(' ')[0], // Use first word for related queries
        mode: 'insensitive',
      },
      NOT: {
        query: query.toLowerCase(),
      },
    },
    orderBy: { timestamp: 'desc' },
    take: 5,
    select: { query: true },
  });

  return relatedSearches.map(s => s.query);
}