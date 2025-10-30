import { NextResponse } from 'next/server';
import { burnRecords } from '@/lib/supabase';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getCachedData } from '@/utils/cache';

// Disable Next.js caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Get creator wallet balance
    const creatorWalletAddress = process.env.CREATOR_WALLET_ADDRESS || 'CREATOR_WALLET_ADDRESS_NOT_SET';
    let creatorWalletBalance = 0;
    let network = 'mainnet-beta';
    
    if (creatorWalletAddress !== 'CREATOR_WALLET_ADDRESS_NOT_SET') {
      try {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        const connection = new Connection(rpcUrl, 'confirmed');
        
        const publicKey = new PublicKey(creatorWalletAddress);
        const balance = await connection.getBalance(publicKey);
        creatorWalletBalance = balance / LAMPORTS_PER_SOL;
        
        // Determine network from RPC URL
        if (rpcUrl.includes('devnet')) {
          network = 'devnet';
        } else if (rpcUrl.includes('testnet')) {
          network = 'testnet';
        }
      } catch (error) {
        console.error('Error fetching creator wallet balance:', error);
        creatorWalletBalance = 0;
      }
    }

    // Get burn statistics from database
    const stats = await burnRecords.getStats();
    
    // Get active holders from cache (always get fresh data)
    const cache = getCachedData();
    const activeHolders = cache.activeHolders || 0;
    
    console.log(`📊 API returning active holders: ${activeHolders} (cache last updated: ${new Date(cache.lastUpdated).toISOString()})`);
    
    const response = NextResponse.json({
      success: true,
      data: {
        creatorWalletBalance,
        creatorWalletAddress,
        totalBurned: stats.totalBurned,
        totalBurns: stats.totalBurns,
        totalSolUsed: stats.totalSolUsed,
        activeHolders,
        network,
        timestamp: new Date().toISOString()
      }
    });
    
    // Prevent Next.js from caching this API response
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching burn stats:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
