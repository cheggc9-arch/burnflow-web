import { NextResponse } from 'next/server';
import { burnRecords } from '@/lib/supabase';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getCachedData } from '@/utils/cache';

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
    
    // Get active holders from cache
    const cache = getCachedData();
    const activeHolders = cache.activeHolders || 0;
    
    return NextResponse.json({
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
  } catch (error) {
    console.error('Error fetching burn stats:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
