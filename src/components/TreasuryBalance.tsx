'use client';

import { useState, useEffect } from 'react';

interface TreasuryData {
  treasuryBalance: number;
  distributionAmount: number;
  keepAmount: number;
  network: string;
}

export default function TreasuryBalance() {
  const [data, setData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const creatorWallet = process.env.NEXT_PUBLIC_CREATOR_WALLET_ADDRESS;
      if (!creatorWallet) {
        console.error("NEXT_PUBLIC_CREATOR_WALLET_ADDRESS not found in environment variables");
        return;
      }
      await navigator.clipboard.writeText(creatorWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  useEffect(() => {
    const fetchTreasuryBalance = async () => {
      try {
        const response = await fetch('/api/treasury-balance');
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch treasury balance');
        }
      } catch (err) {
        setError('Network error');
        console.error('Error fetching treasury balance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreasuryBalance();
    
    // Refresh every 10 seconds to catch cache updates quickly
    const interval = setInterval(fetchTreasuryBalance, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="pump-card rounded-xl p-6 animate-pulse-green text-center">
        <div className="py-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-300">TREASURY BALANCE</h3>
            <div className="text-5xl md:text-6xl font-bold pump-gradient-text">...</div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">
                Available in creator wallet • Distribution every 20 minutes
              </p>
              <p className="text-[var(--pump-green)] text-xs font-medium">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pump-card rounded-xl p-6 text-center">
        <div className="py-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-300">TREASURY BALANCE</h3>
            <div className="text-5xl md:text-6xl font-bold text-red-400">Error</div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pump-card rounded-xl p-6 animate-pulse-green text-center">
      <div className="py-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-300">TREASURY BALANCE</h3>
          <div className="text-5xl md:text-6xl font-bold pump-gradient-text">
            {data?.treasuryBalance.toFixed(4) || '0.0000'} SOL
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">
              Available in creator wallet • Distribution every 20 minutes
            </p>
            <p className="text-gray-300 text-xs font-semibold">
              ~{data?.distributionAmount.toFixed(4) || '0.0000'} SOL will be distributed (95% of treasury)
            </p>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="text-lg font-semibold text-gray-300 mb-2">TREASURY WALLET</div>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-sm text-green-400">
                  {process.env.NEXT_PUBLIC_CREATOR_WALLET_ADDRESS || 'Address not configured'}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-green-400"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
