import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { createLiveStreamRoom } from '@/lib/video';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      conferenceId,
      maxParticipants = 100,
      recordSession = true,
    } = body;

    const roomName = `medipublish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create live stream room
    const { roomUrl, roomToken } = await createLiveStreamRoom({
      roomName,
      userId: session.user.id,
      userName: session.user.email || 'Host',
      isHost: true,
      recordSession,
      enableScreenShare: true,
      maxParticipants,
    });

    // Create live stream record
    const liveStream = await prisma.liveStream.create({
      data: {
        title,
        description,
        userId: session.user.id,
        conferenceId,
        roomName,
        roomUrl,
        maxParticipants,
        dailyToken: roomToken,
      },
    });

    return NextResponse.json({
      liveStreamId: liveStream.id,
      roomUrl,
      roomToken,
      roomName,
    });
  } catch (error) {
    console.error('Live stream creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create live stream' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const isActive = url.searchParams.get('active') === 'true';
    const conferenceId = url.searchParams.get('conferenceId');

    const where: any = {
      userId: session.user.id,
    };

    if (isActive !== undefined) where.isActive = isActive;
    if (conferenceId) where.conferenceId = conferenceId;

    const liveStreams = await prisma.liveStream.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        conference: {
          select: {
            id: true,
            title: true,
            scheduledAt: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return NextResponse.json({ liveStreams });
  } catch (error) {
    console.error('Get live streams error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live streams' },
      { status: 500 }
    );
  }
}
