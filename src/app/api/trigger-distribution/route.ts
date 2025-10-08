import { NextRequest, NextResponse } from 'next/server';
import { DistributionService } from '@/utils/distribution-service';
import { updateLastDistributionTime } from '@/utils/cache';
import { getDistributionRunning, setDistributionRunning } from '@/utils/distribution-status';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Distribution trigger received');
    
    // Check if distribution is already running
    if (getDistributionRunning()) {
      return NextResponse.json({
        success: false,
        message: 'Distribution already running',
        timestamp: new Date().toISOString(),
      }, { status: 409 });
    }
    
    // Set distribution running flag
    setDistributionRunning(true);
    
    const distributionService = new DistributionService();
    
    // Always run distribution (conditions checked inside distributeRewards)
    const result = await distributionService.distributeRewards();
    
    if (result.success) {
      // Update the last distribution time
      updateLastDistributionTime();
      
      console.log('✅ Distribution completed and time updated');
      
      return NextResponse.json({
        success: true,
        message: 'Distribution completed successfully',
        data: {
          totalDistributed: result.totalDistributed,
          recipientsCount: result.recipientsCount,
          transactionsCount: result.transactions.length,
          failedTransactions: result.transactions.filter(t => t.error).length,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('❌ Distribution failed:', result.errors);
      
      return NextResponse.json({
        success: false,
        message: 'Distribution failed',
        errors: result.errors,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Distribution trigger error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Distribution trigger failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    // Always release the distribution running flag
    setDistributionRunning(false);
  }
}

