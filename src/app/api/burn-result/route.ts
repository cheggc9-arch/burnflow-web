import { NextResponse } from 'next/server';

// Store the last burn result in memory (in production, use Redis or database)
let lastBurnResult: {
  status: string;
  message: string;
  timestamp: number;
} | null = null;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        lastBurnResult
      }
    });
  } catch (error) {
    console.error('❌ Burn result fetch failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { status, message } = body;
    
    // Store the burn result
    lastBurnResult = {
      status,
      message,
      timestamp: Date.now()
    };
    
    console.log(`📊 Burn result stored: ${status} - ${message}`);
    
    return NextResponse.json({
      success: true,
      message: 'Burn result stored successfully'
    });
  } catch (error) {
    console.error('❌ Burn result storage failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
