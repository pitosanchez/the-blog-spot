import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCMEActivity, validateCMEActivity } from '@/lib/cme';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'CREATOR' || session.user.verificationStatus !== 'VERIFIED') {
      return NextResponse.json({ error: 'Only verified creators can create CME activities' }, { status: 403 });
    }

    const { activity, content, questions } = await request.json();

    // Validate CME activity data
    const validationErrors = validateCMEActivity(activity);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Validate questions
    if (!questions || questions.length < 10) {
      return NextResponse.json({ 
        error: 'At least 10 test questions are required' 
      }, { status: 400 });
    }

    // Create publication first
    const publication = await prisma.publication.create({
      data: {
        title: activity.title,
        content: content,
        type: 'ARTICLE',
        accessType: 'CME',
        authorId: session.user.id,
        cmeCredits: activity.creditHours,
        tags: activity.targetAudience ? [activity.targetAudience] : [],
        status: 'REVIEW', // CME activities need review before approval
        metadata: {
          cmeActivity: {
            ...activity,
            releaseDate: new Date(),
            expirationDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year
          },
          cmeTest: {
            questions: questions,
            passingScore: 70, // 70% passing score
            attemptsAllowed: 3,
            timeLimit: activity.creditHours * 60, // 1 hour per credit
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        activity: 'CME_ACTIVITY_CREATED',
        metadata: {
          publicationId: publication.id,
          creditHours: activity.creditHours,
          questionCount: questions.length,
        },
      },
    });

    return NextResponse.json({ 
      id: publication.id,
      message: 'CME activity created successfully and submitted for review'
    });

  } catch (error) {
    console.error('Error creating CME activity:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}