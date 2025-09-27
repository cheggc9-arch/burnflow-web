'use client';

import { useState, useEffect } from 'react';

interface ConnectionTest {
  success: boolean;
  network: string;
  slot: number;
  blockHeight: number;
  error?: string;
}

export default function TestPage() {
  const [connectionTest, setConnectionTest] = useState<ConnectionTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/test-connection');
        const result = await response.json();
        setConnectionTest(result.data);
      } catch (error) {
        console.error('Connection test failed:', error);
        setConnectionTest({
          success: false,
          network: 'unknown',
          slot: 0,
          blockHeight: 0,
          error: 'Failed to connect'
        });
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Solana Connection Test</h1>
          <div className="pump-card rounded-xl p-6">
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--pump-green)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Testing connection...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Solana Connection Test</h1>
        
        <div className="pump-card rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Connection Status</h2>
          <div className={`p-4 rounded-lg ${connectionTest?.success ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${connectionTest?.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="font-semibold">
                {connectionTest?.success ? 'Connected' : 'Failed'}
              </span>
            </div>
            {connectionTest?.error && (
              <p className="text-red-400 text-sm mt-2">Error: {connectionTest.error}</p>
            )}
          </div>
        </div>

        {connectionTest?.success && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pump-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Network</h3>
              <p className="text-2xl font-bold text-[var(--pump-green)]">
                {connectionTest.network}
              </p>
            </div>
            
            <div className="pump-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Current Slot</h3>
              <p className="text-2xl font-bold text-[var(--pump-blue)]">
                {connectionTest.slot.toLocaleString()}
              </p>
            </div>
            
            <div className="pump-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Block Height</h3>
              <p className="text-2xl font-bold text-[var(--pump-green)]">
                {connectionTest.blockHeight.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Set up your environment variables in <code className="bg-gray-700 px-2 py-1 rounded">.env</code></li>
            <li>Add your creator wallet private key</li>
            <li>Add your token contract address</li>
            <li>Test the treasury balance API</li>
            <li>Test the holders API</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
