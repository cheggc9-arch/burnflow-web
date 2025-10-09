import { NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function GET() {
  try {
    // Get real burn wallet balance
    const burnWalletAddress = process.env.BURN_WALLET_ADDRESS || 'BURN_WALLET_ADDRESS_NOT_SET';
    let burnWalletBalance = 0;
    let network = 'mainnet-beta';
    
    if (burnWalletAddress !== 'BURN_WALLET_ADDRESS_NOT_SET') {
      try {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        const connection = new Connection(rpcUrl, 'confirmed');
        
        const publicKey = new PublicKey(burnWalletAddress);
        const balance = await connection.getBalance(publicKey);
        burnWalletBalance = balance / LAMPORTS_PER_SOL;
        
        // Determine network from RPC URL
        if (rpcUrl.includes('devnet')) {
          network = 'devnet';
        } else if (rpcUrl.includes('testnet')) {
          network = 'testnet';
        }
      } catch (error) {
        console.error('Error fetching burn wallet balance:', error);
        burnWalletBalance = 0;
      }
    }

    // Get burn history data from Supabase
    let totalBurned = 0;
    let totalBurns = 0;
    
    try {
      const { burnRecords } = await import('@/lib/supabase');
      const stats = await burnRecords.getStats();
      totalBurned = stats.totalBurned;
      totalBurns = stats.totalBurns;
    } catch (error) {
      console.error('Error fetching burn statistics from Supabase:', error);
      // If Supabase is not available, show 0 instead of fake data
      totalBurned = 0;
      totalBurns = 0;
    }

    const stats = {
      burnWalletBalance,
      totalBurned,
      totalBurns,
      network
    };

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
