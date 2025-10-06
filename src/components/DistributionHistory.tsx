'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Users, Coins, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatUTCTime } from '@/utils/timezone';

interface DistributionTransaction {
  recipient: string;
  amount: number;
  signature: string;
  weightage: number;
}

interface DistributionRecord {
  id: number;
  timestamp: string;
  totalDistributed: number;
  recipientsCount: number;
  transactionsCount: number;
  failedTransactions: number;
  transactions: DistributionTransaction[];
  treasuryBalance: number;
  status: 'success' | 'failed' | 'partial';
}

export default function DistributionHistory() {
  const [distributions, setDistributions] = useState<DistributionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDistributions, setExpandedDistributions] = useState<Set<number>>(new Set());

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/distribution-history?all=true');
      const result = await response.json();
      
      if (result.success) {
        setDistributions(result.data.distributions);
      } else {
        setError(result.error || 'Failed to fetch distribution history');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching distribution history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Listen for distribution completion events
  useEffect(() => {
    const handleDistributionComplete = (event: any) => {
      console.log('🔄 Distribution completed, refreshing history...');
      fetchHistory();
    };

    // Listen for custom events from distribution trigger
    window.addEventListener('distributionCompleted', handleDistributionComplete);
    
    return () => {
      window.removeEventListener('distributionCompleted', handleDistributionComplete);
    };
  }, []);


  const toggleExpanded = (distributionId: number) => {
    const newExpanded = new Set(expandedDistributions);
    if (newExpanded.has(distributionId)) {
      newExpanded.delete(distributionId);
    } else {
      newExpanded.add(distributionId);
    }
    setExpandedDistributions(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'threshold_not_met':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'partial':
        return 'text-yellow-400';
      case 'threshold_not_met':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return formatUTCTime(timestamp);
  };

  const openSolscan = (signature: string) => {
    window.open(`https://solscan.io/tx/${signature}`, '_blank');
  };

  if (loading) {
    return (
      <div className="pump-card rounded-xl p-6">
        <h3 className="text-xl font-bold pump-gradient-text mb-4">Distribution History</h3>
        <div className="text-center py-8 text-gray-400">Loading distribution history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pump-card rounded-xl p-6">
        <h3 className="text-xl font-bold pump-gradient-text mb-4">Distribution History</h3>
        <div className="text-center py-8 text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (distributions.length === 0) {
    return (
      <div className="pump-card rounded-xl p-6">
        <h3 className="text-xl font-bold pump-gradient-text mb-4">Distribution History</h3>
        <div className="text-center py-8 text-gray-400">
          <p>No distributions yet</p>
          <p className="text-sm text-gray-500 mt-2">Distributions will appear here once they start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pump-card rounded-xl p-6">
      <div className="mb-6">
        <div>
          <h3 className="text-xl font-bold pump-gradient-text">Distribution History</h3>
          <p className="text-gray-400 text-sm mt-2">
            Complete transaction history with blockchain verification ({distributions.length} distributions)
          </p>
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {distributions.map((distribution) => (
          <div key={distribution.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30">
            {/* Distribution Header */}
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpanded(distribution.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(distribution.status)}
                  <span className="font-bold text-lg">Distribution #{distribution.id}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {formatTime(distribution.timestamp)}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    {distribution.totalDistributed.toFixed(4)} SOL
                  </div>
                  <div className="text-xs text-gray-400">
                    {distribution.recipientsCount} recipients
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {expandedDistributions.has(distribution.id) ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Transaction Details */}
            {expandedDistributions.has(distribution.id) && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                {distribution.status === 'threshold_not_met' ? (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-orange-400 mb-2">Threshold Not Met</h4>
                    <p className="text-sm text-gray-400">
                      Treasury balance was below the minimum threshold of 0.004 SOL required for distribution.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Balance at time: {distribution.treasuryBalance.toFixed(6)} SOL
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Transaction Details</h4>
                  {distribution.transactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-900/50 rounded p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-mono text-gray-300">
                            {tx.recipient.slice(0, 8)}...{tx.recipient.slice(-8)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Weight: {tx.weightage.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-400">
                            {tx.amount.toFixed(6)} SOL
                          </div>
                          <div className="text-xs text-gray-400">
                            {tx.signature ? 'Completed' : 'Pending'}
                          </div>
                        </div>
                        
                        {tx.signature && (
                          <button
                            onClick={() => openSolscan(tx.signature)}
                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-xs">View</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      {distributions.length > 8 && (
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 bg-gray-800/30 px-3 py-1 rounded-full inline-block">
            Scroll to see all {distributions.length} distributions
          </div>
        </div>
      )}

      {/* Footer Message */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="text-center text-sm text-gray-400">
          All transactions are verifiable on Solscan. Click "View" to see transaction details on blockchain.
        </div>
      </div>
    </div>
  );
}