'use client';

import { useState, useEffect } from 'react';

interface TimerData {
  timeRemainingSeconds: number;
  isAutomaticMode: boolean;
  intervalMinutes: number;
  isDistributionTime: boolean;
}

export default function DistributionTimer() {
  const [timerData, setTimerData] = useState<TimerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimerData = async () => {
      try {
        const response = await fetch('/api/next-distribution');
        const result = await response.json();
        
        if (result.success) {
          setTimerData(result.data);
        }
      } catch (error) {
        console.error('Error fetching timer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimerData();
    
    // Refresh timer data every 30 seconds
    const interval = setInterval(fetchTimerData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="pump-card rounded-xl p-6">
        <div className="text-center py-8 text-gray-400">Loading timer...</div>
      </div>
    );
  }

  if (!timerData) {
    return (
      <div className="pump-card rounded-xl p-6">
        <div className="text-center py-8 text-red-400">Error loading timer data</div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="pump-card rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">Distribution Status</h3>
        <div className={`text-sm font-semibold mt-2 ${
          timerData.isAutomaticMode ? 'text-green-400' : 'text-yellow-400'
        }`}>
          {timerData.isAutomaticMode ? '🚀 AUTOMATIC MODE' : '🧪 MANUAL MODE'}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Interval: {timerData.intervalMinutes} minutes
        </div>
      </div>
      
      <div className="text-center">
        {timerData.isAutomaticMode ? (
          <>
            <div className="text-6xl mb-4">⏰</div>
            <div className="text-2xl font-bold text-gray-300 mb-2">
              {timerData.isDistributionTime ? 'Distribution Time!' : 'Next Distribution'}
            </div>
            <div className="text-lg text-gray-400 mb-4">
              {timerData.isDistributionTime 
                ? 'Automatic distribution is running...' 
                : `In ${formatTime(timerData.timeRemainingSeconds)}`
              }
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto">
              <div className="text-green-400 font-semibold text-sm mb-2">
                Automatic Distribution Active
              </div>
              <div className="text-gray-300 text-sm">
                Distributions run automatically every {timerData.intervalMinutes} minutes.
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">⏸️</div>
            <div className="text-2xl font-bold text-gray-300 mb-2">
              Timer Disabled
            </div>
            <div className="text-lg text-gray-400 mb-4">
              Automatic distributions are disabled for testing
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 max-w-md mx-auto">
              <div className="text-yellow-400 font-semibold text-sm mb-2">
                Manual Distribution Available
              </div>
              <div className="text-gray-300 text-sm">
                Use the "Trigger Distribution Now" button below to manually test the distribution system.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}