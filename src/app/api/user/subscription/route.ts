import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { getSubscription } from '@/lib/stripe';

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

    // Get user's subscription from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          where: { status: { in: ['ACTIVE', 'PAST_DUE', 'CANCELED'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const subscription = user.subscriptions[0];

    if (!subscription) {
      return NextResponse.json({
        status: 'INACTIVE',
        tier: null,
        interval: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        nextBillingDate: null,
        amount: 0,
        stripeCustomerId: user.stripeCustomerId,
      });
    }

    // Get latest subscription data from Stripe
    let stripeSubscription = null;
    if (subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await getSubscription(subscription.stripeSubscriptionId);
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    // Calculate amount based on tier and interval
    const SUBSCRIPTION_TIERS = await import('@/lib/stripe').then(mod => mod.SUBSCRIPTION_TIERS);
    const tierConfig = SUBSCRIPTION_TIERS[subscription.tier as keyof typeof SUBSCRIPTION_TIERS];
    const amount = subscription.interval === 'ANNUAL' 
      ? tierConfig?.annualPrice || 0 
      : tierConfig?.monthlyPrice || 0;

    return NextResponse.json({
      status: subscription.status,
      tier: subscription.tier,
      interval: subscription.interval,
      currentPeriodStart: subscription.currentPeriodStart?.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
      nextBillingDate: subscription.currentPeriodEnd?.toISOString(),
      amount,
      stripeCustomerId: user.stripeCustomerId,
      stripeData: stripeSubscription ? {
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      } : null,
    });

  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
}