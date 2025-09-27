import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/utils/solana';

export async function GET(request: NextRequest) {
  try {
    const result = await testConnection();
    
    return NextResponse.json({
      success: result.success,
      data: result,
    });
  } catch (error) {
    console.error('Error testing connection:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
