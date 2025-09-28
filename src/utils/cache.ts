import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getConnection, getCreatorWalletAddress, getTokenContractAddress } from './solana';
import { loadCacheFromFile, saveCacheToFile } from './cache-persistence';

// Function to fetch holder data from Bitquery using two-step process
async function fetchHolderDataFromAPI(tokenAddress: string) {
  try {
    console.log('🔄 Fetching: Token holder data from Bitquery API (2-step process)');
    
    // Step 1: Query A - Get current token balances
    const queryA = `
      query {
        Solana(dataset: realtime, network: solana, aggregates: yes) {
          BalanceUpdates(
            limit: { count: 10000 }
            orderBy: { descendingByField: "BalanceUpdate_Holding_maximum" }
            where: {
              BalanceUpdate: {
                Currency: { MintAddress: { is: "${tokenAddress}" } }
              }
              Transaction: { Result: { Success: true } }
            }
          ) {
            BalanceUpdate {
              Account { Token { Owner } }
              Holding: PostBalance(
                maximum: Block_Slot
                selectWhere: { gt: "20000", lt: "100000000" }
              )
            }
          }
        }
      }
    `;

    const responseA = await fetch('https://streaming.bitquery.io/eap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query: queryA })
    });

    if (!responseA.ok) {
      throw new Error(`Bitquery Query A error: ${responseA.status}`);
    }

    const dataA = await responseA.json();
    
    if (dataA.errors) {
      throw new Error(`Bitquery Query A GraphQL error: ${JSON.stringify(dataA.errors)}`);
    }

    // Create hashmap from Query A results
    const holdersMap = new Map<string, { tokens: number; first_buy_time: string }>();
    const balanceUpdates = dataA.data?.Solana?.BalanceUpdates || [];
    
    // Initialize hashmap with high future time
    const futureTime = "2099-12-31T23:59:59Z";
    
    balanceUpdates.forEach((update: any) => {
      const owner = update.BalanceUpdate.Account.Token.Owner;
      const tokens = parseFloat(update.BalanceUpdate.Holding);
      holdersMap.set(owner, {
        tokens: tokens,
        first_buy_time: futureTime
      });
    });

    console.log(`✅ Query A: Found ${holdersMap.size} token holders`);

    // Step 2: Query B - Get first buy times for all holders
    const holderAddresses = Array.from(holdersMap.keys());
    
    if (holderAddresses.length === 0) {
      console.log('⚠️ No holders found in Query A, skipping Query B');
      return [];
    }

    // Split addresses into chunks if too many (Bitquery has limits)
    const chunkSize = 50; // Conservative chunk size
    const addressChunks = [];
    for (let i = 0; i < holderAddresses.length; i += chunkSize) {
      addressChunks.push(holderAddresses.slice(i, i + chunkSize));
    }

    // Process each chunk
    for (const chunk of addressChunks) {
      const queryB = `
        query {
          Solana(dataset: realtime, network: solana) {
            DEXTrades(
              where: {
                Transaction: { Result: { Success: true } }
                Trade: {
                  Buy: {
                    Currency: { MintAddress: { is: "${tokenAddress}" } }
                    Account: { Token: { Owner: { in: [${chunk.map(addr => `"${addr}"`).join(', ')}] } } }
                  }
                }
              }
              orderBy: { ascending: Block_Time }
              limit: { count: 100000 }
            ) {
              Trade { Buy { Account { Token { Owner } } } }
              Block { Time }
            }
          }
        }
      `;

      const responseB = await fetch('https://streaming.bitquery.io/eap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ query: queryB })
      });

      if (!responseB.ok) {
        console.warn(`Bitquery Query B error for chunk: ${responseB.status}`);
        continue;
      }

      const dataB = await responseB.json();
      
      if (dataB.errors) {
        console.warn(`Bitquery Query B GraphQL error for chunk: ${JSON.stringify(dataB.errors)}`);
        continue;
      }

      // Update first_buy_time for each holder
      const dexTrades = dataB.data?.Solana?.DEXTrades || [];
      
      dexTrades.forEach((trade: any) => {
        const owner = trade.Trade.Buy.Account.Token.Owner;
        const buyTime = trade.Block.Time;
        
        if (holdersMap.has(owner)) {
          const currentData = holdersMap.get(owner)!;
          if (buyTime < currentData.first_buy_time) {
            currentData.first_buy_time = buyTime;
          }
        }
      });

      console.log(`✅ Query B: Processed ${dexTrades.length} trades for chunk`);
    }

    // Filter out holders with invalid first_buy_time (future dates = no trades found)
    const currentDate = new Date();
    const validHolders = Array.from(holdersMap.entries()).filter(([address, data]) => {
      const firstBuyTime = new Date(data.first_buy_time);
      return firstBuyTime <= currentDate; // Only include holders with real buy times
    });

    console.log(`🔍 Filtered out ${holdersMap.size - validHolders.length} holders with invalid buy times`);

    // Save only valid holders to JSON file for debugging/monitoring
    const hashmapData: Record<string, { tokens: number; first_buy_time: string }> = {};
    validHolders.forEach(([address, data]) => {
      hashmapData[address] = {
        tokens: data.tokens,
        first_buy_time: data.first_buy_time
      };
    });

    // Write hashmap to JSON file
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'holders-hashmap.json');
      fs.writeFileSync(filePath, JSON.stringify(hashmapData, null, 2));
      console.log(`📄 Hashmap saved to holders-hashmap.json with ${Object.keys(hashmapData).length} valid holders`);
    } catch (error) {
      console.warn('Failed to save hashmap to JSON file:', error);
    }

    // Convert hashmap to array format expected by the rest of the code
    const processedHolders = validHolders.map(([address, data]) => {
      const firstHoldTime = new Date(data.first_buy_time);
      const now = new Date();
      const holdDuration = now.getTime() - firstHoldTime.getTime();
      const daysHeld = holdDuration / (1000 * 60 * 60 * 24);
      
      return {
        address: address,
        balance: data.tokens,
        firstHoldTime: firstHoldTime.toISOString(),
        lastUpdated: new Date().toISOString(),
        daysHeld: Math.floor(daysHeld)
      };
    });

    console.log(`✅ Retrieved ${processedHolders.length} holders with accurate first buy times`);
    return processedHolders;
    
  } catch (error) {
    console.error('Bitquery API error:', error);
    return [];
  }
}

