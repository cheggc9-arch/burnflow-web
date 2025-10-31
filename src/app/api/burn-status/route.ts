import { NextResponse } from 'next/server';

// Global timer state (in production, this should be stored in Redis or database)
let globalTimerState = {
  lastBurnTime: null as Date | null,
  nextBurnTime: null as Date | null,
  isRunning: false,
  isProcessing: false
};

// Initialize timer on first request
if (!globalTimerState.isRunning) {
  const intervalMinutes = parseInt(process.env.BURN_INTERVAL_MINUTES || '60');
  const now = new Date();
  
  // Set next burn time to be intervalMinutes from now
  globalTimerState.nextBurnTime = new Date(now.getTime() + (intervalMinutes * 60 * 1000));
  globalTimerState.isRunning = true;
  
  console.log(`🕐 Global timer initialized - next burn at: ${globalTimerState.nextBurnTime.toISOString()}`);
}

export async function GET() {
  try {
    // Get burn interval from environment
    const intervalMinutes = parseInt(process.env.BURN_INTERVAL_MINUTES || '60');
    
    const now = new Date();
    
    // Calculate time remaining until next burn
    let timeRemaining = 0;
    if (globalTimerState.nextBurnTime) {
      timeRemaining = Math.max(0, Math.floor((globalTimerState.nextBurnTime.getTime() - now.getTime()) / 1000));
      
      // If timer reached zero, set processing state
      if (timeRemaining === 0) {
        console.log(`🔥 Timer reached zero - waiting for burn service to execute...`);
        globalTimerState.isProcessing = true;
        // Don't reset here - let the burn service reset it after execution
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        intervalMinutes,
        isServiceRunning: true,
        lastBurnTime: globalTimerState.lastBurnTime?.toISOString() || null,
        nextBurnTime: globalTimerState.nextBurnTime?.toISOString() || null,
        timeRemaining, // seconds until next burn
        nextBurnIn: timeRemaining,
        isProcessing: globalTimerState.isProcessing
      }
    });
  } catch (error) {
    console.error('❌ Burn status fetch failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Add POST endpoint to reset timer after burn execution
export async function POST() {
  try {
    const intervalMinutes = parseInt(process.env.BURN_INTERVAL_MINUTES || '60');
    const now = new Date();
    
    // Claim Pump.fun creator fees when a new timer starts
    console.log(`💰 New timer starting - claiming Pump.fun creator fees...`);
    try {
      const PumpPortalService = require('../../../utils/pumpportal-service.js');
      const pumpPortalService = new PumpPortalService();
      await pumpPortalService.initialize();
      
      const feeClaimResult = await pumpPortalService.claimCreatorFee();
      if (feeClaimResult.success) {
        if (feeClaimResult.signature) {
          console.log(`✅ Creator fees claimed successfully! TX: ${feeClaimResult.signature}`);
        } else {
          console.log(`ℹ️ ${feeClaimResult.message || 'No fees available to claim'}`);
        }
      } else {
        console.log(`⚠️ Fee claim failed (non-fatal): ${feeClaimResult.error}`);
      }
    } catch (feeError) {
      // Don't fail the timer reset if fee claiming fails - log and continue
      console.error(`⚠️ Fee claim error (non-fatal): ${feeError instanceof Error ? feeError.message : 'Unknown error'}`);
    }
    
    // Reset timer for next cycle
    globalTimerState.lastBurnTime = globalTimerState.nextBurnTime;
    globalTimerState.nextBurnTime = new Date(now.getTime() + (intervalMinutes * 60 * 1000));
    globalTimerState.isProcessing = false; // Clear processing state
    
    console.log(`🔄 Timer reset by burn service - next burn at: ${globalTimerState.nextBurnTime.toISOString()}`);
    
    return NextResponse.json({
      success: true,
      message: 'Timer reset successfully',
      data: {
        nextBurnTime: globalTimerState.nextBurnTime.toISOString(),
        intervalMinutes
      }
    });
  } catch (error) {
    console.error('❌ Timer reset failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}