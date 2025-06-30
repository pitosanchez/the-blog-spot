import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { CommunicationManager, type Message, type MessageType } from '@/lib/communication';

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
    const conversationId = searchParams.get('conversationId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const before = searchParams.get('before'); // Message ID for pagination

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId required' },
        { status: 400 }
      );
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            userId: session.user.id,
            isActive: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Build where clause for messages
    const whereClause: any = {
      conversationId,
    };

    if (before) {
      whereClause.timestamp = {
        lt: new Date(before),
      };
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            specialties: true,
            institution: true,
          },
        },
        attachments: true,
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    // Mark messages as read
    await markMessagesAsRead(conversationId, session.user.id);

    // Transform messages for response
    const transformedMessages = messages.map(transformMessage);

    return NextResponse.json({
      messages: transformedMessages,
      hasMore: messages.length === limit,
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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
    const { conversationId, content, messageType, replyToId, attachments } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'conversationId and content are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            userId: session.user.id,
            isActive: true,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Validate medical communication
    const validation = CommunicationManager.validateMedicalCommunication(content);
    if (validation.containsPHI) {
      return NextResponse.json(
        { 
          error: 'Message contains potential PHI and cannot be sent',
          warnings: validation.warnings 
        },
        { status: 400 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        conversationId,
        content,
        messageType: messageType || 'TEXT',
        replyToId,
        isEncrypted: true,
        timestamp: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            specialties: true,
            institution: true,
          },
        },
        attachments: true,
        reactions: true,
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Update conversation last activity
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastActivity: new Date(),
        lastMessageId: message.id,
      },
    });

    // Handle attachments if provided
    if (attachments && attachments.length > 0) {
      await prisma.messageAttachment.createMany({
        data: attachments.map((attachment: any) => ({
          messageId: message.id,
          fileName: attachment.fileName,
          fileSize: attachment.fileSize,
          fileType: attachment.fileType,
          fileUrl: attachment.fileUrl,
          thumbnailUrl: attachment.thumbnailUrl,
          isHIPAASecure: true,
          uploadedAt: new Date(),
        })),
      });
    }

    // Send real-time notifications to other participants
    await sendRealtimeNotifications(conversation, message, session.user.id);

    // Create notifications for urgent messages
    if (messageType === 'URGENT') {
      await createUrgentNotifications(conversation, message, session.user.id);
    }

    return NextResponse.json({
      message: transformMessage(message),
      warnings: validation.warnings,
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

async function markMessagesAsRead(conversationId: string, userId: string) {
  try {
    // Update last read timestamp for the user in this conversation
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}

async function sendRealtimeNotifications(conversation: any, message: any, senderId: string) {
  // In a real implementation, this would use WebSocket or Server-Sent Events
  // to notify other participants in real-time
  
  const recipients = conversation.participants
    .filter((p: any) => p.userId !== senderId && p.isActive)
    .map((p: any) => p.userId);

  // Create notification records
  for (const recipientId of recipients) {
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'NEW_MESSAGE',
        title: 'New message',
        content: `New message from ${message.sender.email}`,
        data: {
          conversationId: conversation.id,
          messageId: message.id,
          senderId: senderId,
        },
        isRead: false,
        createdAt: new Date(),
      },
    });
  }
}

async function createUrgentNotifications(conversation: any, message: any, senderId: string) {
  const recipients = conversation.participants
    .filter((p: any) => p.userId !== senderId && p.isActive);

  for (const participant of recipients) {
    // Create urgent notification
    await prisma.notification.create({
      data: {
        userId: participant.userId,
        type: 'URGENT_MESSAGE',
        title: 'Urgent Medical Message',
        content: `Urgent message from ${message.sender.email}: ${message.content.substring(0, 100)}...`,
        data: {
          conversationId: conversation.id,
          messageId: message.id,
          senderId: senderId,
          priority: 'URGENT',
        },
        isRead: false,
        createdAt: new Date(),
      },
    });

    // Send email notification for urgent messages
    // await sendUrgentEmailNotification(participant.user.email, message);
  }
}

function transformMessage(message: any): any {
  return {
    id: message.id,
    senderId: message.senderId,
    conversationId: message.conversationId,
    content: message.content,
    messageType: message.messageType,
    isEncrypted: message.isEncrypted,
    readAt: message.readAt,
    editedAt: message.editedAt,
    timestamp: message.timestamp,
    sender: {
      id: message.sender.id,
      name: message.sender.email.split('@')[0],
      email: message.sender.email,
      role: message.sender.role,
      specialties: message.sender.specialties,
      institution: message.sender.institution,
    },
    attachments: message.attachments || [],
    reactions: message.reactions?.map((reaction: any) => ({
      userId: reaction.userId,
      emoji: reaction.emoji,
      timestamp: reaction.timestamp,
      user: {
        id: reaction.user.id,
        name: reaction.user.email.split('@')[0],
      },
    })) || [],
    replyTo: message.replyTo ? {
      id: message.replyTo.id,
      content: message.replyTo.content,
      sender: {
        id: message.replyTo.sender.id,
        name: message.replyTo.sender.email.split('@')[0],
      },
    } : null,
  };
}