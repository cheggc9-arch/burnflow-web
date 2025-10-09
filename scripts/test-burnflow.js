const { DistributionService } = require('../src/utils/distribution-service');
const { BurnService } = require('../src/utils/burn-service');

async function testBurnFlow() {
  console.log('🧪 Testing BurnFlow Implementation...\n');

  try {
    // Test 1: Distribution Service (80/20 split)
    console.log('1. Testing Distribution Service with 80/20 split...');
    const distributionService = new DistributionService();
    
    // Check if distribution should run
    const shouldRunDistribution = await distributionService.shouldRunDistribution();
    console.log(`   ✅ Should run distribution: ${shouldRunDistribution}`);
    
    if (shouldRunDistribution) {
      console.log('   🔄 Executing distribution...');
      const distributionResult = await distributionService.distributeRewards();
      
      if (distributionResult.success) {
        console.log(`   ✅ Distribution completed successfully!`);
        console.log(`   - Total distributed: ${distributionResult.totalDistributed.toFixed(6)} SOL`);
        console.log(`   - Recipients: ${distributionResult.recipientsCount}`);
        console.log(`   - Transactions: ${distributionResult.transactions.length}`);
        
        // Check for burn wallet transaction
        const burnTransaction = distributionResult.transactions.find(tx => 
          tx.recipient === process.env.BURN_WALLET_ADDRESS
        );
        
        if (burnTransaction) {
          console.log(`   🔥 Burn wallet received: ${burnTransaction.amount.toFixed(6)} SOL`);
          console.log(`   - Transaction: ${burnTransaction.signature || 'N/A'}`);
        } else {
          console.log(`   ⚠️ No burn wallet transaction found`);
        }
      } else {
        console.log(`   ❌ Distribution failed: ${distributionResult.errors.join(', ')}`);
      }
    }
    
    console.log('\n');
    
    // Test 2: Burn Service
    console.log('2. Testing Burn Service...');
    const burnService = new BurnService();
    
    // Get burn wallet balance
    const burnBalance = await burnService.getBurnWalletBalance();
    console.log(`   ✅ Burn wallet balance: ${burnBalance.toFixed(6)} SOL`);
    
    // Check if burn should run
    const shouldRunBurn = await burnService.shouldRunBurn();
    console.log(`   ✅ Should run burn: ${shouldRunBurn}`);
    
    if (shouldRunBurn) {
      console.log('   🔄 Executing burn...');
      const burnResult = await burnService.executeBurn();
      
      if (burnResult.success) {
        console.log(`   ✅ Burn executed successfully!`);
        console.log(`   - SOL used: ${burnResult.solUsed.toFixed(6)}`);
        console.log(`   - Tokens burned: ${burnResult.tokensBurned.toFixed(6)}`);
        console.log(`   - Transaction: ${burnResult.signature}`);
      } else {
        console.log(`   ❌ Burn failed: ${burnResult.error}`);
      }
    }
    
    console.log('\n🎉 BurnFlow test completed!');
    console.log('\n📊 Summary:');
    console.log('- Distribution: 80% to holders, 20% to burn wallet');
    console.log('- Burn wallet: Buys back tokens with SOL and burns them');
    console.log('- Token buyback: Uses DEX integration to swap SOL for tokens');
    console.log('- Token burning: Sends tokens to burn address');
    console.log('- Burn address: 1nc1nerator11111111111111111111111111111111');
    
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
    'CREATOR_WALLET_ADDRESS',
    'DEV_WALLET_PRIVATE_KEY'
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
console.log('🚀 Starting BurnFlow Test...\n');
checkEnvironment();
testBurnFlow();
