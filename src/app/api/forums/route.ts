import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { type ForumCategory } from '@/lib/communication';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category') as ForumCategory;
    const tags = searchParams.get('tags')?.split(',');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'lastActivity'; // lastActivity, votes, views, created
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (tags?.length) {
      whereClause.tags = { hasSome: tags };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build order by clause
    let orderBy: any = {};
    switch (sort) {
      case 'votes':
        orderBy = { upvotes: 'desc' };
        break;
      case 'views':
        orderBy = { views: 'desc' };
        break;
      case 'created':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { lastActivity: 'desc' };
    }

    // Get posts with counts
    const [posts, totalCount] = await Promise.all([
      prisma.forumPost.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              email: true,
              role: true,
              specialties: true,
              institution: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.forumPost.count({ where: whereClause }),
    ]);

    // Get user votes if authenticated
    let userVotes: Record<string, 'up' | 'down'> = {};
    if (session?.user) {
      const votes = await prisma.forumVote.findMany({
        where: {
          userId: session.user.id,
          postId: { in: posts.map(p => p.id) },
        },
        select: {
          postId: true,
          voteType: true,
        },
      });

      userVotes = votes.reduce((acc, vote) => {
        acc[vote.postId] = vote.voteType as 'up' | 'down';
        return acc;
      }, {} as Record<string, 'up' | 'down'>);
    }

    // Transform posts for response
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content.substring(0, 500) + (post.content.length > 500 ? '...' : ''),
      category: post.category,
      tags: post.tags,
      isAnonymous: post.isAnonymous,
      isPinned: post.isPinned,
      isLocked: post.isLocked,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      views: post.views,
      replyCount: post._count.replies,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      lastActivity: post.lastActivity,
      author: post.isAnonymous ? null : {
        id: post.author.id,
        name: post.author.email.split('@')[0],
        role: post.author.role,
        specialties: post.author.specialties,
        institution: post.author.institution,
      },
      userVote: userVotes[post.id] || null,
    }));

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category, tags, isAnonymous } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'title, content, and category are required' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      'CASE_DISCUSSION',
      'CLINICAL_QUESTION',
      'RESEARCH',
      'GUIDELINES',
      'DRUG_INFORMATION',
      'MEDICAL_NEWS',
      'CAREER_ADVICE',
      'GENERAL_DISCUSSION',
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create forum post
    const post = await prisma.forumPost.create({
      data: {
        authorId: session.user.id,
        title,
        content,
        category,
        tags: tags || [],
        isAnonymous: isAnonymous || false,
        isPinned: false,
        isLocked: false,
        upvotes: 0,
        downvotes: 0,
        views: 0,
        lastActivity: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
            specialties: true,
            institution: true,
          },
        },
      },
    });

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId: session.user.id,
        sessionId: `forum_${Date.now()}`,
        eventType: 'forum_post_created',
        eventData: {
          postId: post.id,
          category: post.category,
          isAnonymous: post.isAnonymous,
          contentLength: content.length,
          tagCount: tags?.length || 0,
        },
        timestamp: new Date(),
      },
    });

    return NextResponse.json({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        isAnonymous: post.isAnonymous,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        views: post.views,
        createdAt: post.createdAt,
        author: post.isAnonymous ? null : {
          id: post.author.id,
          name: post.author.email.split('@')[0],
          role: post.author.role,
          specialties: post.author.specialties,
        },
      },
    });

  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { error: 'Failed to create forum post' },
      { status: 500 }
    );
  }
}

// Get specific forum post with replies
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId required' },
        { status: 400 }
      );
    }

    // Increment view count
    await prisma.forumPost.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    // Get post with replies
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
            specialties: true,
            institution: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                role: true,
                specialties: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Transform post for response
    const transformedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      isAnonymous: post.isAnonymous,
      isPinned: post.isPinned,
      isLocked: post.isLocked,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      views: post.views,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      lastActivity: post.lastActivity,
      author: post.isAnonymous ? null : {
        id: post.author.id,
        name: post.author.email.split('@')[0],
        role: post.author.role,
        specialties: post.author.specialties,
        institution: post.author.institution,
      },
      replies: post.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        isAnonymous: reply.isAnonymous,
        upvotes: reply.upvotes,
        downvotes: reply.downvotes,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        isBestAnswer: reply.isBestAnswer,
        isModeratorResponse: reply.isModeratorResponse,
        author: reply.isAnonymous ? null : {
          id: reply.author.id,
          name: reply.author.email.split('@')[0],
          role: reply.author.role,
          specialties: reply.author.specialties,
        },
      })),
    };

    return NextResponse.json({ post: transformedPost });

  } catch (error) {
    console.error('Error fetching forum post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum post' },
      { status: 500 }
    );
  }
}