'use client';

import { useState, useEffect } from 'react';
import { formatUTCTime } from '@/utils/timezone';
import { DistributionProgress } from '@/utils/distribution-progress';

interface DistributionData {
  timeRemainingSeconds: number;
  nextDistributionTime: number;
  lastDistributionTime: number;
  distributionInterval: number;
  isDistributionTime: boolean;
  isDistributionRunning: boolean;
  lastUpdated: number;
}

export default function DistributionTimer() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [data, setData] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<DistributionProgress | null>(null);

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
          // Dispatch event with a small delay to ensure distribution is complete
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('distributionCompleted', {
              detail: { success: true, data: { timestamp: new Date().toISOString() } }
            }));
          }, 1000); // 1 second delay
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

  // Fetch distribution progress
  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/distribution-progress');
      const result = await response.json();
      
      if (result.success) {
        setProgress(result.data);
      }
    } catch (err) {
      console.error('Error fetching distribution progress:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDistributionData();
    
    // Refresh every 10 seconds to stay synchronized
    const interval = setInterval(fetchDistributionData, 10 * 1000);
    
    // Listen for distribution events to update immediately
    const handleDistributionStarted = () => {
      console.log('🔄 Distribution started event received, fetching fresh data...');
      fetchDistributionData();
    };
    
    const handleDistributionCompleted = () => {
      console.log('🔄 Distribution completed event received, fetching fresh data...');
      fetchDistributionData();
    };
    
    // Listen for custom events
    window.addEventListener('distributionStarted', handleDistributionStarted);
    window.addEventListener('distributionCompleted', handleDistributionCompleted);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('distributionStarted', handleDistributionStarted);
      window.removeEventListener('distributionCompleted', handleDistributionCompleted);
    };
  }, []);

  // Poll for progress when distribution is running
  useEffect(() => {
    if (data?.isDistributionRunning) {
      // Initial progress fetch
      fetchProgress();
      
      // Poll progress every 2 seconds during distribution
      const progressInterval = setInterval(fetchProgress, 2000);
      
      return () => clearInterval(progressInterval);
    } else {
      // Clear progress when distribution stops
      setProgress(null);
    }
  }, [data?.isDistributionRunning]);

  // Local countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // When countdown reaches 0, fetch fresh data from server immediately
          console.log('⏰ Timer reached zero, fetching fresh data...');
          fetchDistributionData();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // More frequent polling when distribution might be starting
  useEffect(() => {
    if (data?.isDistributionTime && !data?.isDistributionRunning) {
      console.log('🔄 Distribution time reached, starting frequent polling...');
      const frequentInterval = setInterval(fetchDistributionData, 2000); // Poll every 2 seconds
      
      return () => clearInterval(frequentInterval);
    }
  }, [data?.isDistributionTime, data?.isDistributionRunning]);

  // Very frequent polling when timer is close to zero
  useEffect(() => {
    if (timeLeft <= 30 && timeLeft > 0 && !data?.isDistributionRunning) {
      console.log('🔄 Timer close to zero, starting very frequent polling...');
      const veryFrequentInterval = setInterval(fetchDistributionData, 1000); // Poll every 1 second
      
      return () => clearInterval(veryFrequentInterval);
    }
  }, [timeLeft, data?.isDistributionRunning]);

  // Immediate check when timer reaches zero
  useEffect(() => {
    if (timeLeft === 0 && data && !data.isDistributionRunning) {
      console.log('⏰ Timer reached zero, checking for distribution status...');
      // Immediate fetch when timer hits zero
      fetchDistributionData();
    }
  }, [timeLeft, data?.isDistributionRunning]);

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
        {data?.isDistributionRunning && (
          <div className="text-sm text-[var(--pump-green)] font-semibold">
            🎉 Distribution in progress!
          </div>
        )}
        {!data?.isDistributionRunning && timeLeft <= 10 && timeLeft > 0 && (
          <div className="text-sm text-yellow-400 font-semibold animate-pulse">
            ⚡ Distribution starting soon...
          </div>
        )}
      </div>
      <div className="text-center">
        {data?.isDistributionRunning ? (
          <div className="py-8">
            <div className="text-6xl mb-4">⏳</div>
            <div className="text-2xl font-bold pump-gradient-text mb-2">
              Processing...
            </div>
            <div className="text-lg text-gray-300 mb-4">
              Distribution in progress
            </div>
            
            {progress && progress.currentBatch && (
              <div className="bg-gray-800/50 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-sm text-gray-300 mb-2">
                  Processing batch {progress.currentBatch.batchIndex} of {progress.currentBatch.totalBatches}
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  Transaction {progress.currentBatch.currentTransaction} of {progress.currentBatch.batchSize} in current batch
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Completed:</span>
                    <span className="text-green-400">{progress.completedTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Failed:</span>
                    <span className="text-red-400">{progress.failedTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white">{progress.totalTransactions}</span>
                  </div>
                </div>
                
                {progress.estimatedCompletion && (
                  <div className="text-xs text-gray-400 mt-2">
                    Estimated completion: {new Date(progress.estimatedCompletion).toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
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
        )}
        {!data?.isDistributionRunning && (
          <div className="flex justify-center mt-4">
            <div className="w-80 bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        )}
        {data?.isDistributionRunning && (
          <div className="flex justify-center mt-4">
            <div className="w-80 bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        <div className="text-sm font-semibold text-gray-300 mt-4">
          {data?.isDistributionRunning ? 'Processing transactions...' : 'Until next reward distribution'}
        </div>
        {data?.isDistributionRunning && (
          <div className="text-xs text-gray-400 mt-2">
            Sending rewards to holders with rate limiting protection
          </div>
        )}
        {data && (
          <div className="text-sm text-gray-400 mt-4">
            Last distribution: {formatUTCTime(data.lastDistributionTime)}
          </div>
        )}
      </div>
    </div>
  );
}