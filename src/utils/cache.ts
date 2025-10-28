import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getConnection, getCreatorWalletAddress, getTokenContractAddress } from './solana';
import { loadCacheFromFile, saveCacheToFile, CacheData } from './cache-persistence';
import { withRateLimit } from './rate-limiter';
import { rateLimitConfig } from '../config/rate-limiting';
import { supabase } from '../lib/supabase';

// Global variable to store token launch time (set once at startup)
let tokenLaunchTime: string | null = null;

// Function to get token launch time (simplified - no Bitquery)
export async function getTokenLaunchTime(tokenAddress: string): Promise<string> {
  try {
    console.log('🔄 Checking for existing token launch time in database');
    
    // Check if launch time exists in Supabase
    const { data: existingData, error: fetchError } = await supabase
      .from('token_metadata')
      .select('launch_time')
      .eq('token_address', tokenAddress)
      .single();

    if (!fetchError && existingData?.launch_time) {
      console.log(`✅ Using existing token launch time from database: ${existingData.launch_time}`);
      return existingData.launch_time;
    }

    // If not found in database, use current time as fallback
    const currentTime = new Date().toISOString();
    console.log(`⚠️ No launch time found in database, using current time: ${currentTime}`);
    
    // Save to database for future use
    try {
      await supabase
      .from('token_metadata')
      .upsert({
        token_address: tokenAddress,
          launch_time: currentTime,
          updated_at: new Date().toISOString()
        });
    } catch (dbError) {
      console.warn('⚠️ Could not save launch time to database:', dbError);
    }

    return currentTime;
    
  } catch (error) {
    console.error('❌ Error getting token launch time:', error);
    // Fallback to current time
    return new Date().toISOString();
  }
}

// Simplified holder data structure
interface HolderData {
  address: string;
  balance: number;
  firstHoldTime?: string;
}

// Global cache for treasury balance and active holders
let cache: CacheData = {
  treasuryBalance: 0,
  activeHolders: 0,
  lastUpdated: 0,
  isUpdating: false,
  lastDistributionTime: 0
};

// Load cache from file on startup
const loadedCache = loadCacheFromFile();
if (loadedCache) {
  cache = { ...cache, ...loadedCache };
  console.log('✅ Cache loaded from file:', cache);
}

// Function to get cached data
export function getCachedData(): CacheData {
  return cache;
}

// Function to check if cache is stale
export function isCacheStale(): boolean {
  const now = Date.now();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  return (now - cache.lastUpdated) > CACHE_DURATION;
}

// Function to update treasury balance
export async function updateTreasuryBalance(): Promise<void> {
  try {
    const connection = getConnection();
    const creatorWalletAddress = getCreatorWalletAddress();
    
    const balance = await connection.getBalance(creatorWalletAddress);
    const balanceInSOL = balance / LAMPORTS_PER_SOL;
    
    cache.treasuryBalance = balanceInSOL;
    cache.lastUpdated = Date.now();
    
    console.log(`✅ Treasury balance updated: ${balanceInSOL.toFixed(4)} SOL`);
    
    // Save to file
    saveCacheToFile(cache);
    
  } catch (error) {
    console.error('❌ Error updating treasury balance:', error);
  }
}

// Function to update active holders count (simplified)
export async function updateActiveHolders(): Promise<void> {
  try {
    console.log('🔄 Updating active holders...');
    const connection = getConnection();
    const tokenMint = getTokenContractAddress();

    console.log(`🔄 Token mint address: ${tokenMint.toBase58()}`);

    // Get token accounts for the mint
    const tokenAccounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
          filters: [
        {
          dataSize: 165, // Token account data size
        },
            {
              memcmp: {
            offset: 0,
                bytes: tokenMint.toBase58(),
              },
            },
          ],
    });

    console.log(`🔄 Found ${tokenAccounts.length} token accounts`);

    // Filter for active holders only (balance > 0)
    const activeHolders = tokenAccounts.filter(({ account }) => {
      try {
        const balance = account.data.readBigUInt64LE(64);
        return balance > 0;
      } catch (error) {
        console.warn('Error reading account balance:', error);
        return false;
      }
    });

    cache.activeHolders = activeHolders.length;
    cache.lastUpdated = Date.now();
    
    console.log(`✅ Active holders updated: ${activeHolders.length}`);
    
    // Save to file
    saveCacheToFile(cache);

  } catch (error) {
    console.error('❌ Error updating active holders:', error);
  }
}

// Function to update cache (simplified)
export async function updateCache(): Promise<void> {
  if (cache.isUpdating) {
    console.log('⏳ Cache update already in progress, skipping...');
    return;
  }

  try {
    cache.isUpdating = true;
    
    console.log('🔄 Updating cache...');
    
    // Update treasury balance and active holders in parallel
    await Promise.all([
      updateTreasuryBalance(),
      updateActiveHolders()
    ]);
    
    console.log('✅ Cache update completed');

  } catch (error) {
    console.error('❌ Error updating cache:', error);
  } finally {
    cache.isUpdating = false;
  }
}

// Background job function for cache updates
export function startBackgroundJob(): void {
  console.log('🔄 Starting background cache update job...');
  
  // Update cache immediately
  updateCache();
  
  // Set up interval for periodic updates (every 5 minutes)
  setInterval(() => {
    if (!cache.isUpdating) {
      console.log('🔄 Periodic cache update triggered...');
    updateCache();
    } else {
      console.log('⏳ Cache update already in progress, skipping periodic update...');
    }
  }, 5 * 60 * 1000); // 5 minutes
  
  console.log('✅ Background cache update job started');
}

// Export cache for external access
export { cache };