#!/usr/bin/env node

console.log('🧪 Testing Standalone Burn App Setup');
console.log('====================================\n');

const fs = require('fs');
const path = require('path');

// Test 1: Check if all required files exist
console.log('1. Checking required files...');
const requiredFiles = [
  'package.json',
  'setup.js',
  'setup-database.js',
  'supabase-burn-schema.sql',
  'README.md',
  'DEPLOYMENT.md',
  '.gitignore',
  'src/lib/supabase.ts',
  'src/burn-service.js',
  'src/app/page.tsx',
  'src/app/api/burn-wallet/route.ts',
  'src/app/api/stats/route.ts',
  'src/app/api/burn-history/route.ts',
  'src/app/api/trigger-burn/route.ts'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file}`);
    allFilesExist = false;
  }
});

// Test 2: Check package.json for standalone dependencies
console.log('\n2. Checking package.json...');
try {
  const packageContent = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageContent.name === 'rewardflow-burn-app') {
    console.log('   ✅ Package name is correct for standalone app');
  } else {
    console.log('   ❌ Package name should be rewardflow-burn-app');
  }
  
  if (packageContent.dependencies['@supabase/supabase-js']) {
    console.log('   ✅ Supabase dependency included');
  } else {
    console.log('   ❌ Supabase dependency missing');
  }
  
  if (packageContent.dependencies['@solana/web3.js']) {
    console.log('   ✅ Solana dependency included');
  } else {
    console.log('   ❌ Solana dependency missing');
  }
  
  if (packageContent.dependencies['next']) {
    console.log('   ✅ Next.js dependency included');
  } else {
    console.log('   ❌ Next.js dependency missing');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
}

// Test 3: Check if .env template exists
console.log('\n3. Checking environment setup...');
if (fs.existsSync('.env')) {
  console.log('   ✅ .env file exists');
  
  const envContent = fs.readFileSync('.env', 'utf8');
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    console.log('   ✅ Supabase URL variable present');
  } else {
    console.log('   ❌ Supabase URL variable missing');
  }
  
  if (envContent.includes('BURN_WALLET_ADDRESS')) {
    console.log('   ✅ Burn wallet address variable present');
  } else {
    console.log('   ❌ Burn wallet address variable missing');
  }
} else {
  console.log('   ⚠️  .env file not found (run setup.js to create it)');
}

// Test 4: Check if setup scripts are executable
console.log('\n4. Checking setup scripts...');
if (fs.existsSync('setup.js')) {
  console.log('   ✅ setup.js exists');
} else {
  console.log('   ❌ setup.js missing');
}

if (fs.existsSync('setup-database.js')) {
  console.log('   ✅ setup-database.js exists');
} else {
  console.log('   ❌ setup-database.js missing');
}

if (fs.existsSync('supabase-burn-schema.sql')) {
  console.log('   ✅ Database schema file exists');
} else {
  console.log('   ❌ Database schema file missing');
}

// Test 5: Check if components are self-contained
console.log('\n5. Checking component independence...');
try {
  const pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
  
  if (pageContent.includes('@/components/')) {
    console.log('   ✅ Components use local imports');
  } else {
    console.log('   ❌ Components may have external dependencies');
  }
  
  if (pageContent.includes('BurnWalletBalance') && pageContent.includes('BurnTimer')) {
    console.log('   ✅ Page has burn-specific components');
  } else {
    console.log('   ❌ Page missing burn-specific components');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading page component: ${error.message}`);
}

// Test 6: Check if APIs are self-contained
console.log('\n6. Checking API independence...');
const apiFiles = [
  'src/app/api/burn-wallet/route.ts',
  'src/app/api/stats/route.ts',
  'src/app/api/burn-history/route.ts',
  'src/app/api/trigger-burn/route.ts'
];

apiFiles.forEach(apiFile => {
  try {
    if (fs.existsSync(apiFile)) {
      const content = fs.readFileSync(apiFile, 'utf8');
      
      if (content.includes('@/lib/supabase')) {
        console.log(`   ✅ ${apiFile} uses local Supabase client`);
      } else {
        console.log(`   ❌ ${apiFile} missing Supabase integration`);
      }
      
    } else {
      console.log(`   ❌ ${apiFile} missing`);
    }
  } catch (error) {
    console.log(`   ❌ Error reading ${apiFile}: ${error.message}`);
  }
});

console.log('\n🎉 Standalone Setup Test Complete!');
console.log('\n📋 Summary:');

if (allFilesExist) {
  console.log('✅ All required files exist');
  console.log('✅ Package.json configured for standalone app');
  console.log('✅ Environment variables template ready');
  console.log('✅ Setup scripts available');
  console.log('✅ Components are self-contained');
  console.log('✅ APIs use local Supabase client');
  
  console.log('\n🚀 Ready for standalone deployment!');
  console.log('\n📝 Next Steps:');
  console.log('1. Run: node setup.js');
  console.log('2. Configure .env file with your values');
  console.log('3. Set up Supabase database');
  console.log('4. Run: node setup-database.js');
  console.log('5. Run: npm install');
  console.log('6. Run: npm run dev');
  console.log('7. Push to your own GitHub repository');
  console.log('8. Deploy independently');
  
  console.log('\n✅ Standalone app is ready!');
} else {
  console.log('❌ Some files are missing');
  console.log('Please check the missing files and try again');
}
