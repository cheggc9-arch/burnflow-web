'use client';

import { useState, useEffect } from 'react';

interface BurnWalletData {
  burnWalletBalance: number;
  burnWalletAddress: string;
  network: string;
}

export default function BurnWalletBalance() {
  const [data, setData] = useState<BurnWalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(60);

  const copyToClipboard = async () => {
    try {
      if (data?.burnWalletAddress) {
        await navigator.clipboard.writeText(data.burnWalletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  useEffect(() => {
    const fetchBurnWalletBalance = async () => {
      try {
        const response = await fetch('/api/burn-wallet');
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch burn wallet balance');
        }
      } catch (err) {
        setError('Network error');
        console.error('Error fetching burn wallet balance:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBurnInterval = async () => {
      try {
        const response = await fetch('/api/burn-status');
        const result = await response.json();
        
        if (result.success && result.data.intervalMinutes) {
          setIntervalMinutes(result.data.intervalMinutes);
        }
      } catch (err) {
        console.error('Error fetching burn interval:', err);
      }
    };

    fetchBurnWalletBalance();
    fetchBurnInterval();
    
    // Refresh every 10 seconds to catch cache updates quickly
    const interval = setInterval(fetchBurnWalletBalance, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="pump-card rounded-xl p-6 animate-pulse-red text-center">
        <div className="py-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-300">BURN WALLET BALANCE</h3>
            <div className="text-5xl md:text-6xl font-bold burn-gradient-text">...</div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">
                Available in burn wallet • Burns every {intervalMinutes} minutes
              </p>
              <p className="text-red-400 text-xs font-medium">Loading...</p>
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
            <h3 className="text-lg font-semibold text-gray-300">BURN WALLET BALANCE</h3>
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
    <div className="pump-card rounded-xl p-6 animate-pulse-red text-center">
      <div className="py-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-300">BURN WALLET BALANCE</h3>
          <div className="text-5xl md:text-6xl font-bold burn-gradient-text">
            {data?.burnWalletBalance ? data.burnWalletBalance.toFixed(4) : '0.0000'} SOL
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">
              Available in burn wallet • Burns every {intervalMinutes} minutes
            </p>
            <p className="text-gray-300 text-xs font-semibold">
              This wallet automatically buys and burns tokens
            </p>
            <p className="text-gray-300 text-sm">
              0.13 SOL reserved for transaction fees
            </p>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="text-lg font-semibold text-gray-300 mb-2">BURN WALLET</div>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-sm text-red-400">
                  {data?.burnWalletAddress || 'Address not configured'}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
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
                      className="w-4 h-4 text-red-400"
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