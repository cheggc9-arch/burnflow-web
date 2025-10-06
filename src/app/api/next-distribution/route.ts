import { NextRequest, NextResponse } from 'next/server';
import { getCachedData } from '@/utils/cache';
import { DistributionService } from '@/utils/distribution-service';

export async function GET(request: NextRequest) {
  try {
    const cache = getCachedData();
    
    // Get distribution interval from environment variable (in minutes, default 20)
    const intervalMinutes = parseInt(process.env.DISTRIBUTION_INTERVAL_MINUTES || '20');
    const DISTRIBUTION_INTERVAL = intervalMinutes * 60 * 1000;
    
    // Check if automatic distribution is enabled
    const isAutomaticMode = process.env.ENABLE_AUTOMATIC_DISTRIBUTION === 'true';
    
    // Get the last distribution time from cache or use current time as fallback
    const lastDistributionTime = cache.lastDistributionTime || Date.now();
    
    // Calculate next distribution time
    const nextDistributionTime = lastDistributionTime + DISTRIBUTION_INTERVAL;
    
    // Calculate time remaining until next distribution
    const now = Date.now();
    const timeRemaining = Math.max(0, nextDistributionTime - now);
    
    let actualNextDistribution = nextDistributionTime;
    let shouldTriggerDistribution = false;
    
    if (timeRemaining <= 0) {
      if (isAutomaticMode) {
        // AUTOMATIC MODE: Trigger distribution
        console.log('🚀 AUTOMATIC MODE: Triggering distribution...');
        shouldTriggerDistribution = true;
        
        // Update last distribution time
        const { updateLastDistributionTime } = await import('@/utils/cache');
        updateLastDistributionTime();
        
        // Run the distribution
        try {
          const distributionService = new DistributionService();
          const result = await distributionService.distributeRewards();
          
          if (result.success) {
            console.log('✅ Automatic distribution completed successfully');
            // Dispatch event for frontend updates
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('distributionCompleted', { 
                detail: { success: true, data: result } 
              }));
            }
          } else {
            console.error('❌ Automatic distribution failed:', result.errors);
          }
        } catch (error) {
          console.error('❌ Automatic distribution error:', error);
        }
        
        // Calculate next distribution time after this one
        actualNextDistribution = now + DISTRIBUTION_INTERVAL;
      } else {
        // MANUAL MODE: Don't trigger, just show timer
        console.log('🧪 MANUAL MODE: Automatic distribution is disabled');
        console.log('   Use manual trigger for testing distributions');
        
        // Calculate how many distribution cycles have passed but don't trigger
        const cyclesPassed = Math.floor((now - lastDistributionTime) / DISTRIBUTION_INTERVAL) + 1;
        actualNextDistribution = lastDistributionTime + (cyclesPassed * DISTRIBUTION_INTERVAL);
      }
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
        isAutomaticMode,
        intervalMinutes,
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
