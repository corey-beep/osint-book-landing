'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = '/OSINT-INVESTIGATIONS.pdf';
    link.download = 'OSINT-INVESTIGATIONS.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
  };

  useEffect(() => {
    // Optional: Auto-download after 2 seconds
    const timer = setTimeout(() => {
      handleDownload();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Thank you for purchasing OSINT Investigations
          </p>

          {/* Download Section */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <p className="text-white mb-4">
              Your download should start automatically. If it doesn&apos;t, click the button below:
            </p>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
            >
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-blue-200 space-y-2">
            <p>
              A confirmation email has been sent to your email address.
            </p>
            <p>
              If you have any questions or issues, please contact support.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-8">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
