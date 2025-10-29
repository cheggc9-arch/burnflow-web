import { NextResponse } from 'next/server';
import { burnRecords } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('🔥 Manual burn trigger requested');
    
    // Get environment variables
    const burnWalletAddress = process.env.CREATOR_WALLET_ADDRESS || 'CREATOR_WALLET_ADDRESS_NOT_SET';
    const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS || 'TOKEN_CONTRACT_ADDRESS_NOT_SET';
    
    // Perform real burn operations
    const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
    const bs58 = require('bs58').default || require('bs58');
    
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');
    
    // Load creator wallet keypair (used for burn operations)
    const privateKey = process.env.CREATOR_WALLET_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('CREATOR_WALLET_PRIVATE_KEY not set');
    }
    
    const keypair = require('@solana/web3.js').Keypair.fromSecretKey(bs58.decode(privateKey));
    
            // Get real balance
            const balance = await connection.getBalance(keypair.publicKey);
            const totalBalance = balance / LAMPORTS_PER_SOL;
            
            // Check if buying is enabled
            const enableBuy = process.env.ENABLE_BUY_TOKENS === 'true';
            let availableForBuy = 0; // Initialize at function level
            
            if (enableBuy) {
                // Only check SOL reserve when buying tokens
                const reserveAmount = parseFloat(process.env.SOL_RESERVE_AMOUNT || '0.06');
                const minBalance = parseFloat(process.env.MIN_BALANCE_SOL || '0.001');
                
                // First check: Must have at least the reserve amount
                if (totalBalance < reserveAmount) {
                    throw new Error(`Insufficient balance for burn operation. Need at least ${reserveAmount} SOL to reserve (have ${totalBalance.toFixed(4)} SOL)`);
                }
                
                availableForBuy = totalBalance - reserveAmount;
                
                // Second check: Available amount must be at least minimum balance
                if (availableForBuy < minBalance) {
                    throw new Error(`Insufficient balance for burn operation. Need at least ${reserveAmount + minBalance} SOL total (have ${totalBalance.toFixed(4)} SOL)`);
                }
                
                console.log(`💰 Total balance: ${totalBalance.toFixed(4)} SOL`);
                console.log(`💰 Reserve amount: ${reserveAmount} SOL`);
                console.log(`💰 Available for buy: ${availableForBuy.toFixed(4)} SOL`);
            } else {
                // When not buying, no SOL balance check needed - just burn existing tokens
                console.log(`💰 Total balance: ${totalBalance.toFixed(4)} SOL`);
                console.log(`🔥 Burning existing tokens (no SOL check needed)`);
            }
    
    let buySignature = null;
    let tokensBought = 0;

    if (enableBuy) {
      console.log('🔄 Buying tokens is enabled - performing buyback...');
      
      // Perform real buyback using DEX service
      const DexService = require('../../../utils/dex-service.js');
      console.log('DexService type:', typeof DexService);
      console.log('DexService constructor:', DexService);
      const dexService = new DexService();
      await dexService.initialize();
      
      // Execute real token buyback via Jupiter API
      const buybackResult = await dexService.buyPumpFunTokens(keypair, totalBalance);
      
      buySignature = buybackResult.signature;
      tokensBought = buybackResult.tokensReceived;
      
      console.log(`✅ Buy completed: ${tokensBought} tokens bought`);
    } else {
      console.log('⚠️ Buying tokens is disabled - checking for existing tokens...');
      
      // Check for existing tokens in the wallet
      try {
        const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');
        const tokenMint = new PublicKey(process.env.TOKEN_CONTRACT_ADDRESS);
        const sourceTokenAccount = await getAssociatedTokenAddress(tokenMint, keypair.publicKey);
        
        const tokenAccount = await getAccount(connection, sourceTokenAccount);
        tokensBought = Number(tokenAccount.amount);
        
        console.log(`🔍 Found ${tokensBought} existing tokens in wallet`);
        
        if (tokensBought === 0) {
          throw new Error('No existing tokens found in wallet and buying is disabled');
        }
      } catch (error) {
        throw new Error(`No tokens available for burning: ${error.message}`);
      }
    }
    
            // Check if burning is enabled
            const enableBurn = process.env.ENABLE_BURN_AFTER_BUY === 'true';
            let burnSignature = null;
            let tokensBurned = 0;
            let status = 'buy_only';

            if (enableBurn) {
              console.log('🔥 Performing real token burn using SPL Burn instruction...');
              console.log(`🔥 Burning ${tokensBought} tokens (reducing supply)...`);
              
              try {
                const { PublicKey, Transaction } = require('@solana/web3.js');
                const { getAssociatedTokenAddress, createBurnInstruction } = require('@solana/spl-token');
                
                const tokenMint = new PublicKey(process.env.TOKEN_CONTRACT_ADDRESS);
                
                console.log(`   🔍 Token mint: ${tokenMint.toBase58()}`);
                console.log(`   🔍 Token amount to burn: ${tokensBought}`);
                
                // Get the token account for the burn wallet
                const sourceTokenAccount = await getAssociatedTokenAddress(
                  tokenMint,
                  keypair.publicKey
                );
                
                console.log(`   🔍 Source token account: ${sourceTokenAccount.toBase58()}`);
                
                // Create burn instruction to permanently destroy tokens and reduce supply
                const burnInstruction = createBurnInstruction(
                  sourceTokenAccount, // Token account to burn from
                  tokenMint,          // Token mint
                  keypair.publicKey,  // Owner of the token account
                  tokensBought        // Amount to burn in smallest units
                );
                
                const burnTransaction = new Transaction();
                burnTransaction.add(burnInstruction);
                
                const { blockhash: burnBlockhash } = await connection.getLatestBlockhash();
                burnTransaction.recentBlockhash = burnBlockhash;
                burnTransaction.feePayer = keypair.publicKey;
                
                burnTransaction.sign(keypair);
                burnSignature = await connection.sendRawTransaction(burnTransaction.serialize());
                await connection.confirmTransaction(burnSignature, 'confirmed');
                
                tokensBurned = tokensBought;
                status = 'success';
                
                console.log(`   ✅ SPL Token burn transaction successful: ${burnSignature}`);
                console.log(`🔥 Token supply reduced by: ${tokensBurned} tokens`);
                console.log(`🔥 Burn TX: ${burnSignature}`);
                
              } catch (burnError) {
                console.error('❌ SPL Token burn failed:', burnError.message);
                burnSignature = null;
                tokensBurned = 0;
                status = 'buy_only';
              }
            } else {
              console.log('⚠️ Burning disabled - only buying tokens');
              tokensBurned = 0;
            }

            const timestamp = new Date().toISOString();

            // Record the operation in Supabase
            const burnRecord = await burnRecords.add({
              timestamp,
              sol_amount: enableBuy ? availableForBuy : 0, // Use availableForBuy only when buying, otherwise 0
              tokens_burned: tokensBurned,
              buy_signature: buySignature,
              burn_signature: burnSignature,
              status: status,
              burn_wallet_address: burnWalletAddress,
              token_contract_address: tokenContractAddress
            });
    
    console.log('✅ Real burn operation completed and recorded:', burnRecord);
    console.log(`💸 Buy TX: ${buySignature}`);
    console.log(`🔥 Burn TX: ${burnSignature}`);
    
    return NextResponse.json({
      success: true,
      data: {
        id: burnRecord.id,
        solAmount: enableBuy ? availableForBuy : 0, // Use availableForBuy only when buying, otherwise 0
        tokensBurned,
        buySignature,
        burnSignature,
        timestamp
      },
      message: 'Real burn operation completed and recorded successfully'
    });
  } catch (error) {
    console.error('❌ Burn trigger failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
