#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying burn-app is completely standalone...\n');

// Check for any references to parent folder
const checkForParentReferences = () => {
  console.log('1. Checking for parent folder references...');
  
  const files = [
    'src/app/api/trigger-burn/route.ts',
    'src/burn-service.js',
    'src/dex-service.js',
    'src/pumpportal-service.js',
    'src/config.js',
    'start-burn-app.js',
    'package.json'
  ];
  
  let hasParentRefs = false;
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for parent folder references
      if (content.includes('../../..') || content.includes('rewardflow-web')) {
        console.log(`   ❌ Found parent reference in ${file}`);
        hasParentRefs = true;
      } else {
        console.log(`   ✅ ${file} is clean`);
      }
    }
  });
  
  if (!hasParentRefs) {
    console.log('   ✅ No parent folder references found\n');
  } else {
    console.log('   ❌ Parent folder references found\n');
  }
  
  return !hasParentRefs;
};

// Check for missing dependencies
const checkDependencies = () => {
  console.log('2. Checking package.json dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@solana/web3.js',
    '@solana/spl-token',
    '@supabase/supabase-js',
    'bs58',
    'dotenv',
    'lucide-react',
    'next',
    'react',
    'react-dom',
    'tailwind-scrollbar',
    'ws'
  ];
  
  let missingDeps = [];
  
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep]) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length === 0) {
    console.log('   ✅ All required dependencies present\n');
  } else {
    console.log(`   ❌ Missing dependencies: ${missingDeps.join(', ')}\n`);
  }
  
  return missingDeps.length === 0;
};

// Check for missing files
const checkMissingFiles = () => {
  console.log('3. Checking for required files...');
  
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'tailwind.config.js',
    'next.config.ts',
    'start-burn-app.js',
    'src/burn-service.js',
    'src/dex-service.js',
    'src/pumpportal-service.js',
    'src/config.js',
    'src/lib/supabase.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/globals.css',
    'src/components/Header.tsx',
    'src/components/Hero.tsx',
    'src/components/Stats.tsx',
    'src/components/BurnWalletBalance.tsx',
    'src/components/BurnTimer.tsx',
    'src/components/BurnHistory.tsx',
    'src/components/BurnTrigger.tsx',
    'src/components/HowItWorks.tsx',
    'src/components/Footer.tsx',
    'src/app/api/trigger-burn/route.ts',
    'src/app/api/burn-status/route.ts',
    'src/app/api/burn-result/route.ts',
    'src/app/api/burn-history/route.ts',
    'src/app/api/burn-wallet/route.ts',
    'src/app/api/stats/route.ts'
  ];
  
  let missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length === 0) {
    console.log('   ✅ All required files present\n');
  } else {
    console.log(`   ❌ Missing files: ${missingFiles.join(', ')}\n`);
  }
  
  return missingFiles.length === 0;
};

// Check import paths
const checkImportPaths = () => {
  console.log('4. Checking import paths...');
  
  const files = [
    'src/app/api/trigger-burn/route.ts',
    'src/burn-service.js',
    'src/dex-service.js'
  ];
  
  let hasWrongPaths = false;
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for wrong relative paths
      if (content.includes('require(\'../../dex-service\')')) {
        console.log(`   ❌ Wrong import path in ${file}`);
        hasWrongPaths = true;
      } else {
        console.log(`   ✅ ${file} has correct import paths`);
      }
    }
  });
  
  if (!hasWrongPaths) {
    console.log('   ✅ All import paths are correct\n');
  } else {
    console.log('   ❌ Some import paths are incorrect\n');
  }
  
  return !hasWrongPaths;
};

// Run all checks
const runVerification = () => {
  const checks = [
    checkForParentReferences(),
    checkDependencies(),
    checkMissingFiles(),
    checkImportPaths()
  ];
  
  const allPassed = checks.every(check => check);
  
  console.log('📋 Verification Summary:');
  console.log('========================');
  
  if (allPassed) {
    console.log('✅ burn-app is completely standalone and ready for deployment!');
    console.log('\n🚀 You can now copy this folder outside of rewardflow-web and deploy it.');
  } else {
    console.log('❌ burn-app has issues that need to be fixed before deployment.');
    console.log('\n🔧 Please fix the issues above before copying the folder.');
  }
  
  return allPassed;
};

// Run verification
runVerification();
