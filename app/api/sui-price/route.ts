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
          'User-Agent': 'Mozilla/5.0',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      // Use fallback price if API fails
      return getFallbackPrice();
    }

    const data = await response.json();
    const suiPriceUsd = data.sui?.usd;

    if (!suiPriceUsd) {
      console.error('SUI price not available in response');
      return getFallbackPrice();
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
    return getFallbackPrice();
  }
}

function getFallbackPrice() {
  // Fallback: Use a fixed price of ~$3.50 per SUI
  const suiAmount = 3;
  const suiPriceUsd = 3.50;
  const priceInUsd = suiAmount * suiPriceUsd;

  return NextResponse.json({
    suiAmount,
    suiPriceUsd,
    totalPriceUsd: priceInUsd,
    priceInCents: Math.round(priceInUsd * 100),
    fallback: true, // Indicate this is a fallback price
  });
}