// Cache interface
interface CacheData {
  treasuryBalance: number;
  activeHolders: number;
  lastUpdated: number;
  isUpdating: boolean;
}

// Holder cache interface
interface HolderCacheData {
  holders: {
    topHolders: any[];
    earlyAdopters: any[];
    diamondHands: any[];
    allHolders: any[];
  };
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
  holders: {
    topHolders: [],
    earlyAdopters: [],
    diamondHands: [],
    allHolders: []
  },
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

// Holder cache update function (runs every 5 minutes) - NOW USING PROFESSIONAL APIs WITH RPC FALLBACK
export async function updateHolderCache(): Promise<void> {
  if (holderCache.isUpdating) {
    console.log('⏳ Holder cache update already in progress, skipping...');
    return;
  }

  try {
    holderCache.isUpdating = true;
    console.log('🔄 Fetching: Professional holder data from APIs');

    const tokenMint = getTokenContractAddress();
    
    // Try to get professional holder data from APIs first
    const apiHolders = await fetchHolderDataFromAPI(tokenMint.toBase58());
    
    let holders = [];
    
    if (apiHolders.length > 0) {
      // Process Bitquery Pump.fun data (real holder data with actual holding times)
      holders = apiHolders.map((holder: any, index: number) => {
        // Use real first hold time from Bitquery data
        const firstHoldTime = new Date(holder.firstHoldTime);
        const now = new Date();
        const holdDuration = now.getTime() - firstHoldTime.getTime();
        const daysHeld = holdDuration / (1000 * 60 * 60 * 24);
        
        // Calculate weights based on real holding duration
        let timeWeight = 1;
        if (daysHeld >= 7) timeWeight = 2;
        else if (daysHeld >= 3) timeWeight = 1.5;
        else if (daysHeld >= 1) timeWeight = 1.2;
        
        const balanceWeight = Math.log10(holder.balance / 20000 + 1);
        const totalWeight = balanceWeight * timeWeight;
        
        return {
          address: holder.address,
          balance: holder.balance,
          firstHoldTime: holder.firstHoldTime,
          lastUpdated: holder.lastUpdated,
          timeWeight,
          balanceWeight,
          totalWeight,
          daysHeld: Math.floor(daysHeld)
        };
      });
      
      console.log(`✅ Using Bitquery Pump.fun data: ${holders.length} real holders with actual holding times`);
    } else {
      // No API data available - skip holder cache update
      console.log('⚠️ No Bitquery Pump.fun data available, skipping holder update');
      holderCache.isUpdating = false;
      return;
    }

    // Sort and get top 15 for each category
    const topHolders = [...holders]
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 15)
      .map((holder, index) => ({ ...holder, rank: index + 1, category: 'balance' }));

    const earlyAdopters = [...holders]
      .sort((a, b) => new Date(a.firstHoldTime).getTime() - new Date(b.firstHoldTime).getTime())
      .slice(0, 15)
      .map((holder, index) => ({ ...holder, rank: index + 1, category: 'early' }));

    const diamondHands = [...holders]
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 15)
      .map((holder, index) => ({ ...holder, rank: index + 1, category: 'duration' }));

    holderCache.holders = {
      topHolders,
      earlyAdopters,
      diamondHands,
      allHolders: holders
    };
    holderCache.totalHolders = holders.length;
    holderCache.lastUpdated = Date.now();
    holderCache.isUpdating = false;

    console.log(`✅ Updated: ${holders.length} holders, top 15 for each category`);

  } catch (error) {
    console.error('Holder cache update failed:', error);
    holderCache.isUpdating = false;
  }
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
  
  // Set up interval for every 5 minutes (holder data) - using Solscan API
  setInterval(() => {
    updateHolderCache();
  }, 5 * 60 * 1000);
}