import { NextRequest, NextResponse } from 'next/server';
import { getCachedData } from '@/utils/cache';
import { DistributionService } from '@/utils/distribution-service';

export async function GET(request: NextRequest) {
  try {
    const cache = getCachedData();
    
    // Distribution interval: 20 minutes (in milliseconds)
    const DISTRIBUTION_INTERVAL = 20 * 60 * 1000;
    
    // Get the last distribution time from cache or use current time as fallback
    const lastDistributionTime = cache.lastDistributionTime || Date.now();
    
    // Calculate next distribution time
    const nextDistributionTime = lastDistributionTime + DISTRIBUTION_INTERVAL;
    
    // Calculate time remaining until next distribution
    const now = Date.now();
    const timeRemaining = Math.max(0, nextDistributionTime - now);
    
    // DISABLED FOR TESTING: Automatic distribution is disabled
    let actualNextDistribution = nextDistributionTime;
    if (timeRemaining <= 0) {
      console.log('🧪 TESTING MODE: Automatic distribution is disabled');
      console.log('   Use manual trigger for testing distributions');
      
      // Calculate how many distribution cycles have passed but don't trigger
      const cyclesPassed = Math.floor((now - lastDistributionTime) / DISTRIBUTION_INTERVAL) + 1;
      actualNextDistribution = lastDistributionTime + (cyclesPassed * DISTRIBUTION_INTERVAL);
    }
    
    const actualTimeRemaining = Math.max(0, actualNextDistribution - now);
    
    // Convert to seconds for easier frontend handling
    const timeRemainingSeconds = Math.floor(actualTimeRemaining / 1000);
    
    return NextResponse.json({
      success: true,
      data: {
        timeRemainingSeconds,
        nextDistributionTime: actualNextDistribution,
        lastDistributionTime,
        distributionInterval: DISTRIBUTION_INTERVAL,
        isDistributionTime: timeRemainingSeconds <= 0,
        lastUpdated: cache.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Error fetching next distribution time:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
