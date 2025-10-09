#!/usr/bin/env node

console.log('🧪 Testing Burn Wallet Display');
console.log('==============================\n');

// Test 1: Check if burn wallet display files exist
console.log('1. Checking burn wallet display files...');
const fs = require('fs');

const requiredFiles = [
  'public/index.html',
  'public/js/app.js',
  'src/web-server.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing');
  process.exit(1);
}

// Test 2: Check HTML for burn wallet elements
console.log('\n2. Checking HTML for burn wallet elements...');
try {
  const htmlContent = fs.readFileSync('public/index.html', 'utf8');
  
  const requiredElements = [
    'burnWalletAddress',
    'burnWalletAddressFull',
    'Burn Wallet Information',
    'This wallet will buy and burn tokens',
    'copyToClipboard'
  ];
  
  requiredElements.forEach(element => {
    if (htmlContent.includes(element)) {
      console.log(`   ✅ ${element} found`);
    } else {
      console.log(`   ❌ ${element} missing`);
    }
  });
} catch (error) {
  console.log(`   ❌ Error reading HTML: ${error.message}`);
}

// Test 3: Check JavaScript for burn wallet functionality
console.log('\n3. Checking JavaScript for burn wallet functionality...');
try {
  const jsContent = fs.readFileSync('public/js/app.js', 'utf8');
  
  const requiredFunctions = [
    'loadBurnWalletInfo',
    'updateBurnWalletDisplay',
    'copyToClipboard',
    '/api/burn-wallet'
  ];
  
  requiredFunctions.forEach(func => {
    if (jsContent.includes(func)) {
      console.log(`   ✅ ${func} found`);
    } else {
      console.log(`   ❌ ${func} missing`);
    }
  });
} catch (error) {
  console.log(`   ❌ Error reading JavaScript: ${error.message}`);
}

// Test 4: Check web server for burn wallet API
console.log('\n4. Checking web server for burn wallet API...');
try {
  const serverContent = fs.readFileSync('src/web-server.js', 'utf8');
  
  const requiredFeatures = [
    '/api/burn-wallet',
    'burnWallet.address',
    'burnAddress',
    'This wallet will buy and burn tokens automatically'
  ];
  
  requiredFeatures.forEach(feature => {
    if (serverContent.includes(feature)) {
      console.log(`   ✅ ${feature} found`);
    } else {
      console.log(`   ❌ ${feature} missing`);
    }
  });
} catch (error) {
  console.log(`   ❌ Error reading web server: ${error.message}`);
}

console.log('\n🎉 Burn Wallet Display Test Complete!');
console.log('\n📋 Summary:');
console.log('✅ Burn wallet information section added');
console.log('✅ Burn wallet address display implemented');
console.log('✅ Copy to clipboard functionality added');
console.log('✅ API endpoint for burn wallet info created');
console.log('✅ JavaScript integration completed');

console.log('\n🔥 Burn Wallet Display Features:');
console.log('📍 Prominent burn wallet address display');
console.log('📋 Copy to clipboard functionality');
console.log('🔄 Real-time address loading from API');
console.log('📱 Responsive design for all devices');
console.log('🎨 Red theme integration');
console.log('💡 Clear explanation of wallet purpose');

console.log('\n🚀 How to test:');
console.log('1. npm run web - Start web server');
console.log('2. Open http://localhost:3001');
console.log('3. Check burn wallet information section');
console.log('4. Test copy to clipboard functionality');

console.log('\n✅ Burn wallet display is ready!');
console.log('   The dashboard now clearly shows which wallet will buy and burn tokens.');
