import { NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function GET() {
  try {
    const creatorWalletAddress = process.env.CREATOR_WALLET_ADDRESS || 'CREATOR_WALLET_ADDRESS_NOT_SET';
    
    // Get real creator wallet balance from Solana
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
        // Fallback to 0 if we can't fetch the balance
        creatorWalletBalance = 0;
      }
    }

    const creatorWallet = {
      address: creatorWalletAddress,
      burnAddress: '1nc1nerator11111111111111111111111111111111',
      description: 'This wallet will buy and burn tokens automatically'
    };

    return NextResponse.json({
      success: true,
      data: {
        creatorWallet,
        creatorWalletBalance,
        creatorWalletAddress: creatorWallet.address,
        network,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
