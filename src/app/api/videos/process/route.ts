import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { initiateVideoProcessing } from '@/lib/video';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { videoId, processingOptions } = body;

    // Verify video ownership
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: session.user.id,
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    if (video.status !== 'UPLOADING') {
      return NextResponse.json(
        { error: 'Video is not in uploadable state' },
        { status: 400 }
      );
    }

    const defaultOptions = {
      qualities: ['1080p', '720p', '480p'],
      generateThumbnails: true,
      enableCaptions: false,
      ...processingOptions,
    };

    // Start video processing
    const jobId = await initiateVideoProcessing(
      video.s3Key,
      videoId,
      defaultOptions
    );

    // Update video status
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'PROCESSING',
        mediaConvertJobId: jobId,
        qualities: defaultOptions.qualities,
      },
    });

    return NextResponse.json({
      success: true,
      jobId,
      status: 'PROCESSING',
    });
  } catch (error) {
    console.error('Video processing error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate video processing' },
      { status: 500 }
    );
  }
}
