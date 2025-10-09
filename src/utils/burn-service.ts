import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getConnection, getTokenContractAddress } from './solana';
import { withRateLimit } from './rate-limiter';
import { rateLimitConfig } from '../config/rate-limiting';
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token';
import { DexService } from './dex-service';
import bs58 from 'bs58';

export class BurnService {
  private connection: Connection;
  private burnKeypair: Keypair;
  private tokenMint: PublicKey;
  private burnAddress: PublicKey;
  private dexService: DexService;

  constructor() {
    this.connection = getConnection();
    this.burnKeypair = this.loadBurnKeypair();
    this.tokenMint = getTokenContractAddress();
    this.burnAddress = new PublicKey('1nc1nerator11111111111111111111111111111111');
    this.dexService = new DexService();
  }

  private loadBurnKeypair(): Keypair {
    const privateKey = process.env.BURN_WALLET_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('BURN_WALLET_PRIVATE_KEY not found in environment variables');
    }

    try {
      // Handle both base58 and array format
      let privateKeyBytes: Uint8Array;
      
      if (privateKey.startsWith('[') && privateKey.endsWith(']')) {
        // Array format: [1,2,3,...]
        privateKeyBytes = new Uint8Array(JSON.parse(privateKey));
      } else {
        // Base58 format
        privateKeyBytes = bs58.decode(privateKey);
      }

      return Keypair.fromSecretKey(privateKeyBytes);
    } catch (error) {
      throw new Error(`Invalid burn wallet private key format: ${error}`);
    }
  }

  async getBurnWalletBalance(): Promise<number> {
    try {
      const balanceLamports = await withRateLimit(
        () => this.connection.getBalance(this.burnKeypair.publicKey),
        rateLimitConfig.rpcCalls.getBalance
      );
      return balanceLamports / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching burn wallet balance:', error);
      throw error;
    }
  }

  async executeBurn(): Promise<{
    success: boolean;
    solUsed: number;
    tokensBurned: number;
    signature?: string;
    error?: string;
  }> {
    console.log('🔥 Starting burn execution...');
    
    const result = {
      success: false,
      solUsed: 0,
      tokensBurned: 0,
      signature: undefined as string | undefined,
      error: undefined as string | undefined
    };

    try {
      // Get current balance
      const balanceSOL = await this.getBurnWalletBalance();
      console.log(`💰 Burn wallet balance: ${balanceSOL.toFixed(6)} SOL`);

      // Reserve some SOL for transaction fees
      const feeReserve = 0.002; // 0.002 SOL for fees (increased for token operations)
      const availableSOL = Math.max(0, balanceSOL - feeReserve);

      if (availableSOL <= 0) {
        console.log('⚠️ Insufficient balance for burn operation');
        return result;
      }

      console.log(`🔄 Available for burn: ${availableSOL.toFixed(6)} SOL`);

      // Step 1: Buy back tokens using SOL
      console.log('🔄 Step 1: Buying back tokens...');
      const buybackResult = await this.buybackTokens(availableSOL);
      
      if (!buybackResult.success) {
        throw new Error(`Token buyback failed: ${buybackResult.error}`);
      }

      console.log(`✅ Bought back ${buybackResult.tokensReceived.toFixed(0)} tokens`);

      // Step 2: Burn the tokens
      console.log('🔥 Step 2: Burning tokens...');
      const burnResult = await this.burnTokens(buybackResult.tokensReceived);
      
      if (!burnResult.success) {
        throw new Error(`Token burn failed: ${burnResult.error}`);
      }

      result.success = true;
      result.solUsed = availableSOL;
      result.tokensBurned = buybackResult.tokensReceived;
      result.signature = burnResult.signature;

      console.log(`✅ Burn executed successfully!`);
      console.log(`  - SOL used: ${availableSOL.toFixed(6)}`);
      console.log(`  - Tokens burned: ${buybackResult.tokensReceived.toFixed(0)}`);
      console.log(`  - Burn transaction: ${burnResult.signature}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Burn execution failed: ${errorMessage}`);
      result.error = errorMessage;
    }

    return result;
  }

  private async buybackTokens(solAmount: number): Promise<{
    success: boolean;
    tokensReceived: number;
    signature?: string;
    error?: string;
  }> {
    try {
      console.log(`🔄 Executing token buyback with ${solAmount.toFixed(6)} SOL...`);
      
      // Use DEX service to buy back tokens
      const buybackResult = await this.dexService.buybackTokens(this.burnKeypair, solAmount);
      
      if (!buybackResult.success) {
        throw new Error(`DEX buyback failed: ${buybackResult.error}`);
      }
      
      console.log(`✅ DEX buyback completed: ${buybackResult.tokensReceived.toFixed(0)} tokens`);
      
      return {
        success: true,
        tokensReceived: buybackResult.tokensReceived,
        signature: buybackResult.signature
      };
      
    } catch (error) {
      return {
        success: false,
        tokensReceived: 0,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async burnTokens(tokenAmount: number): Promise<{
    success: boolean;
    signature?: string;
    error?: string;
  }> {
    try {
      console.log(`🔥 Burning ${tokenAmount.toFixed(0)} Pump.fun tokens...`);
      
      // Get the burn wallet's token account
      const burnWalletTokenAccount = await getAssociatedTokenAddress(
        this.tokenMint,
        this.burnKeypair.publicKey
      );

      // Check if the token account exists and has tokens
      let tokenAccountInfo;
      try {
        tokenAccountInfo = await getAccount(this.connection, burnWalletTokenAccount);
        console.log(`📊 Burn wallet token balance: ${tokenAccountInfo.amount.toString()}`);
      } catch (error) {
        console.log('⚠️ Burn wallet token account not found or empty');
        return {
          success: false,
          error: 'No tokens to burn'
        };
      }

      // Check if we have enough tokens to burn
      const availableTokens = Number(tokenAccountInfo.amount);
      const tokensToBurn = Math.min(Math.floor(tokenAmount), availableTokens);
      
      if (tokensToBurn <= 0) {
        console.log('⚠️ No tokens available to burn');
        return {
          success: false,
          error: 'Insufficient token balance'
        };
      }

      console.log(`🔄 Burning ${tokensToBurn} tokens (available: ${availableTokens})`);

      const transaction = new Transaction();

      // For Pump.fun tokens, we need to transfer to the burn address
      // The burn address should have a token account for this mint
      const burnTokenAccount = await getAssociatedTokenAddress(
        this.tokenMint,
        this.burnAddress
      );

      // Check if burn address token account exists, create if not
      let burnTokenAccountInfo;
      try {
        burnTokenAccountInfo = await getAccount(this.connection, burnTokenAccount);
        console.log('✅ Burn address token account exists');
      } catch (error) {
        console.log('🔄 Creating burn address token account...');
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.burnKeypair.publicKey, // payer
            burnTokenAccount, // ata
            this.burnAddress, // owner
            this.tokenMint // mint
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          burnWalletTokenAccount, // source
          burnTokenAccount, // destination
          this.burnKeypair.publicKey, // owner
          BigInt(tokensToBurn) // amount (in token units)
        )
      );

      // Set recent blockhash
      const { blockhash } = await withRateLimit(
        () => this.connection.getLatestBlockhash(),
        rateLimitConfig.rpcCalls.getLatestBlockhash
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.burnKeypair.publicKey;

      // Sign and send transaction
      transaction.sign(this.burnKeypair);
      
      const signature = await withRateLimit(
        () => this.connection.sendRawTransaction(transaction.serialize()),
        rateLimitConfig.rpcCalls.sendRawTransaction
      );

      // Confirm transaction
      const confirmation = await withRateLimit(
        () => this.connection.confirmTransaction(signature, 'confirmed'),
        rateLimitConfig.rpcCalls.confirmTransaction
      );

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }

      console.log(`✅ Pump.fun tokens burned successfully! Transaction: ${signature}`);
      console.log(`🔥 ${tokensToBurn} tokens permanently removed from circulation`);
      
      return {
        success: true,
        signature
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // Method to check if burn should run
  async shouldRunBurn(): Promise<boolean> {
    try {
      const balanceSOL = await this.getBurnWalletBalance();
      const minBalance = 0.001; // Minimum balance to trigger burn
      
      console.log(`💰 Burn wallet balance: ${balanceSOL.toFixed(6)} SOL`);
      console.log(`📊 Minimum balance for burn: ${minBalance} SOL`);
      
      return balanceSOL >= minBalance;
    } catch (error) {
      console.error(`❌ Error checking burn conditions: ${error}`);
      return false;
    }
  }
}
