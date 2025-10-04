'use client';

import { useState, useEffect } from 'react';

interface SuiPriceData {
  suiAmount: number;
  suiPriceUsd: number;
  totalPriceUsd: number;
  priceInCents: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<SuiPriceData | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    fetchSuiPrice();
    // Refresh price every 60 seconds
    const interval = setInterval(fetchSuiPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSuiPrice = async () => {
    try {
      const response = await fetch('/api/sui-price');
      const data = await response.json();
      setPriceData(data);
    } catch (error) {
      console.error('Error fetching SUI price:', error);
    } finally {
      setPriceLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { url } = (await res.json()) as { url: string };

      // Redirect directly to Stripe Checkout URL
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              OSINT Investigations
            </h1>
            <p className="text-xl text-blue-200">
              Master the Art of Open Source Intelligence
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Book Preview */}
            <div className="relative">
              <div className="bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform">
                <div className="aspect-[3/4] relative rounded overflow-hidden">
                  <img
                    src="/book-cover.png"
                    alt="OSINT Investigations Book Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6">
                Get Your Copy Today
              </h2>

              <div className="mb-8">
                {priceLoading ? (
                  <div className="text-4xl font-bold text-white mb-2">Loading...</div>
                ) : priceData ? (
                  <>
                    <div className="text-4xl font-bold text-white mb-2">
                      ${priceData.totalPriceUsd.toFixed(2)}
                    </div>
                    <div className="text-blue-200">
                      3 SUI ≈ ${priceData.totalPriceUsd.toFixed(2)} USD
                    </div>
                    <div className="text-sm text-blue-300 mt-1">
                      1 SUI = ${priceData.suiPriceUsd.toFixed(2)} • Updates every 60s
                    </div>
                  </>
                ) : (
                  <div className="text-4xl font-bold text-white mb-2">Price unavailable</div>
                )}
                <div className="text-blue-200 mt-2">Digital PDF Edition</div>
              </div>

              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Comprehensive OSINT techniques and methodologies</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-world investigation case studies</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Tools and resources for effective investigations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instant digital download</span>
                </li>
              </ul>

              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Processing...' : 'Purchase Now'}
              </button>

              <p className="text-sm text-blue-200 mt-4 text-center">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center text-blue-200 text-sm">
            <p>© 2024 OSINT Investigations. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
