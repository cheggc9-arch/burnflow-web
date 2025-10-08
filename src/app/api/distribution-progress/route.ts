import { NextRequest, NextResponse } from 'next/server';
import { distributionProgress } from '@/utils/distribution-progress';

export async function GET(request: NextRequest) {
  try {
    const progress = distributionProgress.getProgress();
    
    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error fetching distribution progress:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
