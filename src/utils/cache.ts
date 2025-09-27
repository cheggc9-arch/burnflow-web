import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getConnection, getCreatorWalletAddress, getTokenContractAddress } from './solana';
import { loadCacheFromFile, saveCacheToFile } from './cache-persistence';

// Cache interface
interface CacheData {
  treasuryBalance: number;
  activeHolders: number;
  lastUpdated: number;
  isUpdating: boolean;
}

// Holder cache interface
interface HolderCacheData {
  holders: any[];
  totalHolders: number;
  lastUpdated: number;
  isUpdating: boolean;
}

// Global cache - using a more persistent approach
let cache: CacheData = {
  treasuryBalance: 0,
  activeHolders: 0,
  lastUpdated: 0,
  isUpdating: false
};

// Try to load cache from file first
const fileCache = loadCacheFromFile();
if (fileCache) {
  cache = fileCache;
}

// Ensure cache is not reset on module reloads
if (typeof global !== 'undefined') {
  // @ts-ignore
  if (!global.__hold2earn_cache) {
    // @ts-ignore
    global.__hold2earn_cache = cache;
  } else {
    // @ts-ignore
    cache = global.__hold2earn_cache;
  }
}

// Holder cache - using a more persistent approach
let holderCache: HolderCacheData = {
  holders: [],
  totalHolders: 0,
  lastUpdated: 0,
  isUpdating: false
};

// Ensure holder cache is not reset on module reloads
if (typeof global !== 'undefined') {
  // @ts-ignore
  if (!global.__hold2earn_holder_cache) {
    // @ts-ignore
    global.__hold2earn_holder_cache = holderCache;
  } else {
    // @ts-ignore
    holderCache = global.__hold2earn_holder_cache;
  }
}

// Cache update function
export async function updateCache(): Promise<void> {
  if (cache.isUpdating) {
    console.log('⏳ Cache update already in progress, skipping...');
    return;
  }

  try {
    cache.isUpdating = true;
    const start = Date.now();
    console.log('🔄 Fetching: Treasury balance + Active holders count');

    const connection = getConnection();
    const creatorAddress = getCreatorWalletAddress();
    const tokenMint = getTokenContractAddress();

    // 2 parallel RPC calls - FAST and efficient
    const [treasuryBalance, tokenAccounts] = await Promise.all([
      connection.getBalance(creatorAddress),
      connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
          { dataSize: 165 }, // Token account data size
          {
            memcmp: {
              offset: 0, // Mint address offset
              bytes: tokenMint.toBase58(),
            },
          },
        ],
        dataSlice: { offset: 64, length: 8 }, // Only fetch amount field (8 bytes)
      })
    ]);

    // Filter for active holders only (balance > 0)
    const activeHolders = tokenAccounts.filter(({ account }) => {
      try {
        const amount = account.data.readBigUInt64LE(0);
        return Number(amount) > 0;
      } catch {
        return false;
      }
    });

    // Store old values for comparison
    const oldTreasuryBalance = cache.treasuryBalance;
    const oldActiveHolders = cache.activeHolders;

    // Update cache with new data
    cache.treasuryBalance = treasuryBalance / LAMPORTS_PER_SOL;
    cache.activeHolders = activeHolders.length;
    cache.lastUpdated = Date.now();
    cache.isUpdating = false;

    // Log updates if data changed
    const treasuryChanged = cache.treasuryBalance !== oldTreasuryBalance;
    const holdersChanged = cache.activeHolders !== oldActiveHolders;
    
    if (treasuryChanged || holdersChanged) {
      console.log(`✅ Updated: ${cache.treasuryBalance.toFixed(4)} SOL, ${cache.activeHolders} holders`);
    } else {
      console.log(`👥 No changes: ${cache.treasuryBalance.toFixed(4)} SOL, ${cache.activeHolders} holders`);
    }

    // Save cache to file for persistence
    saveCacheToFile(cache);

  } catch (error) {
    console.error('Cache update failed:', error);
    cache.isUpdating = false;
  }
}

// Holder cache update function (disabled - not needed for basic functionality)
export async function updateHolderCache(): Promise<void> {
  // TODO: Implement when distribution logic is added
  // For now, just return mock data
  holderCache.holders = [];
  holderCache.totalHolders = 0;
  holderCache.lastUpdated = Date.now();
  holderCache.isUpdating = false;
}

// Get cached data
export function getCachedData(): CacheData {
  return { ...cache };
}

// Get holder cached data
export function getHolderCachedData(): HolderCacheData {
  return { ...holderCache };
}

// Check if cache is stale (older than 2 minutes)
export function isCacheStale(): boolean {
  const now = Date.now();
  const cacheAge = now - cache.lastUpdated;
  return cacheAge > 2 * 60 * 1000; // 2 minutes
}

// Check if holder cache is stale (older than 5 minutes)
export function isHolderCacheStale(): boolean {
  const now = Date.now();
  const cacheAge = now - holderCache.lastUpdated;
  return cacheAge > 5 * 60 * 1000; // 5 minutes
}

// Initialize background job
export function startBackgroundJob(): void {
  // Initial cache update immediately
  updateCache().catch((error) => {
    console.error('Initial cache update failed:', error);
  });
  
  updateHolderCache().catch((error) => {
    console.error('Initial holder cache update failed:', error);
  });
  
  // Set up interval for every 30 seconds (basic stats) - real-time updates
  setInterval(() => {
    updateCache();
  }, 30 * 1000);
  
  // Set up interval for every 5 minutes (holder data) - disabled for now
  setInterval(() => {
    updateHolderCache();
  }, 5 * 60 * 1000);
}
