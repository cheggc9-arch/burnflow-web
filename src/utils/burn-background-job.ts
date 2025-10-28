export class BurnBackgroundJob {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    // No need to initialize service - we'll use API calls
  }

  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Burn background job is already running');
      return;
    }

    // Check every 10 seconds for timer status (like burn-app)
    const checkIntervalMs = 10 * 1000; // 10 seconds

    console.log(`🔥 Starting burn background job - checking timer every 10 seconds`);

    this.isRunning = true;
    this.intervalId = setInterval(async () => {
      await this.executeBurnCycle();
    }, checkIntervalMs);

    // Run immediately on start
    this.executeBurnCycle();
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Burn background job stopped');
  }

  private async executeBurnCycle(): Promise<void> {
    try {
      console.log('🔄 Checking burn timer status...');
      
      // Check burn status first - use full URL for server-side fetch
      // In production, use the actual deployed URL, fallback to localhost for development
      const baseUrl = process.env.BASE_URL || 
                     process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                     process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` :
                     'http://localhost:3000';
      const statusResponse = await fetch(`${baseUrl}/api/burn-status`);
      const statusData = await statusResponse.json();
      
      if (!statusData.success) {
        console.log('⏭️ Skipping burn - status check failed');
        return;
      }
      
      console.log(`🕐 Timer status: ${statusData.data.timeRemaining} seconds remaining, processing: ${statusData.data.isProcessing}`);
      
      // If timer has reached zero, execute burn (regardless of processing state)
      if (statusData.data.timeRemaining === 0) {
        console.log('🔥 Timer reached zero - executing burn...');
        
        const burnResponse = await fetch(`${baseUrl}/api/trigger-burn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const burnData = await burnResponse.json();
        
        if (burnData.success) {
          console.log(`✅ Burn cycle completed successfully`);
          console.log(`  - SOL used: ${burnData.data.solAmount}`);
          console.log(`  - Tokens burned: ${burnData.data.tokensBurned}`);
          console.log(`  - Buy TX: ${burnData.data.buySignature}`);
          console.log(`  - Burn TX: ${burnData.data.burnSignature}`);
        } else {
          console.error(`❌ Burn cycle failed: ${burnData.error}`);
        }
        
        // CRITICAL: Always reset the timer after burn execution (success or failure)
        console.log('🔄 Resetting timer after burn execution...');
        const resetResponse = await fetch(`${baseUrl}/api/burn-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (resetResponse.ok) {
          console.log('✅ Timer reset successfully');
        } else {
          console.error('❌ Failed to reset timer');
        }
      } else {
        console.log(`⏭️ Timer not ready - ${statusData.data.timeRemaining} seconds remaining`);
      }
      
    } catch (error) {
      console.error('❌ Burn cycle error:', error);
    }
  }

  getStatus(): {
    isRunning: boolean;
    intervalMinutes: number;
  } {
    const intervalMinutes = parseInt(process.env.BURN_INTERVAL_MINUTES || '60');
    
    return {
      isRunning: this.isRunning,
      intervalMinutes
    };
  }
}

// Global instance
let burnBackgroundJob: BurnBackgroundJob | null = null;

export function getBurnBackgroundJob(): BurnBackgroundJob {
  if (!burnBackgroundJob) {
    burnBackgroundJob = new BurnBackgroundJob();
  }
  return burnBackgroundJob;
}

export function startBurnBackgroundJob(): void {
  const job = getBurnBackgroundJob();
  job.start();
}

export function stopBurnBackgroundJob(): void {
  const job = getBurnBackgroundJob();
  job.stop();
}
