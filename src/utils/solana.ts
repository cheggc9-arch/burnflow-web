import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Solana connection configuration
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Create connection instance with optimized settings
export const connection = new Connection(RPC_URL, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
  disableRetryOnRateLimit: false,
});

// Get the appropriate connection based on environment
export function getConnection(): Connection {
  return connection;
}

// Get creator wallet address (public only)
export function getCreatorWalletAddress(): PublicKey {
  const address = process.env.CREATOR_WALLET_ADDRESS;
  
  if (!address) {
    throw new Error('CREATOR_WALLET_ADDRESS not found in environment variables');
  }
  
  try {
    return new PublicKey(address);
  } catch (error) {
    throw new Error(`Invalid creator wallet address: ${address}`);
  }
}

// Get token contract address
export function getTokenContractAddress(): PublicKey {
  const address = process.env.TOKEN_CONTRACT_ADDRESS;
  
  if (!address) {
    throw new Error('TOKEN_CONTRACT_ADDRESS not found in environment variables');
  }
  
  try {
    return new PublicKey(address);
  } catch (error) {
    throw new Error(`Invalid token contract address: ${address}`);
  }
}

// Get network info
export function getNetwork(): string {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet';
}

// Get creator wallet SOL balance (public data)
export async function getCreatorWalletBalance(): Promise<number> {
  try {
    const connection = getConnection();
    const creatorAddress = getCreatorWalletAddress();
    
    const balanceLamports = await connection.getBalance(creatorAddress);
    return balanceLamports / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching creator wallet balance:', error);
    throw error;
  }
}

// Get token holders (public data)
export async function getTokenHolders(tokenMint: PublicKey): Promise<Array<{
  address: string;
  balance: number;
  firstHoldTime?: Date;
  lastUpdated?: Date;
}>> {
  try {
    const connection = getConnection();
    
    // Get all token accounts for this mint
    const tokenAccounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        { dataSize: 165 }, // Token account data size
        {
          memcmp: {
            offset: 0, // Mint address offset
            bytes: tokenMint.toBase58(),
          },
        },
      ],
    });
    
    const holders: Array<{
      address: string;
      balance: number;
      firstHoldTime?: Date;
      lastUpdated?: Date;
    }> = [];
    
    // Process token accounts
    for (const { pubkey, account } of tokenAccounts) {
      try {
        // Parse account data to get balance
        const accountData = account.data;
        const amount = accountData.readBigUInt64LE(64); // Amount is at offset 64
        const balance = Number(amount);
        
        if (balance > 0) {
          holders.push({
            address: pubkey.toBase58(),
            balance,
            firstHoldTime: new Date(), // TODO: Implement proper first hold time tracking
            lastUpdated: new Date(),
          });
        }
      } catch (error) {
        console.warn(`Skipping invalid token account ${pubkey.toBase58()}:`, error);
      }
    }
    
    return holders;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    throw error;
  }
}

// Get active holders (public data)
export async function getActiveHolders(tokenMint: PublicKey, minBalance: number = 20000): Promise<Array<{
  address: string;
  balance: number;
  firstHoldTime?: Date;
  lastUpdated?: Date;
}>> {
  try {
    const holders = await getTokenHolders(tokenMint);
    
    // Filter by minimum balance
    return holders.filter(holder => holder.balance >= minBalance);
  } catch (error) {
    console.error('Error fetching active holders:', error);
    throw error;
  }
}

// Calculate holder weights (for distribution)
export function calculateHolderWeights(holders: Array<{
  address: string;
  balance: number;
  firstHoldTime?: Date;
  lastUpdated?: Date;
}>): Array<{
  address: string;
  balance: number;
  timeWeight: number;
  balanceWeight: number;
  totalWeight: number;
}> {
  const now = new Date();
  
  return holders.map(holder => {
    // Time weight calculation (based on how long they've held)
    let timeWeight = 1;
    if (holder.firstHoldTime) {
      const holdDuration = now.getTime() - holder.firstHoldTime.getTime();
      const daysHeld = holdDuration / (1000 * 60 * 60 * 24);
      
      // Time weight increases with holding duration
      if (daysHeld >= 7) timeWeight = 2; // 2x for 7+ days
      else if (daysHeld >= 3) timeWeight = 1.5; // 1.5x for 3+ days
      else if (daysHeld >= 1) timeWeight = 1.2; // 1.2x for 1+ days
    }
    
    // Balance weight (proportional to token balance)
    const balanceWeight = holder.balance;
    
    // Combined weight
    const totalWeight = balanceWeight * timeWeight;
    
    return {
      address: holder.address,
      balance: holder.balance,
      timeWeight,
      balanceWeight,
      totalWeight,
    };
  });
}

// Calculate distribution amounts
export function calculateDistribution(
  holders: Array<{
    address: string;
    balance: number;
    timeWeight: number;
    balanceWeight: number;
    totalWeight: number;
  }>,
  totalDistributionAmount: number
): Array<{
  address: string;
  balance: number;
  share: number;
  amount: number;
}> {
  const totalWeight = holders.reduce((sum, holder) => sum + holder.totalWeight, 0);
  
  return holders.map(holder => {
    const share = holder.totalWeight / totalWeight;
    const amount = totalDistributionAmount * share;
    
    return {
      address: holder.address,
      balance: holder.balance,
      share,
      amount,
    };
  });
}

// Test connection function
export async function testConnection() {
  return { success: true, message: 'Connection test' };
}