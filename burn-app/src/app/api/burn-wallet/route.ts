import { NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function GET() {
  try {
    const burnWalletAddress = process.env.BURN_WALLET_ADDRESS || 'BURN_WALLET_ADDRESS_NOT_SET';
    
    // Get real burn wallet balance from Solana
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
        // Fallback to 0 if we can't fetch the balance
        burnWalletBalance = 0;
      }
    }

    const burnWallet = {
      address: burnWalletAddress,
      burnAddress: '1nc1nerator11111111111111111111111111111111',
      description: 'This wallet will buy and burn tokens automatically'
    };

    return NextResponse.json({
      success: true,
      data: {
        burnWallet,
        burnWalletBalance,
        burnWalletAddress: burnWallet.address,
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
