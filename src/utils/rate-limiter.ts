/**
 * Rate limiter utility for Solana RPC calls
 * Implements exponential backoff and retry logic to handle rate limiting
 */

interface RateLimiterConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  jitter?: boolean;
}

export class RateLimiter {
  private config: RateLimiterConfig;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private minRequestInterval = 100; // Minimum 100ms between requests

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = {
      maxRetries: 5,
      baseDelay: 1000, // 1 second
      maxDelay: 30000, // 30 seconds
      backoffMultiplier: 2,
      jitter: true,
      ...config,
    };
  }

  /**
   * Execute a function with rate limiting and retry logic
   */
  async execute<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const config = { ...this.config, ...options };
    let lastError: Error;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        // Ensure minimum interval between requests
        await this.enforceMinInterval();
        
        const result = await fn();
        return result;
      } catch (error) {
        lastError = error as Error;
        
        // Check if it's a rate limit error
        if (this.isRateLimitError(error)) {
          if (attempt < config.maxRetries) {
            const delay = this.calculateDelay(attempt, config);
            console.log(`⏳ Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries + 1})`);
            await this.sleep(delay);
            continue;
          }
        } else {
          // Not a rate limit error, don't retry
          throw error;
        }
      }
    }

    throw new Error(`Rate limit exceeded after ${config.maxRetries + 1} attempts: ${lastError?.message}`);
  }

  /**
   * Queue a request to be executed with rate limiting
   */
  async queue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.execute(fn);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  /**
   * Process the request queue with rate limiting
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Request failed:', error);
        }
      }

      // Wait between requests
      await this.sleep(this.minRequestInterval);
    }

    this.isProcessing = false;
  }

  /**
   * Check if an error is a rate limit error
   */
  private isRateLimitError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message || error.toString();
    const errorCode = error.code;
    
    return (
      errorMessage.includes('429') ||
      errorMessage.includes('Too Many Requests') ||
      errorMessage.includes('rate limited') ||
      errorMessage.includes('rate limit') ||
      errorCode === -32429 ||
      errorCode === 429
    );
  }

  /**
   * Calculate delay for exponential backoff
   */
  private calculateDelay(attempt: number, config: RateLimiterConfig): number {
    let delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
    
    // Cap at max delay
    delay = Math.min(delay, config.maxDelay);
    
    // Add jitter to prevent thundering herd
    if (config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    return Math.floor(delay);
  }

  /**
   * Enforce minimum interval between requests
   */
  private async enforceMinInterval(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await this.sleep(waitTime);
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current queue status
   */
  getStatus() {
    return {
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      lastRequestTime: this.lastRequestTime,
    };
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter({
  maxRetries: 5,
  baseDelay: 2000, // 2 seconds
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  jitter: true,
});

/**
 * Utility function to execute RPC calls with rate limiting
 */
export async function withRateLimit<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return rateLimiter.execute(fn, options);
}

/**
 * Utility function to queue RPC calls
 */
export async function queueRpcCall<T>(fn: () => Promise<T>): Promise<T> {
  return rateLimiter.queue(fn);
}
