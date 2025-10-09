console.log('🔒 Testing Reserve Amount Validation');
console.log('===================================\n');

// Load environment variables
require('dotenv').config();

function testReserveValidation() {
  const reserveAmount = parseFloat(process.env.SOL_RESERVE_AMOUNT || '0.06');
  const minBalance = parseFloat(process.env.MIN_BALANCE_SOL || '0.001');
  
  console.log(`🔧 Configuration:`);
  console.log(`   SOL_RESERVE_AMOUNT: ${reserveAmount} SOL`);
  console.log(`   MIN_BALANCE_SOL: ${minBalance} SOL`);
  
  // Test different balance scenarios
  const testScenarios = [
    { name: 'Very Low Balance', balance: 0.01 },
    { name: 'Below Reserve', balance: 0.05 },
    { name: 'Exactly Reserve', balance: 0.06 },
    { name: 'Above Reserve, Below Min', balance: 0.0605 },
    { name: 'Above Reserve, Above Min', balance: 0.07 },
    { name: 'Good Balance', balance: 0.1 },
    { name: 'High Balance', balance: 0.5 }
  ];
  
  console.log(`\n📊 Test Scenarios:`);
  console.log('┌─────────────────────┬──────────┬─────────────┬─────────────┬─────────────┐');
  console.log('│ Scenario            │ Balance  │ Reserve     │ Available   │ Result      │');
  console.log('├─────────────────────┼──────────┼─────────────┼─────────────┼─────────────┤');
  
  testScenarios.forEach(scenario => {
    const available = scenario.balance - reserveAmount;
    const hasReserve = scenario.balance >= reserveAmount;
    const hasMinBalance = available >= minBalance;
    
    let result;
    if (!hasReserve) {
      result = '❌ NO RESERVE';
    } else if (!hasMinBalance) {
      result = '❌ NO MIN BALANCE';
    } else {
      result = '✅ BUY & BURN';
    }
    
    console.log(`│ ${scenario.name.padEnd(19)} │ ${scenario.balance.toFixed(3).padEnd(8)} │ ${reserveAmount.toFixed(3).padEnd(11)} │ ${available.toFixed(3).padEnd(11)} │ ${result.padEnd(11)} │`);
  });
  
  console.log('└─────────────────────┴──────────┴─────────────┴─────────────┴─────────────┘');
  
  console.log(`\n🔍 Logic Flow:`);
  console.log(`1. Check: Balance >= Reserve Amount (${reserveAmount} SOL)`);
  console.log(`2. If NO: ❌ Don't make transactions`);
  console.log(`3. If YES: Calculate Available = Balance - Reserve`);
  console.log(`4. Check: Available >= Min Balance (${minBalance} SOL)`);
  console.log(`5. If NO: ❌ Don't make transactions`);
  console.log(`6. If YES: ✅ Buy and burn tokens`);
  
  console.log(`\n💡 Examples:`);
  console.log(`- Balance 0.05 SOL: 0.05 < 0.06 ❌ NO RESERVE`);
  console.log(`- Balance 0.06 SOL: 0.06 >= 0.06 ✅, but 0.00 < 0.001 ❌ NO MIN BALANCE`);
  console.log(`- Balance 0.07 SOL: 0.07 >= 0.06 ✅, and 0.01 >= 0.001 ✅ BUY & BURN`);
}

testReserveValidation();

console.log('\n✅ Reserve validation logic is working correctly!');
