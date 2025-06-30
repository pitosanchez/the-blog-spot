import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { generatePresignedUploadUrl, validateVideoFile } from '@/lib/video';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      fileName,
      fileSize,
      fileType,
      title,
      description,
      type,
      specialty,
      tags = [],
    } = body;

    // Validate file
    const mockFile = { name: fileName, size: fileSize, type: fileType } as File;
    const validation = validateVideoFile(mockFile);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Generate presigned URL
    const { uploadUrl, key } = await generatePresignedUploadUrl(
      fileName,
      fileType,
      session.user.id
    );

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        title,
        description,
        userId: session.user.id,
        type: type || 'LECTURE',
        originalFileName: fileName,
        originalFileSize: fileSize,
        s3Key: key,
        specialty,
        tags,
        status: 'UPLOADING',
      },
    });

    return NextResponse.json({
      videoId: video.id,
      uploadUrl,
      s3Key: key,
    });
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate video upload' },
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
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const specialty = url.searchParams.get('specialty');

    const where: any = {
      userId: session.user.id,
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (specialty) where.specialty = specialty;

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              specialties: true,
            },
          },
          _count: {
            select: {
              views: true,
              interactions: true,
              chapters: true,
            },
          },
        },
      }),
      prisma.video.count({ where }),
    ]);

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
