'use client';

import { useState, useEffect } from 'react';

interface BurnRecord {
  id: string;
  timestamp: string;
  solAmount: number;
  tokensBurned: number;
  buySignature?: string;
  burnSignature?: string;
  status: 'success' | 'failed';
}

export default function BurnHistory() {
  const [burns, setBurns] = useState<BurnRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastBurnCount, setLastBurnCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const fetchBurnHistory = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      }
      
      const response = await fetch('/api/burn-history');
      const result = await response.json();
      
      if (result.success) {
        const newBurns = result.data.burns;
        setBurns(newBurns);
        setError(null);
        
        // Check if new burns were added
        if (newBurns.length > lastBurnCount && lastBurnCount > 0) {
          console.log(`🆕 New burn detected! Total burns: ${newBurns.length}`);
        }
        setLastBurnCount(newBurns.length);
      } else {
        setError(result.error || 'Failed to fetch burn history');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching burn history:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBurnHistory();
    
    // Refresh every 5 seconds for faster updates
    const interval = setInterval(() => fetchBurnHistory(), 5 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatNumber = (num: number) => {
    // For token amounts, we need to convert from smallest units to display units
    // Get token decimals from environment variable (default to 6)
    const tokenDecimals = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '6');
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
      <div className="pump-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">BURN HISTORY</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pump-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">BURN HISTORY</h3>
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="pump-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-300">BURN HISTORY</h3>
          {burns.length > 0 && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
              {burns.length}
            </span>
          )}
        </div>
        <button
          onClick={() => fetchBurnHistory(true)}
          disabled={refreshing}
          className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
        >
          {refreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>
      <div className="space-y-3 max-h-[600px] overflow-y-auto burn-history-scroll">
        {burns.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            No burns recorded yet
          </div>
        ) : (
          (showAll ? burns : burns.slice(0, 10)).map((burn) => (
            <div key={burn.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {formatDate(burn.timestamp)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    burn.status === 'success' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {burn.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  Burned {formatNumber(burn.tokensBurned)} tokens
                </div>
              </div>
              <div className="flex items-center space-x-3 ml-4">
                {burn.buySignature && (
                  <a
                    href={`https://solscan.io/tx/${burn.buySignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                  >
                    💸 Buy TX: {burn.buySignature.substring(0, 8)}...
                  </a>
                )}
                {burn.burnSignature && (
                  <a
                    href={`https://solscan.io/tx/${burn.burnSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 transition-colors whitespace-nowrap"
                  >
                    🔥 Burn TX: {burn.burnSignature.substring(0, 8)}...
                  </a>
                )}
              </div>
            </div>
          ))
        )}
        
        {burns.length > 10 && (
          <div className="text-center pt-4 border-t border-gray-600">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
            >
              {showAll ? 'Show Less' : `Show All (${burns.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}