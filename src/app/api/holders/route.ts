import { NextRequest, NextResponse } from 'next/server';
import { getHolderCachedData, isHolderCacheStale } from '@/utils/cache';

export async function GET(request: NextRequest) {
  try {
    const cache = getHolderCachedData();
    
    // Check if cache is stale
    if (isHolderCacheStale()) {
      // Holder cache is stale but serving cached data to avoid RPC calls
    }
    
    return NextResponse.json({
      success: true,
      data: {
        topHolders: cache.holders.topHolders,
        earlyAdopters: cache.holders.earlyAdopters,
        diamondHands: cache.holders.diamondHands,
        allHolders: cache.holders.allHolders
      },
      totalHolders: cache.totalHolders,
      lastUpdated: cache.lastUpdated,
      isUpdating: cache.isUpdating,
    });
  } catch (error) {
    console.error('Error fetching holders:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
