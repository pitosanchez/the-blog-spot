import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature, STRIPE_WEBHOOK_EVENTS } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    const event = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED:
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event.data.object);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event.data.object);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event.data.object);
        break;

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED:
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { customer, subscription, metadata } = session;
  const { userId, tier, interval } = metadata;

  try {
    // Update user subscription status in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: tier,
        subscriptionInterval: interval.toUpperCase(),
        stripeCustomerId: customer,
        stripeSubscriptionId: subscription,
        subscriptionStartDate: new Date(),
      },
    });

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId: subscription,
        stripeCustomerId: customer,
        status: 'ACTIVE',
        tier,
        interval: interval.toUpperCase(),
        startDate: new Date(),
      },
    });

    console.log(`Subscription activated for user ${userId}`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  const { customer, metadata } = subscription;
  const { userId, tier, interval } = metadata;

  try {
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: 'ACTIVE',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer,
        status: 'ACTIVE',
        tier,
        interval: interval?.toUpperCase() || 'MONTHLY',
        startDate: new Date(subscription.created * 1000),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    console.log(`Subscription created: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    const subscriptionRecord = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!subscriptionRecord) {
      console.log(`Subscription not found: ${subscription.id}`);
      return;
    }

    // Update subscription status
    let status = 'ACTIVE';
    if (subscription.status === 'canceled') {
      status = 'CANCELED';
    } else if (subscription.status === 'past_due') {
      status = 'PAST_DUE';
    } else if (subscription.status === 'unpaid') {
      status = 'UNPAID';
    }

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      },
    });

    // Update user subscription status
    await prisma.user.update({
      where: { id: subscriptionRecord.userId },
      data: {
        subscriptionStatus: status,
      },
    });

    console.log(`Subscription updated: ${subscription.id} - Status: ${status}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    const subscriptionRecord = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!subscriptionRecord) {
      console.log(`Subscription not found: ${subscription.id}`);
      return;
    }

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });

    // Update user subscription status
    await prisma.user.update({
      where: { id: subscriptionRecord.userId },
      data: {
        subscriptionStatus: 'INACTIVE',
      },
    });

    console.log(`Subscription canceled: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  const { customer, subscription } = invoice;

  try {
    if (subscription) {
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription },
        data: {
          status: 'ACTIVE',
          lastPaymentDate: new Date(),
        },
      });

      // Update user status
      const subscriptionRecord = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscription },
      });

      if (subscriptionRecord) {
        await prisma.user.update({
          where: { id: subscriptionRecord.userId },
          data: {
            subscriptionStatus: 'ACTIVE',
          },
        });
      }
    }

    // Create payment record
    await prisma.payment.create({
      data: {
        stripeInvoiceId: invoice.id,
        stripeCustomerId: customer,
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency.toUpperCase(),
        status: 'SUCCEEDED',
        type: 'SUBSCRIPTION',
        createdAt: new Date(invoice.created * 1000),
      },
    });

    console.log(`Payment succeeded: ${invoice.id}`);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  const { customer, subscription } = invoice;

  try {
    if (subscription) {
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription },
        data: {
          status: 'PAST_DUE',
        },
      });

      // Update user status
      const subscriptionRecord = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscription },
      });

      if (subscriptionRecord) {
        await prisma.user.update({
          where: { id: subscriptionRecord.userId },
          data: {
            subscriptionStatus: 'PAST_DUE',
          },
        });

        // TODO: Send email notification about failed payment
        console.log(`Payment failed for user: ${subscriptionRecord.userId}`);
      }
    }

    // Create failed payment record
    await prisma.payment.create({
      data: {
        stripeInvoiceId: invoice.id,
        stripeCustomerId: customer,
        amount: invoice.amount_due / 100,
        currency: invoice.currency.toUpperCase(),
        status: 'FAILED',
        type: 'SUBSCRIPTION',
        createdAt: new Date(invoice.created * 1000),
      },
    });

    console.log(`Payment failed: ${invoice.id}`);
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}