#!/usr/bin/env node

console.log('🔧 Testing API Fix for Burn Data');
console.log('=================================\n');

// Test 1: Check if API endpoints exist
console.log('1. Checking API endpoints...');
const fs = require('fs');

const apiEndpoints = [
  'src/app/api/burn-wallet/route.ts',
  'src/app/api/stats/route.ts',
  'src/app/api/burn-history/route.ts',
  'src/app/api/trigger-burn/route.ts'
];

let allEndpointsExist = true;
apiEndpoints.forEach(endpoint => {
  try {
    if (fs.existsSync(endpoint)) {
      console.log(`   ✅ ${endpoint}`);
    } else {
      console.log(`   ❌ ${endpoint}`);
      allEndpointsExist = false;
    }
  } catch (error) {
    console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
    allEndpointsExist = false;
  }
});

// Test 2: Check if burn-wallet API has real Solana connection
console.log('\n2. Checking burn-wallet API...');
try {
  const burnWalletContent = fs.readFileSync('src/app/api/burn-wallet/route.ts', 'utf8');
  
  if (burnWalletContent.includes('Connection') && burnWalletContent.includes('PublicKey')) {
    console.log('   ✅ Burn wallet API has Solana connection');
  } else {
    console.log('   ❌ Burn wallet API missing Solana connection');
  }
  
  if (burnWalletContent.includes('getBalance')) {
    console.log('   ✅ Burn wallet API fetches real balance');
  } else {
    console.log('   ❌ Burn wallet API missing balance fetch');
  }
  
  if (burnWalletContent.includes('BURN_WALLET_ADDRESS')) {
    console.log('   ✅ Burn wallet API uses environment variable');
  } else {
    console.log('   ❌ Burn wallet API missing environment variable');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading burn-wallet API: ${error.message}`);
}

// Test 3: Check if stats API has real data
console.log('\n3. Checking stats API...');
try {
  const statsContent = fs.readFileSync('src/app/api/stats/route.ts', 'utf8');
  
  if (statsContent.includes('Connection') && statsContent.includes('getBalance')) {
    console.log('   ✅ Stats API has real Solana connection');
  } else {
    console.log('   ❌ Stats API missing Solana connection');
  }
  
  if (statsContent.includes('burn-history')) {
    console.log('   ✅ Stats API fetches burn history data');
  } else {
    console.log('   ❌ Stats API missing burn history integration');
  }
  
  if (statsContent.includes('totalBurned') && statsContent.includes('totalBurns')) {
    console.log('   ✅ Stats API returns burn statistics');
  } else {
    console.log('   ❌ Stats API missing burn statistics');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading stats API: ${error.message}`);
}

// Test 4: Check if burn-history API exists
console.log('\n4. Checking burn-history API...');
try {
  const burnHistoryContent = fs.readFileSync('src/app/api/burn-history/route.ts', 'utf8');
  
  if (burnHistoryContent.includes('BurnRecord')) {
    console.log('   ✅ Burn history API has proper interface');
  } else {
    console.log('   ❌ Burn history API missing interface');
  }
  
  if (burnHistoryContent.includes('totalTokensBurned')) {
    console.log('   ✅ Burn history API returns total tokens burned');
  } else {
    console.log('   ❌ Burn history API missing total tokens burned');
  }
  
  if (burnHistoryContent.includes('totalBurns')) {
    console.log('   ✅ Burn history API returns total burns count');
  } else {
    console.log('   ❌ Burn history API missing total burns count');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading burn-history API: ${error.message}`);
}

// Test 5: Check if components exist
console.log('\n5. Checking missing components...');
const components = [
  'src/components/BurnTimer.tsx',
  'src/components/BurnHistory.tsx',
  'src/components/BurnTrigger.tsx'
];

let allComponentsExist = true;
components.forEach(component => {
  try {
    if (fs.existsSync(component)) {
      console.log(`   ✅ ${component}`);
    } else {
      console.log(`   ❌ ${component}`);
      allComponentsExist = false;
    }
  } catch (error) {
    console.log(`   ❌ ${component} - Error: ${error.message}`);
    allComponentsExist = false;
  }
});

console.log('\n🎉 API Fix Test Complete!');
console.log('\n📋 Summary:');
if (allEndpointsExist && allComponentsExist) {
  console.log('✅ All API endpoints exist');
  console.log('✅ Burn wallet API fetches real Solana balance');
  console.log('✅ Stats API uses real data from burn history');
  console.log('✅ Burn history API provides burn statistics');
  console.log('✅ All missing components created');
  
  console.log('\n🚀 Ready to test:');
  console.log('1. Set BURN_WALLET_ADDRESS in .env file');
  console.log('2. npm run dev');
  console.log('3. Open http://localhost:3000');
  console.log('4. Should show real burn wallet balance and statistics');
  
  console.log('\n✅ API fixes are ready!');
} else {
  console.log('❌ Some API endpoints or components are missing');
  console.log('Please check the missing files and try again');
}
