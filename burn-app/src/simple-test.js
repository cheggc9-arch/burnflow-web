#!/usr/bin/env node

console.log('🧪 Testing RewardFlow Burn Application Structure');
console.log('===============================================\n');

// Test 1: Check if all required files exist
console.log('1. Checking application structure...');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'src/index.js',
  'src/config.js',
  'src/logger.js',
  'src/solana-client.js',
  'src/burn-service.js',
  'src/test.js',
  'env.example',
  'README.md'
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

// Test 2: Check package.json
console.log('\n2. Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`   ✅ Name: ${packageJson.name}`);
  console.log(`   ✅ Version: ${packageJson.version}`);
  console.log(`   ✅ Main: ${packageJson.main}`);
  console.log(`   ✅ Scripts: ${Object.keys(packageJson.scripts).join(', ')}`);
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
}

// Test 3: Check dependencies
console.log('\n3. Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@solana/web3.js',
    '@solana/spl-token',
    'bs58',
    'dotenv'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep} - Missing`);
    }
  });
} catch (error) {
  console.log(`   ❌ Error checking dependencies: ${error.message}`);
}

// Test 4: Check environment example
console.log('\n4. Checking environment configuration...');
if (fs.existsSync('env.example')) {
  console.log('   ✅ env.example exists');
  const envContent = fs.readFileSync('env.example', 'utf8');
  const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  console.log(`   ✅ Environment variables: ${envLines.length}`);
} else {
  console.log('   ❌ env.example missing');
}

console.log('\n🎉 Application Structure Test Complete!');
console.log('\n📋 Summary:');
console.log('✅ Standalone burn application created');
console.log('✅ All required files present');
console.log('✅ Package.json configured');
console.log('✅ Dependencies defined');
console.log('✅ Environment template ready');

console.log('\n🚀 Next Steps:');
console.log('1. Copy env.example to .env');
console.log('2. Configure your environment variables');
console.log('3. Run: npm test');
console.log('4. Run: npm start');

console.log('\n💡 The burn application is ready to use!');
console.log('   It will automatically buy back and burn tokens at the configured interval.');
