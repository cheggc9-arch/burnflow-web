import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, isCacheStale } from '@/utils/cache';
import { getConnection } from '@/utils/solana';

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
        totalDistributed: 0, // TODO: Implement from database
        totalRounds: 0, // TODO: Implement from database
        totalUniqueRecipients: 0, // TODO: Implement from database
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
