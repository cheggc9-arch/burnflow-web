'use client';

import { useState, useEffect } from 'react';
import { Trophy, Clock, Star } from "lucide-react";

interface Holder {
  address: string;
  balance: number;
  firstHoldTime: string;
  lastUpdated: string;
  rank: number;
  timeWeight: number;
  balanceWeight: number;
  totalWeight: number;
  weightage: number;
  daysHeld: number;
  category: string;
}

export default function HolderLeaderboard() {
  const [holderData, setHolderData] = useState<{
    topHolders: Holder[];
    earlyAdopters: Holder[];
    highestWeight: Holder[];
  }>({
    topHolders: [],
    earlyAdopters: [],
    highestWeight: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'weight' | 'early' | 'balance'>('weight');

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const response = await fetch('/api/holders');
        const result = await response.json();
        
        if (result.success) {
          // Process the hashmap data to create the three sections
          const allHolders = result.data.allHolders || [];
          
          // 1. Top Holders - Sorted by balance (highest first)
          const topHolders = [...allHolders]
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 20)
            .map((holder, index) => ({
              ...holder,
              rank: index + 1,
              category: 'Top Holder'
            }));

          // 2. Early Adopters - Sorted by first hold time (earliest first)
          const earlyAdopters = [...allHolders]
            .filter(holder => holder.firstHoldTime)
            .sort((a, b) => new Date(a.firstHoldTime).getTime() - new Date(b.firstHoldTime).getTime())
            .slice(0, 20)
            .map((holder, index) => ({
              ...holder,
              rank: index + 1,
              category: 'Early Adopter'
            }));

          // 3. Highest Weight - Sorted by weightage (highest first)
          const highestWeight = [...allHolders]
            .sort((a, b) => (b.weightage || 0) - (a.weightage || 0))
            .slice(0, 20)
            .map((holder, index) => ({
              ...holder,
              rank: index + 1,
              category: 'Highest Weight'
            }));

          setHolderData({
            topHolders,
            earlyAdopters,
            highestWeight
          });
        } else {
          setError(result.error || 'Failed to fetch holders');
        }
      } catch (err) {
        setError('Network error');
        console.error('Error fetching holders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
    
    // Refresh every 10 seconds to catch cache updates quickly
    const interval = setInterval(fetchHolders, 10 * 1000);
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

  const formatTimeAgo = (date: string | undefined) => {
    if (!date) return 'Unknown';
    
    const dateObj = new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Unknown';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  const getCurrentHolders = () => {
    switch (activeTab) {
      case 'weight':
        return holderData.highestWeight;
      case 'early':
        return holderData.earlyAdopters;
      case 'balance':
        return holderData.topHolders;
      default:
        return holderData.highestWeight;
    }
  };

  if (loading) {
    return (
      <div className="pump-card rounded-xl p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold pump-gradient-text">Holder Leaderboard</h3>
            <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
              Updated every 5min
            </div>
          </div>
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all bg-gray-700 text-white cursor-pointer">
              <Star className="w-4 h-4 text-purple-400" />
              <span>Highest Weight</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-gray-700/50 cursor-pointer">
              <Clock className="w-4 h-4" />
              <span>Early Adopters</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-gray-700/50 cursor-pointer">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Top Holders</span>
            </button>
          </div>
        </div>
        <div className="text-center py-8 text-gray-400">Loading holders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pump-card rounded-xl p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold pump-gradient-text">Holder Leaderboard</h3>
            <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
              Updated every 5min
            </div>
          </div>
        </div>
        <div className="text-center py-8 text-red-400">Error: {error}</div>
      </div>
    );
  }

  const currentHolders = getCurrentHolders();

  return (
    <div id="leaderboard" className="pump-card rounded-xl p-6 scroll-mt-32">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold pump-gradient-text">Holder Leaderboard</h3>
          <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
            Updated every 5min
          </div>
        </div>
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('weight')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'weight' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Star className="w-4 h-4 text-purple-400" />
            <span>Highest Weight</span>
          </button>
          <button 
            onClick={() => setActiveTab('early')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'early' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Early Adopters</span>
          </button>
          <button 
            onClick={() => setActiveTab('balance')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'balance' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Top Holders</span>
          </button>
        </div>
      </div>
      
      {currentHolders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No holders found</div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-400 pb-2 border-b border-gray-700">
            <div>Rank</div>
            <div>Address</div>
            <div>
              {activeTab === 'weight' && 'Total Weight'}
              {activeTab === 'early' && 'First Hold'}
              {activeTab === 'balance' && 'Balance'}
            </div>
            <div>
              {activeTab === 'weight' && 'Balance'}
              {activeTab === 'early' && 'Balance'}
              {activeTab === 'balance' && 'Hold Time'}
            </div>
          </div>
          
          {currentHolders.map((holder, index) => (
            <div 
              key={holder.address}
              className={`grid grid-cols-4 gap-4 py-3 px-2 rounded-lg transition-colors hover:bg-gray-800/30 ${
                index < 3 ? 'bg-gradient-to-r from-yellow-900/10 to-transparent' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${
                  index === 0 ? 'text-yellow-400' : 
                  index === 1 ? 'text-gray-300' : 
                  index === 2 ? 'text-orange-400' : 'text-gray-500'
                }`}>
                  #{index + 1}
                </span>
                {index < 3 && <Trophy className="w-3 h-3 text-yellow-400" />}
              </div>
              
              <div className="font-mono text-sm">
                <a 
                  href={`https://solscan.io/account/${holder.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--pump-blue)] hover:text-[var(--pump-green)] transition-colors underline"
                >
                  {holder.address.slice(0, 4)}...{holder.address.slice(-4)}
                </a>
              </div>
              
              <div className="text-sm font-medium">
                {activeTab === 'weight' && (holder.weightage || 0).toFixed(2)}
                {activeTab === 'early' && holder.firstHoldTime && formatTimeAgo(holder.firstHoldTime)}
                {activeTab === 'balance' && formatNumber(holder.balance)}
              </div>
              
              <div className="text-sm text-gray-400">
                {activeTab === 'weight' && formatNumber(holder.balance)}
                {activeTab === 'early' && formatNumber(holder.balance)}
                {activeTab === 'balance' && holder.firstHoldTime && formatTimeAgo(holder.firstHoldTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}