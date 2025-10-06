import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getConnection, getCreatorWalletAddress } from './solana';
import { saveDistributionRecord, DistributionTransaction } from './database';
import bs58 from 'bs58';
import fs from 'fs';
import path from 'path';

interface HolderData {
  tokens: number;
  first_buy_time: string;
  weightage: number;
}

interface DistributionResult {
  success: boolean;
  totalDistributed: number;
  recipientsCount: number;
  transactions: Array<{
    recipient: string;
    amount: number;
    signature?: string;
    error?: string;
    weightage: number;
  }>;
  errors: string[];
}

export class DistributionService {
  private connection: Connection;
  private creatorKeypair: Keypair;
  private batchSize: number = 20; // Process 20 transactions per batch
  private batchDelay: number = 2000; // 2 second delay between batches

  constructor() {
    this.connection = getConnection();
    this.creatorKeypair = this.loadCreatorKeypair();
  }

  private loadCreatorKeypair(): Keypair {
    const privateKey = process.env.DEV_WALLET_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('DEV_WALLET_PRIVATE_KEY not found in environment variables');
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
      throw new Error(`Invalid private key format: ${error}`);
    }
  }

  private loadHoldersData(): Record<string, HolderData> {
    try {
      const filePath = path.join(process.cwd(), 'holders-hashmap.json');
      
      if (!fs.existsSync(filePath)) {
        throw new Error('holders-hashmap.json not found');
      }

      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load holders data: ${error}`);
    }
  }

  private calculateDistributionAmounts(holdersData: Record<string, HolderData>, totalTreasurySOL: number): Array<{
    address: string;
    amount: number;
    weightage: number;
  }> {
    // Filter out holders with zero weightage
    const validHolders = Object.entries(holdersData)
      .filter(([_, data]) => data.weightage > 0)
      .map(([address, data]) => ({
        address,
        weightage: data.weightage,
        tokens: data.tokens,
        first_buy_time: data.first_buy_time
      }));

    if (validHolders.length === 0) {
      console.log('⚠️ No valid holders found, but continuing with empty distribution');
      return [];
    }

    // Calculate total weightage
    const totalWeightage = validHolders.reduce((sum, holder) => sum + holder.weightage, 0);

    console.log(`📊 Distribution calculation:`);
    console.log(`  - Valid holders: ${validHolders.length}`);
    console.log(`  - Total weightage: ${totalWeightage.toFixed(2)}`);
    console.log(`  - Treasury balance: ${totalTreasurySOL.toFixed(4)} SOL`);

    // Calculate distribution amounts
    const distributionAmounts = validHolders.map(holder => {
      const share = holder.weightage / totalWeightage;
      const amountSOL = totalTreasurySOL * share;
      const amountLamports = Math.floor(amountSOL * LAMPORTS_PER_SOL);

      return {
        address: holder.address,
        amount: amountLamports,
        weightage: holder.weightage
      };
    });

    // Filter out very small amounts (less than 0.000001 SOL = 1000 lamports)
    const filteredAmounts = distributionAmounts.filter(item => item.amount >= 1000);

    console.log(`  - After filtering small amounts: ${filteredAmounts.length} recipients`);
    console.log(`  - Total to distribute: ${(filteredAmounts.reduce((sum, item) => sum + item.amount, 0) / LAMPORTS_PER_SOL).toFixed(4)} SOL`);

    return filteredAmounts;
  }

  private async createTransferTransaction(recipient: string, amount: number): Promise<Transaction> {
    const transaction = new Transaction();
    
    const recipientPubkey = new PublicKey(recipient);
    const creatorPubkey = this.creatorKeypair.publicKey;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: creatorPubkey,
        toPubkey: recipientPubkey,
        lamports: amount,
      })
    );

    // Set recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = creatorPubkey;

    return transaction;
  }

  private async sendTransaction(transaction: Transaction): Promise<string> {
    // Sign the transaction
    transaction.sign(this.creatorKeypair);

    // Send the transaction
    const signature = await this.connection.sendRawTransaction(transaction.serialize());
    
    // Confirm the transaction
    const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }

    return signature;
  }

  async distributeRewards(): Promise<DistributionResult> {
    console.log('🚀 Starting reward distribution...');
    
    const result: DistributionResult = {
      success: false,
      totalDistributed: 0,
      recipientsCount: 0,
      transactions: [],
      errors: []
    };

    let treasuryBalance = 0;

    try {
      // Load holders data
      const holdersData = this.loadHoldersData();
      console.log(`📋 Loaded ${Object.keys(holdersData).length} holders from hashmap`);

      // Get treasury balance
      const creatorAddress = getCreatorWalletAddress();
      const balanceLamports = await this.connection.getBalance(creatorAddress);
      const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;
      treasuryBalance = balanceSOL;

      console.log(`💰 Treasury balance: ${balanceSOL.toFixed(4)} SOL`);

      // Check if balance meets minimum threshold for actual distribution
      const minThreshold = 0.004;
      const meetsThreshold = balanceSOL >= minThreshold;
      
      if (!meetsThreshold) {
        console.log(`⚠️ Treasury balance ${balanceSOL.toFixed(4)} SOL below threshold of ${minThreshold} SOL`);
        console.log(`📝 Creating distribution record but skipping actual transfers`);
      } else {
        console.log(`✅ Treasury balance ${balanceSOL.toFixed(4)} SOL meets threshold of ${minThreshold} SOL`);
      }

      // Reserve 5% of balance for transaction fees (or use all balance if very small)
      const feeReserve = balanceSOL * 0.05;
      const availableSOL = Math.max(0, balanceSOL - feeReserve);
      
      // Always proceed with distribution, even if 0 SOL available
      if (availableSOL <= 0) {
        console.log(`⚠️ No SOL available for distribution, but proceeding to maintain history continuity`);
        // Set availableSOL to 0 to continue with empty distribution
      }

      // Calculate distribution amounts
      const distributionAmounts = this.calculateDistributionAmounts(holdersData, availableSOL);
      
      // Always proceed with distribution, even if no recipients or 0 SOL
      if (distributionAmounts.length === 0) {
        console.log(`⚠️ No valid recipients for distribution, but proceeding to maintain history continuity`);
        // Continue with empty distribution to maintain history
      }
      
      // Skip actual transfers if threshold not met
      if (!meetsThreshold) {
        console.log(`⏭️ Skipping actual transfers due to threshold not being met`);
        // Set empty results for threshold not met
        result.recipientsCount = 0;
        result.totalDistributed = 0;
        result.transactions = [];
        result.success = true; // Still mark as successful for history continuity
      } else {
        // Proceed with normal distribution logic
        result.recipientsCount = distributionAmounts.length;

        // Process in batches (or skip if no distributions)
        const batches = [];
        for (let i = 0; i < distributionAmounts.length; i += this.batchSize) {
          batches.push(distributionAmounts.slice(i, i + this.batchSize));
        }

        console.log(`📦 Processing ${batches.length} batches of up to ${this.batchSize} transactions each`);

        let totalDistributed = 0;
        
        // If no batches, still create a distribution record
        if (batches.length === 0) {
          console.log(`📝 No transactions to process, but creating distribution record for history continuity`);
        }

        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        console.log(`\n🔄 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} transactions)`);

        // Process batch in parallel
        const batchPromises = batch.map(async (item) => {
          try {
            const transaction = await this.createTransferTransaction(item.address, item.amount);
            const signature = await this.sendTransaction(transaction);
            
            const amountSOL = item.amount / LAMPORTS_PER_SOL;
            totalDistributed += amountSOL;

            console.log(`  ✅ ${item.address}: ${amountSOL.toFixed(6)} SOL (${signature})`);

            return {
              recipient: item.address,
              amount: amountSOL,
              signature,
              weightage: item.weightage
            };
          } catch (error) {
            const errorMsg = `Failed to send to ${item.address}: ${error}`;
            console.error(`  ❌ ${errorMsg}`);
            
            return {
              recipient: item.address,
              amount: item.amount / LAMPORTS_PER_SOL,
              error: errorMsg,
              weightage: item.weightage
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        result.transactions.push(...batchResults);

        // Add delay between batches (except for the last batch)
        if (batchIndex < batches.length - 1) {
          console.log(`⏳ Waiting ${this.batchDelay}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, this.batchDelay));
        }
      }

        result.totalDistributed = totalDistributed;
        result.success = true;

        console.log(`\n🎉 Distribution completed successfully!`);
        console.log(`  - Total distributed: ${totalDistributed.toFixed(4)} SOL`);
        console.log(`  - Recipients: ${result.recipientsCount}`);
        console.log(`  - Failed transactions: ${result.transactions.filter(t => t.error).length}`);
      }

      // Save distribution to history database
      try {
        const distributionTransactions: DistributionTransaction[] = result.transactions.map(tx => ({
          recipient: tx.recipient,
          amount: tx.amount,
          signature: tx.signature || '',
          weightage: tx.weightage
        }));

        const failedCount = result.transactions.filter(t => t.error).length;
        let status = failedCount === 0 ? 'success' : failedCount === result.transactions.length ? 'failed' : 'partial';
        
        // Override status if threshold not met
        if (!meetsThreshold) {
          status = 'threshold_not_met';
        }

        await saveDistributionRecord({
          timestamp: new Date().toISOString(),
          totalDistributed: result.totalDistributed,
          recipientsCount: result.recipientsCount,
          transactionsCount: result.transactions.length,
          failedTransactions: failedCount,
          transactions: distributionTransactions,
          treasuryBalance: treasuryBalance,
          status: status
        });

        console.log(`💾 Distribution history saved to database`);
        
        // Refresh treasury balance after distribution
        try {
          console.log(`🔄 Refreshing treasury balance after distribution...`);
          const { getCachedData, saveCacheToFile } = await import('./cache-persistence');
          const { getConnection, getCreatorWalletAddress } = await import('./solana');
          
          // Get fresh balance
          const connection = getConnection();
          const creatorAddress = getCreatorWalletAddress();
          const balanceLamports = await connection.getBalance(creatorAddress);
          const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;
          
          // Update cache with new balance
          const cache = getCachedData();
          cache.treasuryBalance = balanceSOL;
          cache.lastUpdated = Date.now();
          await saveCacheToFile(cache);
          
          console.log(`✅ Treasury balance refreshed: ${balanceSOL.toFixed(4)} SOL`);
        } catch (refreshError) {
          console.error('❌ Failed to refresh treasury balance:', refreshError);
          // Don't fail the distribution if refresh fails
        }
      } catch (dbError) {
        console.error('❌ Failed to save distribution history:', dbError);
        // Don't fail the distribution if database save fails
      }

    } catch (error) {
      const errorMsg = `Distribution failed: ${error}`;
      console.error(`❌ ${errorMsg}`);
      result.errors.push(errorMsg);
    }

    return result;
  }

  // Method to check if distribution should run
  async shouldRunDistribution(): Promise<boolean> {
    try {
      // Always allow distribution to maintain history continuity
      const holdersData = this.loadHoldersData();
      const validHolders = Object.values(holdersData).filter(data => data.weightage > 0);
      
      // Check treasury balance
      const creatorAddress = getCreatorWalletAddress();
      const balanceLamports = await this.connection.getBalance(creatorAddress);
      const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;

      console.log(`💰 Treasury balance: ${balanceSOL.toFixed(4)} SOL`);
      console.log(`📋 Valid holders: ${validHolders.length}`);
      console.log(`✅ Distribution will proceed regardless of conditions`);

      return true; // Always return true to allow distribution
    } catch (error) {
      console.error(`❌ Error checking distribution conditions: ${error}`);
      return true; // Even on error, allow distribution to maintain history
    }
  }
}