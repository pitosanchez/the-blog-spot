import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { recordCMECompletion } from '@/lib/cme';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { publicationId, answers, timeSpent } = await request.json();

    if (!publicationId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ 
        error: 'Publication ID and answers are required' 
      }, { status: 400 });
    }

    // Get the CME activity
    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!publication || publication.accessType !== 'CME') {
      return NextResponse.json({ 
        error: 'Invalid CME activity' 
      }, { status: 404 });
    }

    const metadata = publication.metadata as any;
    const test = metadata?.cmeTest;
    
    if (!test || !test.questions) {
      return NextResponse.json({ 
        error: 'CME test not found' 
      }, { status: 404 });
    }

    // Calculate score
    let correctAnswers = 0;
    test.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / test.questions.length) * 100);

    // Check if passing score is met
    if (score < test.passingScore) {
      return NextResponse.json({ 
        error: `Minimum passing score is ${test.passingScore}%. You scored ${score}%.`,
        score,
        passed: false
      }, { status: 400 });
    }

    // Record completion
    const completion = await recordCMECompletion(
      session.user.id,
      publicationId,
      score,
      timeSpent || 0
    );

    return NextResponse.json({ 
      ...completion,
      passed: true,
      message: 'CME activity completed successfully'
    });

  } catch (error) {
    console.error('Error completing CME activity:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: error.message 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}