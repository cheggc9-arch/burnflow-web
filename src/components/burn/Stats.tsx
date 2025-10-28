'use client';

import { useState, useEffect } from 'react';
import { Users, Wallet, Coins, Flame } from "lucide-react";

interface StatsData {
  burnWalletBalance: number;
  totalBurned: number;
  totalBurns: number;
  activeHolders: number;
  network: string;
}

export default function Stats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/burn-stats');
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

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    
    // For token amounts, we need to convert from smallest units to display units
    // Get token decimals from environment variable (default to 6)
    const tokenDecimals = parseInt(process.env.TOKEN_DECIMALS || '6');
    const displayAmount = num / Math.pow(10, tokenDecimals);
    
    if (displayAmount >= 1000000) {
      return (displayAmount / 1000000).toFixed(1) + 'M';
    } else if (displayAmount >= 1000) {
      return (displayAmount / 1000).toFixed(1) + 'K';
    }
    return displayAmount.toLocaleString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="pump-card rounded-xl p-6 col-span-full text-center">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="pump-card rounded-xl p-6">
        <div className="flex items-center space-x-4 p-4">
          <Users className="w-10 h-10 text-red-400" />
          <div>
            <div className="text-2xl font-bold text-red-400">
              {data?.activeHolders ? data.activeHolders.toLocaleString() : '0'}
            </div>
            <div className="text-sm text-gray-400">Active Holders</div>
          </div>
        </div>
      </div>

      <div className="pump-card rounded-xl p-6">
        <div className="flex items-center space-x-4 p-4">
          <Coins className="w-10 h-10 text-red-400" />
          <div>
            <div className="text-2xl font-bold text-red-400">
              {formatNumber(data?.totalBurned)}
            </div>
            <div className="text-sm text-gray-400">Total Tokens Burned</div>
          </div>
        </div>
      </div>

      <div className="pump-card rounded-xl p-6">
        <div className="flex items-center space-x-4 p-4">
          <Flame className="w-10 h-10 text-red-400" />
          <div>
            <div className="text-2xl font-bold text-red-400">
              {data?.totalBurns ? data.totalBurns.toString() : '0'}
            </div>
            <div className="text-sm text-gray-400">Total Burns</div>
          </div>
        </div>
      </div>
    </div>
  );
}
