import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    // Fetch current SUI price
    const priceResponse = await fetch(`${req.headers.get('origin')}/api/sui-price`);
    const priceData = await priceResponse.json();

    if (!priceData.priceInCents) {
      throw new Error('Unable to fetch SUI price');
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

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
