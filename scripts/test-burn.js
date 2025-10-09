const { BurnService } = require('../src/utils/burn-service');

async function testBurnService() {
  console.log('🧪 Testing Burn Service...\n');

  try {
    const burnService = new BurnService();
    
    // Test 1: Get burn wallet balance
    console.log('1. Testing burn wallet balance...');
    const balance = await burnService.getBurnWalletBalance();
    console.log(`   ✅ Burn wallet balance: ${balance.toFixed(6)} SOL\n`);
    
    // Test 2: Check if burn should run
    console.log('2. Testing burn conditions...');
    const shouldRun = await burnService.shouldRunBurn();
    console.log(`   ✅ Should run burn: ${shouldRun}\n`);
    
    // Test 3: Execute burn (if conditions are met)
    if (shouldRun) {
      console.log('3. Testing burn execution...');
      const result = await burnService.executeBurn();
      
      if (result.success) {
        console.log(`   ✅ Burn executed successfully!`);
        console.log(`   - SOL used: ${result.solUsed.toFixed(6)}`);
        console.log(`   - Tokens burned: ${result.tokensBurned.toFixed(6)}`);
        console.log(`   - Transaction: ${result.signature}\n`);
      } else {
        console.log(`   ❌ Burn failed: ${result.error}\n`);
      }
    } else {
      console.log('3. Skipping burn execution (conditions not met)\n');
    }
    
    console.log('🎉 Burn service test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testBurnService();
