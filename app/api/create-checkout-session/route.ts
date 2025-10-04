import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Calculate price directly here (3 SUI at $3.50 = $10.50)
    const suiAmount = 3;
    const suiPriceUsd = 3.50; // Fixed price for now
    const totalPriceUsd = suiAmount * suiPriceUsd;
    const priceInCents = Math.round(totalPriceUsd * 100);

    console.log('Creating checkout session for:', { suiAmount, totalPriceUsd, priceInCents });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'OSINT Investigations - Digital Book',
              description: `Complete guide to Open Source Intelligence investigations (3 SUI ≈ $${totalPriceUsd.toFixed(2)} USD)`,
            },
            unit_amount: priceInCents, // Dynamic price based on 3 SUI
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/`,
      metadata: {
        suiAmount: suiAmount.toString(),
        suiPriceUsd: suiPriceUsd.toString(),
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
