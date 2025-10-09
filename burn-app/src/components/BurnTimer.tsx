'use client';

import { useState, useEffect } from 'react';

export default function BurnTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [burnInterval, setBurnInterval] = useState(60 * 60); // Default 60 minutes
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Buying and burning tokens...');

  useEffect(() => {
    // Fetch global timer state from API
    const fetchTimerState = async () => {
      try {
        const response = await fetch('/api/burn-status');
        const result = await response.json();
        
        if (result.success && result.data) {
          const { intervalMinutes, timeRemaining, isProcessing } = result.data;
          const intervalSeconds = intervalMinutes * 60;
          
          setBurnInterval(intervalSeconds);
          setTimeLeft(timeRemaining);
          setIsRunning(true);
          setIsProcessing(isProcessing || false);
          
          console.log(`🕐 Global timer loaded: ${timeRemaining} seconds remaining, processing: ${isProcessing}`);
        } else {
          console.warn('⚠️ Could not fetch timer state, using default');
          setTimeLeft(burnInterval);
          setIsRunning(true);
        }
      } catch (error) {
        console.error('❌ Error fetching timer state:', error);
        setTimeLeft(burnInterval);
        setIsRunning(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTimerState();
  }, []);

  useEffect(() => {
    if (!isRunning || loading) return;

    // Update timer every second by fetching from server
    const timer = setInterval(async () => {
      try {
        const response = await fetch('/api/burn-status');
        const result = await response.json();
        
        if (result.success && result.data.timeRemaining !== undefined) {
          setTimeLeft(result.data.timeRemaining);
          setIsProcessing(result.data.isProcessing || false);
          
          // If timer reached zero, it will be reset by the server
          if (result.data.timeRemaining === 0) {
            console.log('🔥 Timer reached zero - burn cycle should trigger');
          }
        }
        
        // If processing, fetch burn result to show appropriate message
        if (result.data?.isProcessing) {
          try {
            const burnResultResponse = await fetch('/api/burn-result');
            const burnResult = await burnResultResponse.json();
            
            if (burnResult.success && burnResult.data.lastBurnResult) {
              const { status, message } = burnResult.data.lastBurnResult;
              
              // Only show specific messages for insufficient SOL or completed operations
              if (status === 'insufficient_sol') {
                setProcessingMessage('Insufficient SOL balance - skipping burn cycle');
              } else if (status === 'success' || status === 'completed') {
                setProcessingMessage('Burn completed successfully!');
              } else if (status === 'failed') {
                setProcessingMessage('Burn operation failed - check logs');
              } else if (status === 'processing') {
                setProcessingMessage('Starting burn operation...');
              } else {
                // For ongoing operations (like when balance is sufficient), show default processing
                setProcessingMessage('Buying and burning tokens...');
              }
            } else {
              // No burn result yet, show default processing message
              setProcessingMessage('Buying and burning tokens...');
            }
          } catch (error) {
            console.error('❌ Error fetching burn result:', error);
            setProcessingMessage('Buying and burning tokens...');
          }
        } else {
          // Not processing, reset to default message
          setProcessingMessage('Buying and burning tokens...');
        }
      } catch (error) {
        console.error('❌ Error updating timer:', error);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, loading]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((burnInterval - timeLeft) / burnInterval) * 100;
  };

  return (
    <div className="pump-card rounded-xl p-6 text-center">
      <div className="py-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">
            {isProcessing ? 'PROCESSING BURN...' : 'NEXT BURN IN'}
          </h3>
          
          {isProcessing ? (
            <div className="space-y-4">
              {processingMessage.includes('Insufficient') ? (
                <div className="text-3xl md:text-4xl font-bold text-red-400 text-center">
                  {processingMessage}
                </div>
              ) : (
                <div className="text-4xl md:text-5xl font-bold burn-gradient-text flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mr-4"></div>
                  PROCESSING
                </div>
              )}
              <div className="space-y-2">
                <div className="w-1/2 mx-auto bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-400 text-sm">
                  {processingMessage.includes('Insufficient') ? 'Timer will restart automatically' : processingMessage}
                </p>
                {!processingMessage.includes('Insufficient') && (
                  <p className="text-red-400 text-xs font-medium">
                    Please wait while the burn operation completes
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-bold burn-gradient-text">
                {formatTime(timeLeft)}
              </div>
              <div className="space-y-2">
                <div className="w-1/2 mx-auto bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm">
                  Burn wallet will automatically buy and burn tokens if burn wallet balance is greater than 0.13 SOL
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}