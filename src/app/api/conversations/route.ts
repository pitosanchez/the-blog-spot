import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { type ConversationType } from '@/lib/communication';

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
    const type = searchParams.get('type') as ConversationType;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const archived = searchParams.get('archived') === 'true';

    // Build where clause
    const whereClause: any = {
      participants: {
        some: {
          userId: session.user.id,
          isActive: true,
        },
      },
      isArchived: archived,
    };

    if (type) {
      whereClause.type = type;
    }

    // Get conversations
    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                specialties: true,
                institution: true,
              },
            },
          },
        },
        lastMessage: {
          include: {
            sender: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                readAt: null,
                senderId: { not: session.user.id },
              },
            },
          },
        },
      },
      orderBy: {
        lastActivity: 'desc',
      },
      take: limit,
    });

    // Transform conversations for response
    const transformedConversations = conversations.map(conversation => ({
      id: conversation.id,
      type: conversation.type,
      title: conversation.title || generateConversationTitle(conversation, session.user.id),
      participants: conversation.participants.map(p => ({
        userId: p.userId,
        role: p.role,
        joinedAt: p.joinedAt,
        lastReadAt: p.lastReadAt,
        isActive: p.isActive,
        user: {
          id: p.user.id,
          name: p.user.email.split('@')[0],
          email: p.user.email,
          role: p.user.role,
          specialties: p.user.specialties,
          institution: p.user.institution,
        },
      })),
      lastMessage: conversation.lastMessage ? {
        id: conversation.lastMessage.id,
        content: conversation.lastMessage.content,
        timestamp: conversation.lastMessage.timestamp,
        sender: {
          id: conversation.lastMessage.sender.id,
          name: conversation.lastMessage.sender.email.split('@')[0],
        },
      } : null,
      lastActivity: conversation.lastActivity,
      unreadCount: conversation._count.messages,
      isArchived: conversation.isArchived,
      isEncrypted: conversation.isEncrypted,
      metadata: conversation.metadata,
    }));

    return NextResponse.json({
      conversations: transformedConversations,
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
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
    const { type, participantIds, title, metadata } = body;

    if (!type || !participantIds || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'type and participantIds are required' },
        { status: 400 }
      );
    }

    // Validate participants exist and are medical professionals
    const participants = await prisma.user.findMany({
      where: {
        id: { in: participantIds },
        role: { in: ['CREATOR', 'ADMIN'] }, // Only allow medical professionals
      },
      select: {
        id: true,
        email: true,
        role: true,
        specialties: true,
      },
    });

    if (participants.length !== participantIds.length) {
      return NextResponse.json(
        { error: 'Some participants not found or not authorized' },
        { status: 400 }
      );
    }

    // Add current user if not already included
    const allParticipantIds = [...new Set([session.user.id, ...participantIds])];

    // For direct messages, check if conversation already exists
    if (type === 'DIRECT_MESSAGE' && allParticipantIds.length === 2) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT_MESSAGE',
          participants: {
            every: {
              userId: { in: allParticipantIds },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (existingConversation && existingConversation.participants.length === 2) {
        return NextResponse.json({
          conversation: { id: existingConversation.id },
          isExisting: true,
        });
      }
    }

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        type,
        title,
        lastActivity: new Date(),
        isArchived: false,
        isEncrypted: true,
        metadata: metadata || {},
        participants: {
          create: allParticipantIds.map(userId => ({
            userId,
            role: userId === session.user.id ? 'ADMIN' : 'MEMBER',
            joinedAt: new Date(),
            isActive: true,
            permissions: {
              canRead: true,
              canWrite: true,
              canInvite: type !== 'DIRECT_MESSAGE',
              canRemove: userId === session.user.id,
              canModerate: userId === session.user.id,
              canAccessFiles: true,
              canShareCases: true,
            },
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                specialties: true,
                institution: true,
              },
            },
          },
        },
      },
    });

    // Send notifications to participants
    await notifyParticipants(conversation, session.user.id);

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        type: conversation.type,
        title: conversation.title || generateConversationTitle(conversation, session.user.id),
        participants: conversation.participants.map(p => ({
          userId: p.userId,
          role: p.role,
          user: {
            id: p.user.id,
            name: p.user.email.split('@')[0],
            email: p.user.email,
            role: p.user.role,
            specialties: p.user.specialties,
          },
        })),
        lastActivity: conversation.lastActivity,
        isEncrypted: conversation.isEncrypted,
      },
      isExisting: false,
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

function generateConversationTitle(conversation: any, currentUserId: string): string {
  if (conversation.title) {
    return conversation.title;
  }

  const otherParticipants = conversation.participants
    .filter((p: any) => p.userId !== currentUserId)
    .map((p: any) => p.user.email.split('@')[0]);

  if (conversation.type === 'DIRECT_MESSAGE') {
    return otherParticipants[0] || 'Direct Message';
  }

  if (otherParticipants.length === 0) {
    return 'Group Chat';
  }

  if (otherParticipants.length === 1) {
    return `Chat with ${otherParticipants[0]}`;
  }

  if (otherParticipants.length <= 3) {
    return otherParticipants.join(', ');
  }

  return `${otherParticipants.slice(0, 2).join(', ')} and ${otherParticipants.length - 2} others`;
}

async function notifyParticipants(conversation: any, creatorId: string) {
  const recipients = conversation.participants
    .filter((p: any) => p.userId !== creatorId)
    .map((p: any) => p.userId);

  for (const recipientId of recipients) {
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'CONVERSATION_INVITE',
        title: 'New Conversation',
        content: `You've been added to a new ${conversation.type.toLowerCase().replace('_', ' ')}`,
        data: {
          conversationId: conversation.id,
          creatorId: creatorId,
        },
        isRead: false,
        createdAt: new Date(),
      },
    });
  }
}