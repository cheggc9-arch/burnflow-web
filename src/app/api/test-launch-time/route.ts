import { NextRequest, NextResponse } from 'next/server';
import { getTokenContractAddress } from '@/utils/solana';

// Test endpoint to verify the new launch time functionality
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing launch time functionality');
    
    // Import the function
    const { getTokenLaunchTime } = await import('@/utils/cache');
    
    const tokenMint = getTokenContractAddress();
    const tokenAddress = tokenMint.toBase58();
    
    console.log(`🔍 Testing with token address: ${tokenAddress}`);
    
    // This will test the new Supabase-based implementation
    const launchTime = await getTokenLaunchTime(tokenAddress);
    
    return NextResponse.json({
      success: true,
      tokenAddress,
      launchTime,
      message: 'Launch time fetched successfully'
    });
    
  } catch (error) {
    console.error('Test launch time error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch launch time'
    }, { status: 500 });
  }
}
