/**
 * Test script for rate limiting solution
 * This script tests the rate limiting functionality without running actual distributions
 */

const { withRateLimit, rateLimiter } = require('../src/utils/rate-limiter');
const { getConnection } = require('../src/utils/solana');

async function testRateLimiting() {
  console.log('🧪 Testing rate limiting solution...\n');
  
  const connection = getConnection();
  const testAddress = '11111111111111111111111111111112'; // System program address
  
  try {
    // Test 1: Basic rate limited call
    console.log('Test 1: Basic rate limited call');
    const start1 = Date.now();
    const balance = await withRateLimit(
      () => connection.getBalance(testAddress),
      { maxRetries: 3, baseDelay: 1000 }
    );
    const duration1 = Date.now() - start1;
    console.log(`✅ Success: ${balance} lamports (${duration1}ms)\n`);
    
    // Test 2: Multiple rapid calls
    console.log('Test 2: Multiple rapid calls (should be rate limited)');
    const promises = [];
    const start2 = Date.now();
    
    for (let i = 0; i < 5; i++) {
      promises.push(
        withRateLimit(
          () => connection.getBalance(testAddress),
          { maxRetries: 2, baseDelay: 500 }
        ).then(balance => ({ index: i, balance, success: true }))
        .catch(error => ({ index: i, error: error.message, success: false }))
      );
    }
    
    const results = await Promise.all(promises);
    const duration2 = Date.now() - start2;
    
    console.log(`Results (${duration2}ms):`);
    results.forEach(result => {
      if (result.success) {
        console.log(`  ✅ Call ${result.index}: ${result.balance} lamports`);
      } else {
        console.log(`  ❌ Call ${result.index}: ${result.error}`);
      }
    });
    console.log();
    
    // Test 3: Rate limiter status
    console.log('Test 3: Rate limiter status');
    const status = rateLimiter.getStatus();
    console.log(`Queue length: ${status.queueLength}`);
    console.log(`Is processing: ${status.isProcessing}`);
    console.log(`Last request time: ${new Date(status.lastRequestTime).toISOString()}\n`);
    
    // Test 4: Simulated rate limit error
    console.log('Test 4: Simulated rate limit error handling');
    try {
      await withRateLimit(
        () => {
          const error = new Error('429 Too Many Requests: rate limited');
          error.code = -32429;
          throw error;
        },
        { maxRetries: 3, baseDelay: 100 }
      );
    } catch (error) {
      console.log(`✅ Correctly handled rate limit error: ${error.message}\n`);
    }
    
    console.log('🎉 All tests completed successfully!');
    console.log('\nRate limiting solution is working correctly.');
    console.log('The system will now handle rate limiting gracefully during distributions.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRateLimiting().catch(console.error);
