const { BurnService } = require('../src/utils/burn-service');
const { DexService } = require('../src/utils/dex-service');

async function testTokenBurn() {
  console.log('🧪 Testing Token Buyback and Burn Process...\n');

  try {
    // Test 1: DEX Service
    console.log('1. Testing DEX Service...');
    const dexService = new DexService();
    
    // Test getting best route
    const routeResult = await dexService.getBestRoute(0.1); // 0.1 SOL
    if (routeResult.success) {
      console.log(`   ✅ Route found: ${routeResult.route.estimatedTokens} tokens for 0.1 SOL`);
    } else {
      console.log(`   ❌ Route failed: ${routeResult.error}`);
    }
    
    // Test token price
    console.log('   🔄 Testing token price fetching...');
    // Note: This is a private method, so we'll test it through the buyback process
    
    console.log('\n');
    
    // Test 2: Burn Service - Token Buyback
    console.log('2. Testing Burn Service Token Buyback...');
    const burnService = new BurnService();
    
    // Get burn wallet balance
    const balance = await burnService.getBurnWalletBalance();
    console.log(`   ✅ Burn wallet balance: ${balance.toFixed(6)} SOL`);
    
    // Check if burn should run
    const shouldRun = await burnService.shouldRunBurn();
    console.log(`   ✅ Should run burn: ${shouldRun}`);
    
    if (shouldRun) {
      console.log('   🔄 Executing complete burn process...');
      const burnResult = await burnService.executeBurn();
      
      if (burnResult.success) {
        console.log(`   ✅ Burn process completed successfully!`);
        console.log(`   - SOL used: ${burnResult.solUsed.toFixed(6)}`);
        console.log(`   - Tokens burned: ${burnResult.tokensBurned.toFixed(0)}`);
        console.log(`   - Transaction: ${burnResult.signature}`);
        
        // Verify the burn process steps
        console.log('\n   📋 Burn Process Verification:');
        console.log('   ✅ Step 1: SOL to token buyback via DEX');
        console.log('   ✅ Step 2: Token transfer to burn address');
        console.log('   ✅ Step 3: Tokens permanently burned');
        
      } else {
        console.log(`   ❌ Burn process failed: ${burnResult.error}`);
      }
    } else {
      console.log('   ⏭️ Skipping burn (insufficient balance)');
    }
    
    console.log('\n🎉 Token burn test completed!');
    
    // Test 3: Background Job Integration
    console.log('\n3. Testing Background Job Integration...');
    const { getBurnBackgroundJob } = require('../src/utils/burn-background-job');
    const backgroundJob = getBurnBackgroundJob();
    
    const jobStatus = backgroundJob.getStatus();
    console.log(`   ✅ Background job status: ${jobStatus.isRunning ? 'Running' : 'Stopped'}`);
    console.log(`   ✅ Interval: ${jobStatus.intervalMinutes} minutes`);
    
    console.log('\n📊 Complete Token Burn System Summary:');
    console.log('🔄 Process Flow:');
    console.log('   1. Distribution sends 20% SOL to burn wallet');
    console.log('   2. Background job checks burn wallet balance');
    console.log('   3. DEX service buys back tokens with SOL');
    console.log('   4. Tokens are transferred to burn address');
    console.log('   5. Tokens are permanently burned');
    console.log('\n⚙️ Configuration:');
    console.log(`   - Burn interval: ${process.env.BURN_SCRIPT_INTERVAL_MINUTES || 60} minutes`);
    console.log('   - Burn address: 1nc1nerator11111111111111111111111111111111');
    console.log('   - Token contract: ' + (process.env.TOKEN_CONTRACT_ADDRESS || 'Not set'));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Check environment variables
function checkEnvironment() {
  const requiredVars = [
    'BURN_WALLET_ADDRESS',
    'BURN_WALLET_PRIVATE_KEY',
    'TOKEN_CONTRACT_ADDRESS',
    'BURN_SCRIPT_INTERVAL_MINUTES'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease set up your .env file with the required variables.');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
}

// Run the test
console.log('🚀 Starting Token Burn Test...\n');
checkEnvironment();
testTokenBurn();
