import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// This function handles the Stripe webhook
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Here we'll call the function to buy SUI and send to your wallet
    try {
      await processSuiPurchase(session);
    } catch (error) {
      console.error('Error processing SUI purchase:', error);
      // Note: Payment already succeeded, so we log the error but don't fail the webhook
    }
  }

  return NextResponse.json({ received: true });
}

async function processSuiPurchase(session: Stripe.Checkout.Session) {
  // Import the SUI purchase logic
  const { buySuiAndSendToWallet } = await import('@/lib/sui-purchase');

  const amountInUsd = (session.amount_total || 0) / 100; // Convert cents to dollars
  const suiAmount = parseFloat(session.metadata?.suiAmount || '3');

  await buySuiAndSendToWallet({
    amountInUsd,
    sessionId: session.id,
    customerEmail: session.customer_email || undefined,
    suiAmount,
  });
}
