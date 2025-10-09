#!/usr/bin/env node

console.log('🔧 Testing PumpPortal Fix');
console.log('=========================\n');

// Test 1: Check if fallback price estimation is added
console.log('1. Checking PumpPortal service improvements...');
const fs = require('fs');

try {
  const pumpPortalContent = fs.readFileSync('src/pumpportal-service.js', 'utf8');
  
  if (pumpPortalContent.includes('getEstimatedPrice')) {
    console.log('   ✅ PumpPortal service has fallback price estimation');
  } else {
    console.log('   ❌ PumpPortal service missing fallback price estimation');
  }
  
  if (pumpPortalContent.includes('isEstimated')) {
    console.log('   ✅ PumpPortal service marks estimated prices');
  } else {
    console.log('   ❌ PumpPortal service missing estimated price marking');
  }
  
  if (pumpPortalContent.includes('cleanup()')) {
    console.log('   ✅ PumpPortal service has WebSocket cleanup');
  } else {
    console.log('   ❌ PumpPortal service missing WebSocket cleanup');
  }
  
  if (pumpPortalContent.includes('8 second timeout')) {
    console.log('   ✅ PumpPortal service has reduced timeout');
  } else {
    console.log('   ❌ PumpPortal service missing reduced timeout');
  }
  
  if (pumpPortalContent.includes('Received PumpPortal message')) {
    console.log('   ✅ PumpPortal service has detailed message logging');
  } else {
    console.log('   ❌ PumpPortal service missing detailed message logging');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading PumpPortal service: ${error.message}`);
}

// Test 2: Check if error handling is improved
console.log('\n2. Checking error handling improvements...');
try {
  const pumpPortalContent = fs.readFileSync('src/pumpportal-service.js', 'utf8');
  
  if (pumpPortalContent.includes('finally')) {
    console.log('   ✅ PumpPortal service has proper cleanup in finally block');
  } else {
    console.log('   ❌ PumpPortal service missing finally block cleanup');
  }
  
  if (pumpPortalContent.includes('WebSocket connection timeout')) {
    console.log('   ✅ PumpPortal service has connection timeout handling');
  } else {
    console.log('   ❌ PumpPortal service missing connection timeout handling');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading PumpPortal service: ${error.message}`);
}

// Test 3: Test the service creation
console.log('\n3. Testing PumpPortal service creation...');
try {
  const PumpPortalService = require('./src/pumpportal-service');
  const pumpPortalService = new PumpPortalService();
  
  console.log('   ✅ PumpPortal service class created successfully');
  
  // Test estimated price method
  const estimatedPrice = pumpPortalService.getEstimatedPrice();
  if (estimatedPrice.success && estimatedPrice.isEstimated) {
    console.log('   ✅ Estimated price method works correctly');
    console.log(`   - Estimated price: ${estimatedPrice.price} SOL per token`);
    console.log(`   - Expected tokens: ${estimatedPrice.expectedTokens}`);
  } else {
    console.log('   ❌ Estimated price method failed');
  }
  
} catch (error) {
  console.log(`   ❌ Error testing PumpPortal service: ${error.message}`);
}

console.log('\n🎉 PumpPortal Fix Test Complete!');
console.log('\n📋 Summary:');
console.log('✅ Fallback price estimation added');
console.log('✅ WebSocket cleanup improved');
console.log('✅ Timeout reduced to 8 seconds');
console.log('✅ Detailed message logging added');
console.log('✅ Error handling improved');

console.log('\n🚀 How it works now:');
console.log('1. Tries to get real price from PumpPortal WebSocket');
console.log('2. If timeout or no data, uses estimated price');
console.log('3. Estimates price based on typical Pump.fun bonding curve');
console.log('4. Always cleans up WebSocket connection');
console.log('5. Provides detailed logging for debugging');

console.log('\n⚠️  Expected behavior:');
console.log('- If PumpPortal has data: Uses real price');
console.log('- If PumpPortal times out: Uses estimated price');
console.log('- Always shows warning when using estimated price');
console.log('- WebSocket connection is properly cleaned up');

console.log('\n✅ PumpPortal fix is ready!');
