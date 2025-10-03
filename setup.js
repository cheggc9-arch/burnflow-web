#!/usr/bin/env node

const fs = require('fs');

console.log('🚀 RewardFlow Setup\n');

// Check if .env already exists
if (fs.existsSync('.env')) {
  console.log('✅ .env file already exists');
  console.log('📝 Edit your .env file with your Solana configuration');
  console.log('   - CREATOR_WALLET_ADDRESS: Your creator wallet public key');
  console.log('   - TOKEN_CONTRACT_ADDRESS: Your token contract address');
  console.log('   - NEXT_PUBLIC_SOLANA_RPC_URL: Solana RPC endpoint');
  console.log('   - NEXT_PUBLIC_SOLANA_NETWORK: mainnet or devnet');
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
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
} else {
  console.log('❌ env.example not found');
}

console.log('\n🚀 Next steps:');
console.log('1. Edit .env with your Solana configuration');
console.log('2. Run: npm run dev');
console.log('3. Visit: http://localhost:3000');
console.log('4. Test connection: http://localhost:3000/test');
