import { NextRequest, NextResponse } from 'next/server';
import { getCachedData } from '@/utils/cache';
import { DistributionService } from '@/utils/distribution-service';

// Simple lock to prevent multiple distributions running simultaneously
let isDistributionRunning = false;

export async function GET(request: NextRequest) {
  try {
    const cache = getCachedData();
    
    // Get distribution interval from environment variable (in minutes, default 20)
    const intervalMinutes = parseInt(process.env.DISTRIBUTION_INTERVAL_MINUTES || '20');
    const DISTRIBUTION_INTERVAL = intervalMinutes * 60 * 1000;
    
    // Check if automatic distribution is enabled
    const isAutomaticMode = process.env.ENABLE_AUTOMATIC_DISTRIBUTION === 'true';
    
    // Get the actual last distribution time from database first
    let actualLastDistributionTime;
    let isFreshDeployment = false;
    
    try {
      const { getRecentDistributions } = await import('@/utils/database');
      const recentDistributions = await getRecentDistributions(1);
      if (recentDistributions.length > 0) {
        actualLastDistributionTime = new Date(recentDistributions[0].timestamp).getTime();
        // We have a real distribution time from database
      } else {
        // No distributions in database - use cache or set initial time
        if (cache.lastDistributionTime && cache.lastDistributionTime > 0) {
          actualLastDistributionTime = cache.lastDistributionTime;
        } else {
          // No distributions and no cache - set initial time (only once per session)
          const sessionKey = 'initialDistributionTime';
          if (!(global as any)[sessionKey]) {
            (global as any)[sessionKey] = Date.now();
            console.log('🎯 Setting initial distribution time for this session');
          }
          actualLastDistributionTime = (global as any)[sessionKey];
          isFreshDeployment = true; // Only to update cache, not reset timer
        }
      }
    } catch (error) {
      console.error('Error fetching last distribution from database:', error);
      // Fallback to cache if database fails
      if (cache.lastDistributionTime && cache.lastDistributionTime > 0) {
        actualLastDistributionTime = cache.lastDistributionTime;
      } else {
        // No valid cache - set initial time (only once per session)
        const sessionKey = 'initialDistributionTime';
        if (!(global as any)[sessionKey]) {
          (global as any)[sessionKey] = Date.now();
          console.log('🎯 Setting initial distribution time for this session (database error)');
        }
        actualLastDistributionTime = (global as any)[sessionKey];
        isFreshDeployment = true; // Only to update cache, not reset timer
      }
    }
    
    // Check if we should force reset and haven't reset yet in this session
    const forceReset = process.env.RESET_TIMER_ON_DEPLOY === 'true';
    const hasResetThisSession = (global as any).__timerResetThisSession;
    if (forceReset && !hasResetThisSession) {
      isFreshDeployment = true;
      actualLastDistributionTime = Date.now();
    }
    
    // TIMER BEHAVIOR:
    // - Fresh deployment: Start timer from current time (full interval)
    // - Existing deployment: Use actual last distribution time from database
    const lastDistributionTime = actualLastDistributionTime;
    
    // If this is a fresh deployment, update the cache with the new start time
    if (isFreshDeployment) {
      console.log('🔄 FRESH DEPLOYMENT: Starting timer from current time');
      const { updateLastDistributionTime } = await import('@/utils/cache');
      updateLastDistributionTime();
      
      // Mark that we've reset this session to prevent repeated resets
      if (forceReset) {
        (global as any).__timerResetThisSession = true;
      }
    }
    
    // Calculate next distribution time
    const nextDistributionTime = lastDistributionTime + DISTRIBUTION_INTERVAL;
    
    // Calculate time remaining until next distribution
    const now = Date.now();
    const timeRemaining = Math.max(0, nextDistributionTime - now);
    
    let actualNextDistribution = nextDistributionTime;
    let shouldTriggerDistribution = false;
    
    if (timeRemaining <= 0) {
      if (isAutomaticMode) {
        // Check if distribution is already running
        if (isDistributionRunning) {
          console.log('⏳ Distribution already running, skipping this cycle');
          return NextResponse.json({
            success: true,
            data: {
              timeRemainingSeconds: 0,
              nextDistributionTime: nextDistributionTime, // Keep original time
              lastDistributionTime,
              distributionInterval: DISTRIBUTION_INTERVAL,
              isDistributionTime: false,
              isAutomaticMode,
              intervalMinutes,
              lastUpdated: cache.lastUpdated,
              distributionJustTriggered: false,
              message: 'Distribution already running'
            },
          });
        }
        
        // AUTOMATIC MODE: Trigger distribution
        console.log('🚀 AUTOMATIC MODE: Triggering distribution...');
        shouldTriggerDistribution = true;
        isDistributionRunning = true;
        
        // Run the distribution FIRST
        let distributionSucceeded = false;
        try {
          const distributionService = new DistributionService();
          const result = await distributionService.distributeRewards();
          
          if (result.success) {
            console.log('✅ Automatic distribution completed successfully');
            distributionSucceeded = true;
            // Note: Frontend will auto-refresh via the 10-second interval
            // No need to dispatch window events from server-side
          } else {
            console.error('❌ Automatic distribution failed:', result.errors);
            console.log('⏭️ Skipping timer update - will retry in next 20min cycle');
          }
        } catch (error) {
          console.error('❌ Automatic distribution error:', error);
          console.log('⏭️ Skipping timer update - will retry in next 20min cycle');
        } finally {
          // Always release the lock
          isDistributionRunning = false;
        }
        
        // Only update timer if distribution succeeded
        if (distributionSucceeded) {
          const { updateLastDistributionTime } = await import('@/utils/cache');
          updateLastDistributionTime();
          // Calculate next distribution time after successful distribution
          actualNextDistribution = now + DISTRIBUTION_INTERVAL;
        } else {
          // Keep original next distribution time (don't reset timer on failure)
          actualNextDistribution = nextDistributionTime;
        }
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
        distributionJustTriggered: shouldTriggerDistribution, // Flag to indicate distribution was just triggered
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
