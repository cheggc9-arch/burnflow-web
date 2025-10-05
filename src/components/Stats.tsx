'use client';

import { useState, useEffect } from 'react';
import { Users, Wallet, Coins } from "lucide-react";

interface StatsData {
  treasuryBalance: number;
  activeHolders: number;
  totalDistributed: number;
  totalRounds: number;
  network: string;
}

export default function Stats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch stats');
        }
      } catch (err) {
        setError('Network error');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every 10 seconds to catch cache updates quickly
    const interval = setInterval(fetchStats, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="pump-card rounded-xl p-6">
            <div className="flex items-center space-x-4 p-4">
              <div className="w-10 h-10 bg-gray-700 rounded animate-pulse"></div>
              <div>
                <div className="text-2xl font-bold">...</div>
                <div className="text-sm text-gray-400">Loading...</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="pump-card rounded-xl p-6 col-span-full text-center">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="group relative">
        <div className="pump-card rounded-xl p-6">
          <div className="flex items-center space-x-4 p-4">
            <Users className="w-10 h-10 text-[var(--pump-green)]" />
            <div>
              <div className="text-2xl font-bold">
                {data?.activeHolders.toLocaleString() || '0'}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-400">Active Holders</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-info w-3 h-3 text-gray-500 cursor-help"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
          Excludes liquidity pools and holders with less than 1,000,000 tokens
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      <div className="pump-card rounded-xl p-6">
        <div className="flex items-center space-x-4 p-4">
          <Coins className="w-10 h-10 text-[var(--pump-green)]" />
          <div>
            <div className="text-2xl font-bold text-[var(--pump-green)]">
              {data?.totalDistributed.toFixed(4) || '0.0000'} SOL
            </div>
            <div className="text-sm text-gray-400">Total Distributed</div>
          </div>
        </div>
      </div>

      <div className="pump-card rounded-xl p-6">
        <div className="flex items-center space-x-4 p-4">
          <Wallet className="w-10 h-10 text-[var(--pump-green)]" />
          <div>
            <div className="text-2xl font-bold text-[var(--pump-green)]">
              {data?.totalRounds || '0'}
            </div>
            <div className="text-sm text-gray-400">Distribution Rounds</div>
          </div>
        </div>
      </div>
    </div>
  );
}
