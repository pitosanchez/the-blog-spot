import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Creator access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Minimum withdrawal amount is $100' },
        { status: 400 }
      );
    }

    // Get creator's current balance
    const creator = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true,
        email: true,
        name: true,
        // You'll need to add an earnings balance field to track available earnings
      },
    });

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    // For now, we'll create a withdrawal request record
    // In a real implementation, you'd integrate with Stripe Connect or similar
    const withdrawalRequest = await prisma.withdrawalRequest.create({
      data: {
        userId: session.user.id,
        amount,
        status: 'PENDING',
        requestedAt: new Date(),
        // Add other relevant fields like bank account info, etc.
      },
    });

    // TODO: Integrate with actual payout system (Stripe Connect, PayPal, etc.)
    // For now, we'll just create the request and notify admins

    // Send notification to admin team (implement email notification)
    console.log(`Withdrawal request created: ${withdrawalRequest.id} for user ${session.user.id}, amount: $${amount}`);

    return NextResponse.json({
      success: true,
      withdrawalId: withdrawalRequest.id,
      message: 'Withdrawal request submitted successfully. Processing typically takes 2-3 business days.',
    });

  } catch (error) {
    console.error('Error processing withdrawal request:', error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal request' },
      { status: 500 }
    );
  }
}