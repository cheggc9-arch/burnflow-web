#!/usr/bin/env node

const { config, validateConfig } = require('./config');
const BurnService = require('./burn-service');

class BurnAppTest {
  constructor() {
    this.burnService = new BurnService(config);
  }

  async runTests() {
    console.log('🧪 Testing RewardFlow Burn Application');
    console.log('======================================\n');

    try {
      // Test 1: Configuration validation
      console.log('1. Testing configuration...');
      validateConfig();
      console.log('   ✅ Configuration is valid\n');

      // Test 2: Burn wallet connection
      console.log('2. Testing burn wallet connection...');
      const walletInfo = await this.burnService.getBurnWalletInfo();
      
      if (walletInfo) {
        console.log('   ✅ Burn wallet connected successfully');
        console.log(`   - Balance: ${walletInfo.balanceSOL} SOL`);
        console.log(`   - Token Balance: ${walletInfo.tokenBalance} tokens`);
        console.log(`   - Should Run: ${walletInfo.shouldRun ? 'Yes' : 'No'}`);
        console.log(`   - Burn Address: ${walletInfo.burnAddress}\n`);
      } else {
        console.log('   ❌ Failed to connect to burn wallet\n');
        return;
      }

      // Test 3: Service status
      console.log('3. Testing service status...');
      const status = this.burnService.getStatus();
      console.log(`   - Running: ${status.isRunning ? 'Yes' : 'No'}`);
      console.log(`   - Interval: ${status.intervalMinutes} minutes`);
      console.log(`   - Token: ${status.config.token}`);
      console.log(`   - Min Balance: ${status.config.minBalance} SOL\n`);

      // Test 4: Manual burn execution (if conditions are met)
      if (walletInfo.shouldRun) {
        console.log('4. Testing manual burn execution...');
        console.log('   🔄 Executing burn cycle...');
        
        await this.burnService.executeBurnCycle();
        
        console.log('   ✅ Manual burn cycle completed\n');
      } else {
        console.log('4. Skipping manual burn test (insufficient balance)\n');
      }

      console.log('🎉 All tests completed successfully!');
      console.log('\n📋 Test Summary:');
      console.log('✅ Configuration validation');
      console.log('✅ Burn wallet connection');
      console.log('✅ Service status check');
      console.log(`${walletInfo.shouldRun ? '✅' : '⏭️'} Manual burn execution`);

    } catch (error) {
      console.error('❌ Test failed:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Run the tests
const testApp = new BurnAppTest();
testApp.runTests();
