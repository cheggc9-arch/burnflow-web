import { NextRequest, NextResponse } from 'next/server';
import { updateLastDistributionTime } from '@/utils/cache';

export async function POST(request: NextRequest) {
  try {
    // Update the last distribution time
    updateLastDistributionTime();
    
    return NextResponse.json({
      success: true,
      message: 'Distribution time updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating distribution time:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
