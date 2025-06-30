import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createCheckoutSession, SUBSCRIPTION_TIERS, type SubscriptionTier, type BillingInterval } from '@/lib/stripe';

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
    const { tier, interval, successUrl, cancelUrl }: {
      tier: SubscriptionTier;
      interval: BillingInterval;
      successUrl: string;
      cancelUrl: string;
    } = body;

    // Validate tier and interval
    if (!tier || !SUBSCRIPTION_TIERS[tier]) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    if (!interval || !['monthly', 'annual'].includes(interval)) {
      return NextResponse.json(
        { error: 'Invalid billing interval' },
        { status: 400 }
      );
    }

    const tierConfig = SUBSCRIPTION_TIERS[tier];
    const priceId = tierConfig.stripePriceId[interval];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this tier and interval' },
        { status: 500 }
      );
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: session.user.id,
      userEmail: session.user.email!,
      successUrl: successUrl || `${process.env.NEXTAUTH_URL}/dashboard?subscription=success`,
      cancelUrl: cancelUrl || `${process.env.NEXTAUTH_URL}/pricing?subscription=canceled`,
      tier,
      interval,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}