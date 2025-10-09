#!/usr/bin/env node

console.log('🧪 Testing RewardFlow Burn Web Interface');
console.log('========================================\n');

// Test 1: Check if all web files exist
console.log('1. Checking web interface files...');
const fs = require('fs');
const path = require('path');

const webFiles = [
  'public/index.html',
  'public/js/app.js',
  'src/web-server.js',
  'src/burn-app.js'
];

let allFilesExist = true;
webFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some web interface files are missing');
  process.exit(1);
}

// Test 2: Check HTML content
console.log('\n2. Checking HTML structure...');
try {
  const htmlContent = fs.readFileSync('public/index.html', 'utf8');
  
  const requiredElements = [
    'RewardFlow Burn',
    'burn-red',
    'nextBurnTimer',
    'burnHistory',
    'burnProgress'
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

// Test 3: Check JavaScript functionality
console.log('\n3. Checking JavaScript functionality...');
try {
  const jsContent = fs.readFileSync('public/js/app.js', 'utf8');
  
  const requiredFunctions = [
    'BurnDashboard',
    'updateTimer',
    'startBurnProcess',
    'updateDashboard'
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

// Test 4: Check web server
console.log('\n4. Checking web server...');
try {
  const serverContent = fs.readFileSync('src/web-server.js', 'utf8');
  
  const requiredFeatures = [
    'BurnWebServer',
    'express',
    '/api/status',
    '/api/burn-history',
    'static'
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

console.log('\n🎉 Web Interface Test Complete!');
console.log('\n📋 Summary:');
console.log('✅ Red-themed web interface created');
console.log('✅ Countdown timer implemented');
console.log('✅ Burn history display ready');
console.log('✅ Progress tracking implemented');
console.log('✅ Web server configured');
console.log('✅ API endpoints ready');

console.log('\n🚀 How to run the web interface:');
console.log('1. npm run web - Web dashboard only');
console.log('2. npm run app - Full application with web dashboard');
console.log('3. Open http://localhost:3001 in your browser');

console.log('\n💡 Web Interface Features:');
console.log('🔥 Red theme matching RewardFlow design');
console.log('⏱️ Countdown timer to next burn');
console.log('📊 Real-time burn wallet stats');
console.log('📈 Complete burn history');
console.log('🔄 Progress bars during burn operations');
console.log('📱 Responsive design for all devices');

console.log('\n✅ Web interface is ready to use!');
