import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getConnection, getCreatorWalletAddress, getTokenContractAddress } from './solana';
import { loadCacheFromFile, saveCacheToFile, CacheData } from './cache-persistence';

// Global variable to store token launch time (set once at startup)
let tokenLaunchTime: string | null = null;

// Function to get token launch time (run once at startup)
async function getTokenLaunchTime(tokenAddress: string): Promise<string> {
  try {
    console.log('🔄 Fetching: Token launch time from Bitquery API');
    
    const launchQuery = `
      query {
        Solana(dataset: realtime, network: solana) {
          DEXTrades(
            where: {
              Transaction: { Result: { Success: true } }
              Trade: {
                Buy: { Currency: { MintAddress: { is: "${tokenAddress}" } } }
              }
            }
            orderBy: { ascending: Block_Time }
            limit: { count: 1 }
          ) {
            Block { Time }
            Trade {
              Buy {
                Amount
                Account { Token { Owner } }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://streaming.bitquery.io/eap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query: launchQuery })
    });

    if (!response.ok) {
      throw new Error(`Launch time query error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Launch time GraphQL error: ${JSON.stringify(data.errors)}`);
    }

    const launchTime = data.data?.Solana?.DEXTrades?.[0]?.Block?.Time;
    
    if (!launchTime) {
      throw new Error('No launch time found');
    }

    console.log(`✅ Token launch time: ${launchTime}`);
    
    // Save launch time to JSON file
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'token-launch-time.json');
      const launchData = {
        launchTime: launchTime,
        tokenAddress: tokenAddress,
        fetchedAt: new Date().toISOString()
      };
      fs.writeFileSync(filePath, JSON.stringify(launchData, null, 2));
      console.log(`📄 Launch time saved to token-launch-time.json`);
    } catch (error) {
      console.warn('Failed to save launch time to JSON file:', error);
    }
    
    return launchTime;
    
  } catch (error) {
    console.error('Error fetching launch time:', error);
    throw error;
  }
}

// Function to fetch holder data from Bitquery using two-step process
async function fetchHolderDataFromAPI(tokenAddress: string) {
  try {
    console.log('🔄 Fetching: Token holder data from Bitquery API (2-step process)');
    
    // Get the minimum balance threshold from environment variable
    const minBalance = process.env.MIN_HOLDER_BALANCE || "1000000";
    
    console.log(`🔍 Using token address: ${tokenAddress}`);
    console.log(`🔍 Using min balance: ${minBalance}`);
    
     // Step 1: Query A - Get current token balances (using exact sample query)
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
                 selectWhere: { gt: "${minBalance}", lt: "100000000" }
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
    const holdersMap = new Map<string, { tokens: number; first_buy_time: string; weightage: number }>();
    const balanceUpdates = dataA.data?.Solana?.BalanceUpdates || [];
    
    // Initialize hashmap with high future time
    const futureTime = "2099-12-31T23:59:59Z";
    
     balanceUpdates.forEach((update: any) => {
       const owner = update.BalanceUpdate.Account.Token.Owner;
       const tokens = parseFloat(update.BalanceUpdate.Holding);
       console.log(`🔍 Initial holder: ${owner}, tokens: ${tokens}`);
       
       holdersMap.set(owner, {
         tokens: tokens,
         first_buy_time: futureTime,
         weightage: 0 // Will be calculated after Query B
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

      // Debug: Log the response structure
      console.log(`🔍 Query B response for chunk:`, {
        hasData: !!dataB.data,
        hasSolana: !!dataB.data?.Solana,
        hasDEXTrades: !!dataB.data?.Solana?.DEXTrades,
        tradesCount: dataB.data?.Solana?.DEXTrades?.length || 0,
        chunkSize: chunk.length,
        chunkAddresses: chunk
      });

      // Update first_buy_time for each holder
      const dexTrades = dataB.data?.Solana?.DEXTrades || [];
      
       dexTrades.forEach((trade: any) => {
         const owner = trade.Trade.Buy.Account.Token.Owner;
         const buyTime = trade.Block.Time;
         
         console.log(`🔍 Trade found: ${owner}, buyTime: ${buyTime}`);
         
         if (holdersMap.has(owner)) {
           const currentData = holdersMap.get(owner)!;
           console.log(`🔍 Before update: ${owner}, current first_buy_time: ${currentData.first_buy_time}`);
           
           if (buyTime < currentData.first_buy_time) {
             currentData.first_buy_time = buyTime;
             console.log(`🔍 Updated: ${owner}, new first_buy_time: ${buyTime}`);
           }
         }
       });

      console.log(`✅ Query B: Processed ${dexTrades.length} trades for chunk`);
    }

    // Fallback system: Use token launch time for holders without trade data
    const currentDate = new Date();
    console.log(`🔍 Current time: ${currentDate.toISOString()}`);
    
    let fallbackCount = 0;
    const validHolders = Array.from(holdersMap.entries()).map(([address, data]) => {
      // If no trade data found (future time), use token launch time as fallback
      if (data.first_buy_time === futureTime) {
        console.log(`🔄 Using fallback: ${address} -> token launch time (${tokenLaunchTime})`);
        data.first_buy_time = tokenLaunchTime || futureTime;
        fallbackCount++;
      }
      return [address, data] as [string, typeof data];
    });

    console.log(`✅ Applied fallback for ${fallbackCount} holders without trade data`);

    // Calculate weightage for each holder BEFORE saving to JSON
    console.log(`🔍 Token launch time: ${tokenLaunchTime}`);
    if (tokenLaunchTime) {
      let calculatedCount = 0;
      let futureTimeCount = 0;
      holdersMap.forEach((data, address) => {
        if (data.first_buy_time !== futureTime) {
          data.weightage = calculateWeightage(data.tokens, data.first_buy_time, tokenLaunchTime!);
          if (data.weightage > 0) calculatedCount++;
        } else {
          futureTimeCount++;
        }
      });
      console.log(`✅ Calculated weightage for ${calculatedCount} holders (${futureTimeCount} had future timestamps)`);
    } else {
      console.warn('⚠️ No token launch time available - weightage will be 0');
    }

    // Save only valid holders to JSON file for debugging/monitoring
    const hashmapData: Record<string, { tokens: number; first_buy_time: string; weightage: number }> = {};
    validHolders.forEach(([address, data]) => {
      hashmapData[address] = {
        tokens: data.tokens,
        first_buy_time: data.first_buy_time,
        weightage: data.weightage
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
        daysHeld: Math.floor(daysHeld),
        weightage: data.weightage
      };
    });


    console.log(`✅ Retrieved ${processedHolders.length} holders with accurate first buy times and weightage`);
    return processedHolders;
    
  } catch (error) {
    console.error('Bitquery API error:', error);
    return [];
  }
}

// Function to calculate weightage based on new formula
function calculateWeightage(tokens: number, firstBuyTime: string, launchTime: string): number {
  try {
    const launch = new Date(launchTime);
    const firstBuy = new Date(firstBuyTime);
    const now = new Date();
    
    // Only include holders with balance ≥ minimum threshold
    const minBalance = parseInt(process.env.MIN_HOLDER_BALANCE || "1000000");
    if (tokens < minBalance) {
      return 0;
    }
    
    // 1. Balance Weight (commitment)
    const balanceWeight = 1 + Math.log10(tokens / minBalance);
    
    // 2. Earlyness Bonus (timing)
    const daysSinceLaunch = (firstBuy.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24);
    const earlyBonus = 1 + 2 * Math.exp(-daysSinceLaunch / 2);
    
    // 3. Tenure Bonus (loyalty)
    const daysHeld = (now.getTime() - firstBuy.getTime()) / (1000 * 60 * 60 * 24);
    const tenureBonus = 1 + 0.6 * Math.log2(daysHeld + 1);
    
    // 4. Total Weight
    const timeWeight = earlyBonus * tenureBonus;
    const totalWeight = balanceWeight * timeWeight;
    
    // Debug logging for first few calculations
    if (Math.random() < 0.05) { // Log 5% of calculations to see what's happening
      console.log(`🔍 Weightage calc: tokens=${tokens}, daysSinceLaunch=${daysSinceLaunch.toFixed(2)}, daysHeld=${daysHeld.toFixed(2)}, balanceWeight=${balanceWeight.toFixed(2)}, earlyBonus=${earlyBonus.toFixed(2)}, tenureBonus=${tenureBonus.toFixed(2)}, totalWeight=${totalWeight.toFixed(2)}`);
    }
    
    return totalWeight;
    
  } catch (error) {
    console.error('Error calculating weightage:', error);
    return 0;
  }
}

// Cache interface is now imported from cache-persistence.ts

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
  isUpdating: false,
  lastDistributionTime: 0
};

// Try to load cache from file first
const fileCache = loadCacheFromFile();
if (fileCache) {
  // Ensure all required properties exist
  cache = {
    treasuryBalance: fileCache.treasuryBalance || 0,
    activeHolders: fileCache.activeHolders || 0,
    lastUpdated: fileCache.lastUpdated || 0,
    isUpdating: fileCache.isUpdating || false,
    lastDistributionTime: fileCache.lastDistributionTime || 0
  };
}

// Ensure cache is not reset on module reloads
if (typeof global !== 'undefined') {
  // @ts-ignore
  if (!global.__rewardflow_cache) {
    // @ts-ignore
    global.__rewardflow_cache = cache;
  } else {
    // @ts-ignore
    cache = global.__rewardflow_cache;
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
  if (!global.__rewardflow_holder_cache) {
    // @ts-ignore
    global.__rewardflow_holder_cache = holderCache;
  } else {
    // @ts-ignore
    holderCache = global.__rewardflow_holder_cache;
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
        
        // Use the weightage calculated by the new formula from fetchHolderDataFromAPI
        const weightage = holder.weightage || 0;
        
        return {
          address: holder.address,
          balance: holder.balance,
          firstHoldTime: holder.firstHoldTime,
          lastUpdated: holder.lastUpdated,
          weightage: weightage,
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
      .sort((a, b) => (b.weightage || 0) - (a.weightage || 0))
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

// Function to update last distribution time (call this when you run your distribution script)
export function updateLastDistributionTime(): void {
  cache.lastDistributionTime = Date.now();
  cache.lastUpdated = Date.now();
  
  // Save to file for persistence
  saveCacheToFile(cache);
  
  console.log(`🎯 Distribution completed at: ${new Date(cache.lastDistributionTime).toISOString()}`);
}

// Function to initialize distribution time if not set
function initializeDistributionTime(): void {
  if (cache.lastDistributionTime === 0) {
    // Set initial distribution time to current time
    cache.lastDistributionTime = Date.now();
    saveCacheToFile(cache);
    console.log(`🎯 Initial distribution time set: ${new Date(cache.lastDistributionTime).toISOString()}`);
  }
}

// Initialize background job
export async function startBackgroundJob(): Promise<void> {
  // Initialize distribution time if not set
  initializeDistributionTime();
  
  // Get token launch time once at startup
  try {
    const tokenMint = getTokenContractAddress();
    tokenLaunchTime = await getTokenLaunchTime(tokenMint.toBase58());
    console.log(`🎯 Token launch time set: ${tokenLaunchTime}`);
  } catch (error) {
    console.error('Failed to get token launch time:', error);
    // Continue without launch time - weightage will be 0
  }
  
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