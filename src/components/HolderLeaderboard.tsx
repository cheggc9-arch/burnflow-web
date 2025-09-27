'use client';

import { useState, useEffect } from 'react';
import { Trophy, Clock, Diamond } from "lucide-react";

interface Holder {
  address: string;
  balance: number;
  firstHoldTime?: string;
  lastUpdated?: string;
  rank: number;
  timeWeight: number;
  balanceWeight: number;
  totalWeight: number;
}

export default function HolderLeaderboard() {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'balance' | 'early' | 'duration'>('balance');

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const response = await fetch('/api/holders');
        const result = await response.json();
        
        if (result.success) {
          setHolders(result.data);
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

  const getSortedHolders = () => {
    const sorted = [...holders];
    
    switch (activeTab) {
      case 'balance':
        return sorted.sort((a, b) => b.balance - a.balance);
      case 'early':
        return sorted.sort((a, b) => {
          if (!a.firstHoldTime || !b.firstHoldTime) return 0;
          return a.firstHoldTime.getTime() - b.firstHoldTime.getTime();
        });
      case 'duration':
        return sorted.sort((a, b) => b.totalWeight - a.totalWeight);
      default:
        return sorted;
    }
  };

  if (loading) {
    return (
      <div className="pump-card rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold pump-gradient-text">Holder Leaderboard</h3>
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all bg-gray-700 text-white">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Top Holders</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-gray-700/50">
              <Clock className="w-4 h-4" />
              <span>Early Adopters</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-gray-700/50">
              <Diamond className="w-4 h-4" />
              <span>Diamond Hands</span>
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
          <h3 className="text-xl font-bold pump-gradient-text">Holder Leaderboard</h3>
        </div>
        <div className="text-center py-8 text-red-400">Error: {error}</div>
      </div>
    );
  }

  const sortedHolders = getSortedHolders().slice(0, 20);

  return (
    <div className="pump-card rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">Holder Leaderboard</h3>
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('balance')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'balance' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Top Holders</span>
          </button>
          <button 
            onClick={() => setActiveTab('early')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'early' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Early Adopters</span>
          </button>
          <button 
            onClick={() => setActiveTab('duration')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'duration' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Diamond className="w-4 h-4" />
            <span>Diamond Hands</span>
          </button>
        </div>
      </div>
      
      {sortedHolders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No holders found</div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-400 pb-2 border-b border-gray-700">
            <div>Rank</div>
            <div>Address</div>
            <div>
              {activeTab === 'balance' && 'Balance'}
              {activeTab === 'early' && 'First Hold'}
              {activeTab === 'duration' && 'Hold Duration'}
            </div>
            <div>
              {activeTab === 'balance' && 'Hold Time'}
              {activeTab === 'early' && 'Balance'}
              {activeTab === 'duration' && 'Balance'}
            </div>
          </div>
          
          {sortedHolders.map((holder, index) => (
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
                {activeTab === 'balance' && formatNumber(holder.balance)}
                {activeTab === 'early' && holder.firstHoldTime && formatTimeAgo(holder.firstHoldTime)}
                {activeTab === 'duration' && holder.firstHoldTime && formatTimeAgo(holder.firstHoldTime)}
              </div>
              
              <div className="text-sm text-gray-400">
                {activeTab === 'balance' && holder.firstHoldTime && formatTimeAgo(holder.firstHoldTime)}
                {activeTab === 'early' && formatNumber(holder.balance)}
                {activeTab === 'duration' && formatNumber(holder.balance)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}