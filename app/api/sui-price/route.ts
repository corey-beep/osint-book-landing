import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch SUI price from CoinGecko API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch SUI price');
    }

    const data = await response.json();
    const suiPriceUsd = data.sui?.usd;

    if (!suiPriceUsd) {
      throw new Error('SUI price not available');
    }

    // Calculate price for 3 SUI
    const suiAmount = 3;
    const priceInUsd = suiAmount * suiPriceUsd;

    return NextResponse.json({
      suiAmount,
      suiPriceUsd,
      totalPriceUsd: priceInUsd,
      priceInCents: Math.round(priceInUsd * 100),
    });
  } catch (error) {
    console.error('Error fetching SUI price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SUI price' },
      { status: 500 }
    );
  }
}
