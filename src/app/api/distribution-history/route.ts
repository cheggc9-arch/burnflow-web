import { NextRequest, NextResponse } from 'next/server';
import { getRecentDistributions, getAllDistributions } from '@/utils/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const all = searchParams.get('all') === 'true';
    
    // Use async Supabase functions
    const distributions = all ? await getAllDistributions() : await getRecentDistributions(limit);
    
    return NextResponse.json({
      success: true,
      data: {
        distributions,
        total: distributions.length
      }
    });
  } catch (error) {
    console.error('Error fetching distribution history:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
