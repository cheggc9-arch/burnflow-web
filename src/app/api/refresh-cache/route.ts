import { NextResponse } from 'next/server';
import { updateCache } from '@/utils/cache';

export async function POST() {
  try {
    console.log('🔄 Manual cache refresh requested...');
    
    // Force cache update
    await updateCache();
    
    return NextResponse.json({
      success: true,
      message: 'Cache refresh triggered successfully'
    });
  } catch (error) {
    console.error('❌ Cache refresh failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Also allow GET requests for easy testing
    console.log('🔄 Manual cache refresh requested via GET...');
    
    // Force cache update
    await updateCache();
    
    return NextResponse.json({
      success: true,
      message: 'Cache refresh triggered successfully'
    });
  } catch (error) {
    console.error('❌ Cache refresh failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

