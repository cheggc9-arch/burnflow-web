import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, isCacheStale } from '@/utils/cache';
import { getConnection } from '@/utils/solana';

export async function GET(request: NextRequest) {
  try {
    const connection = getConnection();
    const cache = getCachedData();
    
    // Check if cache is stale
    if (isCacheStale()) {
      // Cache is stale but serving cached data to avoid RPC calls
    }
    
    // Calculate distribution amounts
    const distributionAmount = cache.treasuryBalance * 0.95; // 95% for distribution
    const keepAmount = cache.treasuryBalance * 0.05; // 5% for fees
    
    return NextResponse.json({
      success: true,
      data: {
        treasuryBalance: cache.treasuryBalance,
        distributionAmount,
        keepAmount,
        network: connection.rpcEndpoint.includes('devnet') ? 'devnet' : 'mainnet',
        lastUpdated: cache.lastUpdated,
        isUpdating: cache.isUpdating,
      },
    });
  } catch (error) {
    console.error('Error fetching treasury balance:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
