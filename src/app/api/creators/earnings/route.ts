import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { calculateCreatorEarnings, calculatePlatformFee } from '@/lib/stripe';

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

    if (session.user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Creator access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get creator's earnings data
    const creator = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        publications: {
          include: {
            subscriptions: {
              where: {
                createdAt: { gte: startDate },
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    });

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    // Calculate subscriber count and revenue
    const subscribers = await prisma.subscription.count({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
    });

    // Get payments for this creator
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'SUCCEEDED',
        // You'll need to implement a way to link payments to creators
        // This is a simplified version
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Calculate earnings (simplified calculation)
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPlatformFees = calculatePlatformFee(totalPayments);
    const totalEarnings = calculateCreatorEarnings(totalPayments);

    // Mock data for demo (replace with real calculations)
    const mockEarnings = {
      totalEarnings: 2847.50,
      monthlyEarnings: 1250.00,
      platformFees: calculatePlatformFee(1250.00),
      subscribers: subscribers || 42,
      publications: creator.publications.length,
      cmeCreditsEarned: 8,
      sponsorshipRevenue: 500.00,
      recentTransactions: [
        {
          id: '1',
          type: 'SUBSCRIPTION' as const,
          amount: 29.00,
          platformFee: calculatePlatformFee(29.00),
          netEarnings: calculateCreatorEarnings(29.00),
          description: 'Monthly subscription - Individual Plan',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED' as const,
        },
        {
          id: '2',
          type: 'CME' as const,
          amount: 50.00,
          platformFee: 0,
          netEarnings: 50.00,
          description: 'CME Credit - "Cardiology Update 2024"',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED' as const,
        },
        {
          id: '3',
          type: 'SUBSCRIPTION' as const,
          amount: 99.00,
          platformFee: calculatePlatformFee(99.00),
          netEarnings: calculateCreatorEarnings(99.00),
          description: 'Monthly subscription - Practice Plan',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED' as const,
        },
        {
          id: '4',
          type: 'SPONSORSHIP' as const,
          amount: 500.00,
          platformFee: 0,
          netEarnings: 500.00,
          description: 'Sponsorship - MedTech Solutions',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED' as const,
        },
        {
          id: '5',
          type: 'CONFERENCE' as const,
          amount: 150.00,
          platformFee: calculatePlatformFee(150.00) * 0.3, // 30% for conferences
          netEarnings: 150.00 - (calculatePlatformFee(150.00) * 0.3),
          description: 'Conference ticket - "Future of Telemedicine"',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'PENDING' as const,
        },
      ],
      monthlyBreakdown: [
        { month: 'Jan 2024', earnings: 2847.50, subscribers: 42, publications: 12 },
        { month: 'Dec 2023', earnings: 2234.75, subscribers: 38, publications: 11 },
        { month: 'Nov 2023', earnings: 1956.20, subscribers: 34, publications: 10 },
        { month: 'Oct 2023', earnings: 1723.45, subscribers: 31, publications: 9 },
      ],
    };

    return NextResponse.json(mockEarnings);

  } catch (error) {
    console.error('Error fetching earnings data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings data' },
      { status: 500 }
    );
  }
}