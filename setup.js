#!/usr/bin/env node

const fs = require('fs');

console.log('🚀 RewardFlow Setup\n');

// Check if .env already exists
if (fs.existsSync('.env')) {
  console.log('✅ .env file already exists');
  console.log('📝 Edit your .env file with your configuration');
  console.log('   - CREATOR_WALLET_ADDRESS: Your creator wallet public key');
  console.log('   - TOKEN_CONTRACT_ADDRESS: Your token contract address');
  console.log('   - NEXT_PUBLIC_SOLANA_RPC_URL: Solana RPC endpoint');
  console.log('   - NEXT_PUBLIC_SOLANA_NETWORK: mainnet or devnet');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous key');
  console.log('   - ENABLE_AUTOMATIC_DISTRIBUTION: true/false (default: false for testing)');
  console.log('   - DISTRIBUTION_INTERVAL_MINUTES: Timer interval in minutes (default: 20)');
  return;
}

// Create .env from example
if (fs.existsSync('env.example')) {
  try {
    fs.copyFileSync('env.example', '.env');
    console.log('✅ Created .env file from env.example');
    console.log('📝 Please edit .env with your actual values:');
    console.log('   - CREATOR_WALLET_ADDRESS');
    console.log('   - TOKEN_CONTRACT_ADDRESS');
    console.log('   - NEXT_PUBLIC_SOLANA_RPC_URL (if different)');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('   - ENABLE_AUTOMATIC_DISTRIBUTION (set to true for production)');
    console.log('   - DISTRIBUTION_INTERVAL_MINUTES (set timer interval)');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
} else {
  console.log('❌ env.example not found');
}

console.log('\n🚀 Next steps:');
console.log('1. Edit .env with your Solana and Supabase configuration');
console.log('2. Set up Supabase database (see SUPABASE_SETUP.md)');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000');
console.log('5. Test connection: http://localhost:3000/test');
