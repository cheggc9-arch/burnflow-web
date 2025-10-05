'use client';

import { useState } from 'react';

interface DistributionResult {
  success: boolean;
  message: string;
  data?: {
    totalDistributed: number;
    recipientsCount: number;
    transactionsCount: number;
    failedTransactions: number;
  };
  errors?: string[];
  timestamp: string;
}

export default function DistributionTrigger() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DistributionResult | null>(null);

  const triggerDistribution = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/trigger-distribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pump-card rounded-xl p-6">
      <h3 className="text-xl font-bold pump-gradient-text mb-4">Manual Distribution Trigger</h3>
      
      <div className="space-y-4">
        <button
          onClick={triggerDistribution}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Running Distribution...' : 'Trigger Distribution Now'}
        </button>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.success 
              ? 'bg-green-900/20 border border-green-500/30' 
              : 'bg-red-900/20 border border-red-500/30'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-lg font-semibold ${
                result.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {result.success ? '✅ Success' : '❌ Failed'}
              </span>
              <span className="text-gray-400 text-sm ml-auto">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <p className="text-gray-300 mb-2">{result.message}</p>
            
            {result.data && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Distributed:</span>
                  <span className="text-white ml-2">{result.data.totalDistributed.toFixed(4)} SOL</span>
                </div>
                <div>
                  <span className="text-gray-400">Recipients:</span>
                  <span className="text-white ml-2">{result.data.recipientsCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Transactions:</span>
                  <span className="text-white ml-2">{result.data.transactionsCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Failed:</span>
                  <span className="text-white ml-2">{result.data.failedTransactions}</span>
                </div>
              </div>
            )}
            
            {result.errors && result.errors.length > 0 && (
              <div className="mt-3">
                <p className="text-red-400 text-sm font-semibold mb-1">Errors:</p>
                <ul className="text-red-300 text-sm space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

