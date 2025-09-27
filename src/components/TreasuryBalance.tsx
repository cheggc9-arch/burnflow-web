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
                Available in creator wallet • Next distribution every 20 minutes
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
              Available in creator wallet • Next distribution every 20 minutes
            </p>
            <p className="text-[var(--pump-green)] text-xs font-medium">
              ~{data?.distributionAmount.toFixed(4) || '0.0000'} SOL will be distributed (95% of treasury)
            </p>
            <p className="text-gray-500 text-xs">
              Network: {data?.network || 'unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
