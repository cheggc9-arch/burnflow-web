import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, isCacheStale } from '@/utils/cache';
import { getConnection } from '@/utils/solana';
import { getAllDistributions } from '@/utils/database';

export async function GET(request: NextRequest) {
  try {
    const connection = getConnection();
    const cache = getCachedData();
    
    // Check if cache is stale or empty
    if (isCacheStale() || cache.lastUpdated === 0) {
      // Cache is stale but serving cached data to avoid RPC calls
    }
    
    // Use cache data or fallback to 0
    const treasuryBalance = cache.treasuryBalance || 0;
    const activeHolders = cache.activeHolders || 0;
    
    // Get distribution history for stats
    const distributions = getAllDistributions();
    const totalDistributed = distributions.reduce((sum, dist) => sum + dist.totalDistributed, 0);
    const totalRounds = distributions.length;
    
    // Calculate distribution amounts
    const distributionAmount = treasuryBalance * 0.95;
    const keepAmount = treasuryBalance * 0.05;
    
    const response = {
      success: true,
      data: {
        treasuryBalance,
        distributionAmount,
        keepAmount,
        activeHolders,
        totalDistributed,
        totalRounds,
        network: connection.rpcEndpoint.includes('devnet') ? 'devnet' : 'mainnet',
        lastUpdated: cache.lastUpdated,
        isUpdating: cache.isUpdating,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
