import { NextResponse } from 'next/server';
import { burnRecords } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch real burn records from Supabase
    const burns = await burnRecords.getAll();
    const stats = await burnRecords.getStats();

    // Transform data for frontend
    const burnHistory = burns.map(burn => ({
      id: burn.id.toString(),
      timestamp: burn.timestamp,
      solAmount: burn.sol_amount,
      tokensBurned: burn.tokens_burned,
      buySignature: burn.buy_signature,
      burnSignature: burn.burn_signature,
      status: burn.status
    }));

    return NextResponse.json({
      success: true,
      data: {
        burns: burnHistory,
        totalBurns: stats.totalBurns,
        totalTokensBurned: stats.totalBurned,
        totalSolUsed: stats.totalSolUsed
      }
    });
  } catch (error) {
    console.error('Error fetching burn history:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}