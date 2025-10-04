import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Fetch current SUI price
    const origin = req.headers.get('origin') || req.headers.get('host') || '';
    const suiPriceUrl = origin.startsWith('http')
      ? `${origin}/api/sui-price`
      : `https://${origin}/api/sui-price`;

    console.log('Fetching SUI price from:', suiPriceUrl);
    const priceResponse = await fetch(suiPriceUrl);

    if (!priceResponse.ok) {
      throw new Error(`Failed to fetch SUI price: ${priceResponse.status}`);
    }

    const priceData = await priceResponse.json();
    console.log('SUI price data:', priceData);

    if (!priceData.priceInCents) {
      throw new Error('Unable to fetch SUI price - missing priceInCents');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'OSINT Investigations - Digital Book',
              description: `Complete guide to Open Source Intelligence investigations (3 SUI ≈ $${priceData.totalPriceUsd.toFixed(2)} USD)`,
            },
            unit_amount: priceData.priceInCents, // Dynamic price based on 3 SUI
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/`,
      metadata: {
        suiAmount: '3',
        suiPriceUsd: priceData.suiPriceUsd.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating checkout session:', errorMessage, error);
    return NextResponse.json(
      { error: 'Error creating checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
