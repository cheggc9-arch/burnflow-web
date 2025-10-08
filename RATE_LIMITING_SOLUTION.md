# Rate Limiting Solution for Solana RPC Calls

## Problem
The distribution service was experiencing rate limiting errors (429 Too Many Requests) when sending multiple transactions to Solana RPC endpoints. This was causing failed transactions and incomplete distributions.

## Root Causes
1. **Aggressive Batch Processing**: Processing 20 transactions per batch in parallel
2. **Insufficient Delays**: Only 2-second delays between batches
3. **No Retry Logic**: Disabled retries without implementing custom retry logic
4. **No Rate Limiting**: No built-in rate limiting for RPC calls

## Solution Overview

### 1. Rate Limiter Utility (`src/utils/rate-limiter.ts`)
- **Exponential Backoff**: Implements exponential backoff with jitter to prevent thundering herd
- **Retry Logic**: Automatic retry for rate limit errors with configurable parameters
- **Request Queuing**: Queue requests to prevent overwhelming the RPC endpoint
- **Error Detection**: Smart detection of rate limit errors (429, -32429, etc.)

### 2. Configuration System (`src/config/rate-limiting.ts`)
- **Multiple Configurations**: Conservative, default, and aggressive settings
- **RPC Provider Detection**: Automatically selects appropriate configuration based on RPC URL
- **Easy Adjustment**: Centralized configuration for easy tuning

### 3. Distribution Service Updates
- **Reduced Batch Size**: From 20 to 5 transactions per batch (configurable)
- **Increased Delays**: 5-second delays between batches, 1-second between transactions
- **Sequential Processing**: Changed from parallel to sequential processing within batches
- **Rate Limited RPC Calls**: All RPC calls now use rate limiting

### 4. Updated RPC Configuration
- **Enabled Retries**: Re-enabled retries with custom rate limiting
- **User Agent**: Added proper User-Agent header
- **Rate Limited Calls**: All utility functions now use rate limiting

## Configuration Options

### Conservative (Free/Public RPC)
```typescript
{
  batchSize: 3,
  batchDelay: 10000,      // 10 seconds
  transactionDelay: 2000,  // 2 seconds
  maxRetries: 7,
  baseDelay: 5000,         // 5 seconds
  maxDelay: 60000,         // 60 seconds
}
```

### Default (Most RPC Providers)
```typescript
{
  batchSize: 5,
  batchDelay: 5000,        // 5 seconds
  transactionDelay: 1000,  // 1 second
  maxRetries: 5,
  baseDelay: 2000,         // 2 seconds
  maxDelay: 30000,         // 30 seconds
}
```

### Aggressive (Premium RPC Providers)
```typescript
{
  batchSize: 10,
  batchDelay: 2000,        // 2 seconds
  transactionDelay: 500,   // 500ms
  maxRetries: 3,
  baseDelay: 1000,         // 1 second
  maxDelay: 10000,         // 10 seconds
}
```

## Key Features

### 1. Smart Error Detection
```typescript
private isRateLimitError(error: any): boolean {
  const errorMessage = error.message || error.toString();
  const errorCode = error.code;
  
  return (
    errorMessage.includes('429') ||
    errorMessage.includes('Too Many Requests') ||
    errorMessage.includes('rate limited') ||
    errorCode === -32429 ||
    errorCode === 429
  );
}
```

### 2. Exponential Backoff with Jitter
```typescript
private calculateDelay(attempt: number, config: RateLimiterConfig): number {
  let delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
  delay = Math.min(delay, config.maxDelay);
  
  if (config.jitter) {
    delay = delay * (0.5 + Math.random() * 0.5);
  }
  
  return Math.floor(delay);
}
```

### 3. Request Queuing
```typescript
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
```

## Usage Examples

### Basic Rate Limited Call
```typescript
const result = await withRateLimit(
  () => connection.getBalance(address),
  { maxRetries: 3, baseDelay: 1000 }
);
```

### Using Configuration
```typescript
const result = await withRateLimit(
  () => connection.sendRawTransaction(transaction.serialize()),
  rateLimitConfig.rpcCalls.sendRawTransaction
);
```

### Queued Requests
```typescript
const result = await queueRpcCall(
  () => connection.confirmTransaction(signature)
);
```

## Monitoring and Debugging

### Rate Limiter Status
```typescript
const status = rateLimiter.getStatus();
console.log('Queue length:', status.queueLength);
console.log('Is processing:', status.isProcessing);
```

### Logging
The system provides detailed logging for:
- Rate limit detection and retries
- Batch processing progress
- Transaction delays
- Error details

## Performance Impact

### Before (Aggressive)
- 20 transactions per batch
- Parallel processing
- 2-second batch delays
- No retry logic
- **Result**: High failure rate due to rate limiting

### After (Conservative)
- 5 transactions per batch
- Sequential processing
- 5-second batch delays + 1-second transaction delays
- Smart retry logic
- **Result**: Reliable processing with minimal failures

## Recommendations

### 1. For Production
- Use conservative settings for free RPC providers
- Monitor failure rates and adjust if needed
- Consider upgrading to premium RPC providers for better limits

### 2. For Development
- Use default settings for most RPC providers
- Enable detailed logging for debugging
- Test with small batches first

### 3. For High-Volume
- Use aggressive settings only with premium RPC providers
- Monitor rate limit headers if available
- Consider implementing request prioritization

## Environment Variables

The system automatically detects RPC providers based on URL patterns:
- `alchemy`, `quicknode`, `helius` → Aggressive settings
- `api.mainnet-beta.solana.com` → Conservative settings
- Others → Conservative settings (safe default)

## Testing

To test the rate limiting solution:

1. **Small Test**: Run with 1-2 transactions first
2. **Monitor Logs**: Watch for rate limit errors and retries
3. **Adjust Settings**: Modify configuration if needed
4. **Scale Up**: Gradually increase batch sizes

## Troubleshooting

### Still Getting Rate Limited?
1. Check your RPC provider's actual limits
2. Increase delays in configuration
3. Reduce batch size further
4. Consider switching to premium RPC provider

### Too Slow?
1. Verify you're using a premium RPC provider
2. Try aggressive configuration
3. Monitor for any remaining rate limits
4. Consider request prioritization

## Future Improvements

1. **Dynamic Rate Limiting**: Adjust based on RPC response headers
2. **Request Prioritization**: Prioritize critical transactions
3. **Multiple RPC Endpoints**: Load balance across multiple providers
4. **Circuit Breaker**: Temporarily stop requests if rate limited too frequently
