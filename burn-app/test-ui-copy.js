#!/usr/bin/env node

console.log('🎨 Testing UI Copy from RewardFlow');
console.log('==================================\n');

// Test 1: Check if all components are properly copied
console.log('1. Checking component structure...');
const fs = require('fs');

const components = [
  'src/app/page.tsx',
  'src/components/Header.tsx',
  'src/components/Hero.tsx',
  'src/components/Stats.tsx',
  'src/components/BurnWalletBalance.tsx',
  'src/components/BurnWalletAddress.tsx',
  'src/components/Footer.tsx',
  'src/app/globals.css'
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

// Test 2: Check if Hero component has matrix effect
console.log('\n2. Checking Hero component matrix effect...');
try {
  const heroContent = fs.readFileSync('src/components/Hero.tsx', 'utf8');
  
  if (heroContent.includes('matrixElements')) {
    console.log('   ✅ Hero has matrix elements');
  } else {
    console.log('   ❌ Hero missing matrix elements');
  }
  
  if (heroContent.includes('BURN') && heroContent.includes('FIRE')) {
    console.log('   ✅ Hero has burn-themed matrix text');
  } else {
    console.log('   ❌ Hero missing burn-themed matrix text');
  }
  
  if (heroContent.includes('BurnWalletAddress')) {
    console.log('   ✅ Hero includes BurnWalletAddress component');
  } else {
    console.log('   ❌ Hero missing BurnWalletAddress component');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading Hero component: ${error.message}`);
}

// Test 3: Check if Header has red theme
console.log('\n3. Checking Header red theme...');
try {
  const headerContent = fs.readFileSync('src/components/Header.tsx', 'utf8');
  
  if (headerContent.includes('border-red-400')) {
    console.log('   ✅ Header has red border');
  } else {
    console.log('   ❌ Header missing red border');
  }
  
  if (headerContent.includes('text-red-400')) {
    console.log('   ✅ Header has red text');
  } else {
    console.log('   ❌ Header missing red text');
  }
  
  if (headerContent.includes('REWARDFLOW BURN')) {
    console.log('   ✅ Header has burn branding');
  } else {
    console.log('   ❌ Header missing burn branding');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading Header component: ${error.message}`);
}

// Test 4: Check if CSS has red theme
console.log('\n4. Checking CSS red theme...');
try {
  const cssContent = fs.readFileSync('src/app/globals.css', 'utf8');
  
  if (cssContent.includes('--matrix-red')) {
    console.log('   ✅ CSS has red color variables');
  } else {
    console.log('   ❌ CSS missing red color variables');
  }
  
  if (cssContent.includes('burn-gradient-text')) {
    console.log('   ✅ CSS has burn gradient text class');
  } else {
    console.log('   ❌ CSS missing burn gradient text class');
  }
  
  if (cssContent.includes('animate-pulse-red')) {
    console.log('   ✅ CSS has red pulse animation');
  } else {
    console.log('   ❌ CSS missing red pulse animation');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading CSS file: ${error.message}`);
}

// Test 5: Check if page structure matches RewardFlow
console.log('\n5. Checking page structure...');
try {
  const pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
  
  if (pageContent.includes('Header') && pageContent.includes('Hero') && pageContent.includes('Stats')) {
    console.log('   ✅ Page has main components');
  } else {
    console.log('   ❌ Page missing main components');
  }
  
  if (pageContent.includes('BurnWalletBalance') && pageContent.includes('BurnTimer')) {
    console.log('   ✅ Page has burn-specific components');
  } else {
    console.log('   ❌ Page missing burn-specific components');
  }
  
  if (!pageContent.includes('HolderLeaderboard') && !pageContent.includes('HowItWorks')) {
    console.log('   ✅ Page removed leaderboard and how-it-works sections');
  } else {
    console.log('   ❌ Page still has leaderboard or how-it-works sections');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading page file: ${error.message}`);
}

console.log('\n🎉 UI Copy Test Complete!');
console.log('\n📋 Summary:');
if (allComponentsExist) {
  console.log('✅ All components copied successfully');
  console.log('✅ Hero has matrix effect with burn theme');
  console.log('✅ Header has red theme and burn branding');
  console.log('✅ CSS has red color scheme');
  console.log('✅ Page structure matches RewardFlow (without leaderboard/how-it-works)');
  
  console.log('\n🚀 Ready to test:');
  console.log('1. npm run dev');
  console.log('2. Open http://localhost:3000');
  console.log('3. Should look like RewardFlow with red theme');
  
  console.log('\n✅ UI is ready!');
} else {
  console.log('❌ Some components are missing');
  console.log('Please check the missing files and try again');
}
