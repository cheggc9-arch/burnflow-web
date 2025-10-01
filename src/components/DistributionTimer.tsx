'use client';

import { useState, useEffect } from 'react';

export default function DistributionTimer() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Reset to 20 minutes when countdown reaches 0
          return 20 * 60;
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
    return ((20 * 60 - timeLeft) / (20 * 60)) * 100;
  };

  return (
    <div className="pump-card rounded-xl p-6 animate-pulse-green">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">Next Distribution</h3>
      </div>
      <div className="text-center">
        <div className="grid grid-cols-3 gap-0 max-w-xs mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold pump-gradient-text mb-0">
              {hours.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 uppercase">
              HOURS
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold pump-gradient-text mb-0">
              {minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 uppercase">
              MINUTES
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold pump-gradient-text mb-0">
              {seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 uppercase">
              SECONDS
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="w-100 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[var(--pump-green)] to-[var(--pump-blue)] h-2 rounded-full transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
        <div className="text-sm text-gray-400 mt-4">
          Until next reward distribution
        </div>
      </div>
    </div>
  );
}