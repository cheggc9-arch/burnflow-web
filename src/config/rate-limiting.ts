/**
 * Rate limiting configuration for Solana RPC calls
 * Adjust these values based on your RPC provider's limits
 */

export interface RateLimitConfig {
  // Distribution service settings
  distribution: {
    batchSize: number;
    batchDelay: number;
    transactionDelay: number;
  };
  
  // Rate limiter settings
  rateLimiter: {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    jitter: boolean;
  };
  
  // RPC call specific settings
  rpcCalls: {
    getBalance: {
      maxRetries: number;
      baseDelay: number;
    };
    getLatestBlockhash: {
      maxRetries: number;
      baseDelay: number;
    };
    sendRawTransaction: {
      maxRetries: number;
      baseDelay: number;
    };
    confirmTransaction: {
      maxRetries: number;
      baseDelay: number;
    };
    getProgramAccounts: {
      maxRetries: number;
      baseDelay: number;
    };
  };
}

// Default configuration - conservative settings for most RPC providers
export const defaultRateLimitConfig: RateLimitConfig = {
  distribution: {
    batchSize: 5,           // Process 5 transactions per batch
    batchDelay: 5000,      // 5 second delay between batches
    transactionDelay: 1000, // 1 second delay between transactions
  },
  
  rateLimiter: {
    maxRetries: 5,
    baseDelay: 2000,        // 2 seconds
    maxDelay: 30000,        // 30 seconds
    backoffMultiplier: 2,
    jitter: true,
  },
  
  rpcCalls: {
    getBalance: {
      maxRetries: 3,
      baseDelay: 1000,
    },
    getLatestBlockhash: {
      maxRetries: 3,
      baseDelay: 1000,
    },
    sendRawTransaction: {
      maxRetries: 5,
      baseDelay: 2000,
    },
    confirmTransaction: {
      maxRetries: 3,
      baseDelay: 1000,
    },
    getProgramAccounts: {
      maxRetries: 3,
      baseDelay: 1000,
    },
  },
};

// Aggressive configuration for premium RPC providers
export const aggressiveRateLimitConfig: RateLimitConfig = {
  distribution: {
    batchSize: 10,          // Process 10 transactions per batch
    batchDelay: 2000,      // 2 second delay between batches
    transactionDelay: 500,  // 500ms delay between transactions
  },
  
  rateLimiter: {
    maxRetries: 3,
    baseDelay: 1000,        // 1 second
    maxDelay: 10000,        // 10 seconds
    backoffMultiplier: 1.5,
    jitter: true,
  },
  
  rpcCalls: {
    getBalance: {
      maxRetries: 2,
      baseDelay: 500,
    },
    getLatestBlockhash: {
      maxRetries: 2,
      baseDelay: 500,
    },
    sendRawTransaction: {
      maxRetries: 3,
      baseDelay: 1000,
    },
    confirmTransaction: {
      maxRetries: 2,
      baseDelay: 500,
    },
    getProgramAccounts: {
      maxRetries: 2,
      baseDelay: 500,
    },
  },
};

// Conservative configuration for free/public RPC providers
export const conservativeRateLimitConfig: RateLimitConfig = {
  distribution: {
    batchSize: 3,           // Process 3 transactions per batch
    batchDelay: 10000,      // 10 second delay between batches
    transactionDelay: 2000, // 2 second delay between transactions
  },
  
  rateLimiter: {
    maxRetries: 7,
    baseDelay: 5000,        // 5 seconds
    maxDelay: 60000,        // 60 seconds
    backoffMultiplier: 2.5,
    jitter: true,
  },
  
  rpcCalls: {
    getBalance: {
      maxRetries: 5,
      baseDelay: 2000,
    },
    getLatestBlockhash: {
      maxRetries: 5,
      baseDelay: 2000,
    },
    sendRawTransaction: {
      maxRetries: 7,
      baseDelay: 5000,
    },
    confirmTransaction: {
      maxRetries: 5,
      baseDelay: 2000,
    },
    getProgramAccounts: {
      maxRetries: 5,
      baseDelay: 2000,
    },
  },
};

// Get configuration based on environment or RPC provider
export function getRateLimitConfig(): RateLimitConfig {
  const rpcUrl = process.env.SOLANA_RPC_URL || '';
  
  // Check if using a premium RPC provider
  if (rpcUrl.includes('alchemy') || rpcUrl.includes('quicknode') || rpcUrl.includes('helius')) {
    return aggressiveRateLimitConfig;
  }
  
  // Check if using a free/public RPC provider
  if (rpcUrl.includes('api.mainnet-beta.solana.com') || rpcUrl.includes('api.devnet.solana.com')) {
    return conservativeRateLimitConfig;
  }
  
  // Default to conservative for unknown providers
  return conservativeRateLimitConfig;
}

// Export the active configuration
export const rateLimitConfig = getRateLimitConfig();
