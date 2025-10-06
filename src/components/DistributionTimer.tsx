'use client';

import { useState, useEffect } from 'react';
import { formatUTCTime } from '@/utils/timezone';

interface DistributionData {
  timeRemainingSeconds: number;
  nextDistributionTime: number;
  lastDistributionTime: number;
  distributionInterval: number;
  isDistributionTime: boolean;
  lastUpdated: number;
}

export default function DistributionTimer() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [data, setData] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch distribution data from server
  const fetchDistributionData = async () => {
    try {
      const response = await fetch('/api/next-distribution');
      const result = await response.json();
      
      if (result.success) {
        const newData = result.data;
        const oldLastDistributionTime = data?.lastDistributionTime;
        
        setData(newData);
        setTimeLeft(newData.timeRemainingSeconds);
        setError(null);
        
        // Check if a distribution was just triggered
        if (newData.distributionJustTriggered) {
          console.log('🔄 Distribution was just triggered, dispatching event...');
          window.dispatchEvent(new CustomEvent('distributionCompleted', {
            detail: { success: true, data: { timestamp: new Date().toISOString() } }
          }));
        }
      } else {
        setError(result.error || 'Failed to fetch distribution data');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching distribution data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDistributionData();
    
    // Refresh every 10 seconds to stay synchronized
    const interval = setInterval(fetchDistributionData, 10 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Local countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // When countdown reaches 0, fetch fresh data from server
          fetchDistributionData();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  
  const getProgressPercentage = () => {
    if (!data) return 0;
    const totalInterval = data.distributionInterval / 1000; // Convert to seconds
    return ((totalInterval - timeLeft) / totalInterval) * 100;
  };

  if (loading) {
    return (
      <div className="pump-card rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold pump-gradient-text">Next Distribution</h3>
        </div>
        <div className="text-center">
          <div className="text-2xl text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pump-card rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold pump-gradient-text">Next Distribution</h3>
        </div>
        <div className="text-center">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pump-card rounded-xl p-6 animate-pulse-green">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">Next Distribution</h3>
        {data?.isDistributionTime && (
          <div className="text-sm text-[var(--pump-green)] font-semibold">
            🎉 Distribution in progress!
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="grid grid-cols-3 gap-0 max-w-xs mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold pump-gradient-text mb-0">
              {hours.toString().padStart(2, '0')}
            </div>
            <div className="text-lg font-semibold text-gray-300 uppercase">
              HOURS
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold pump-gradient-text mb-0">
              {minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-lg font-semibold text-gray-300 uppercase">
              MINUTES
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold pump-gradient-text mb-0">
              {seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-lg font-semibold text-gray-300 uppercase">
              SECONDS
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="w-80 bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-300 mt-4">
          {data?.isDistributionTime ? 'Distribution in progress...' : 'Until next reward distribution'}
        </div>
        {data && (
          <div className="text-sm text-gray-400 mt-4">
            Last distribution: {formatUTCTime(data.lastDistributionTime)}
          </div>
        )}
      </div>
    </div>
  );
}