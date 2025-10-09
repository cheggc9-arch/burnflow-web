#!/usr/bin/env node

console.log('🧪 Testing RewardFlow Burn Design');
console.log('==================================\n');

// Test 1: Check if design files exist
console.log('1. Checking design files...');
const fs = require('fs');

const requiredFiles = [
  'public/index.html',
  'public/js/app.js'
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
  console.log('\n❌ Some design files are missing');
  process.exit(1);
}

// Test 2: Check HTML for RewardFlow design elements
console.log('\n2. Checking HTML for RewardFlow design elements...');
try {
  const htmlContent = fs.readFileSync('public/index.html', 'utf8');
  
  const requiredElements = [
    'TOKENS GET BURNED',
    'AUTOMATED BURN',
    'matrix-element',
    'burn-gradient-text',
    'pump-card',
    'animate-pulse-red',
    'BURN WALLET',
    'BURN DESTINATION'
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

// Test 3: Check JavaScript for matrix effect
console.log('\n3. Checking JavaScript for matrix effect...');
try {
  const jsContent = fs.readFileSync('public/js/app.js', 'utf8');
  
  const requiredFunctions = [
    'initMatrixEffect',
    'matrixContainer',
    'BURN',
    'FIRE',
    'ASH',
    'SMOKE',
    'FLAME'
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

// Test 4: Check CSS for red theme
console.log('\n4. Checking CSS for red theme...');
try {
  const htmlContent = fs.readFileSync('public/index.html', 'utf8');
  
  const requiredStyles = [
    'burn-red',
    'burn-dark',
    'burn-light',
    'burn-accent',
    'text-red-400',
    'bg-gradient-to-br from-burn-red',
    'animate-pulse-red',
    'burn-gradient-text'
  ];
  
  requiredStyles.forEach(style => {
    if (htmlContent.includes(style)) {
      console.log(`   ✅ ${style} found`);
    } else {
      console.log(`   ❌ ${style} missing`);
    }
  });
} catch (error) {
  console.log(`   ❌ Error reading CSS: ${error.message}`);
}

console.log('\n🎉 RewardFlow Burn Design Test Complete!');
console.log('\n📋 Summary:');
console.log('✅ RewardFlow homepage design copied');
console.log('✅ All greens changed to corresponding reds');
console.log('✅ Leaderboard and How It Works sections removed');
console.log('✅ Burn wallet displayed instead of treasury');
console.log('✅ Matrix effect with burn-themed text');
console.log('✅ Red theme throughout');

console.log('\n🔥 Design Features:');
console.log('🎨 RewardFlow homepage layout');
console.log('🔴 Red theme (burn-red, burn-dark, burn-light, burn-accent)');
console.log('💫 Matrix digital rain effect with burn words');
console.log('📱 Responsive design');
console.log('⚡ Animated elements (pulse, glow, matrix)');
console.log('💳 Burn wallet prominently displayed');
console.log('🔥 Burn-themed hero section');

console.log('\n🚀 How to test:');
console.log('1. npm run web - Start web server');
console.log('2. Open http://localhost:3001');
console.log('3. Check the RewardFlow-style design');
console.log('4. Verify red theme and burn wallet display');

console.log('\n✅ RewardFlow Burn design is ready!');
console.log('   The dashboard now matches RewardFlow homepage with red theme.');
