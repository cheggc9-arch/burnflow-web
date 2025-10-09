#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up RewardFlow Burn App');
console.log('==================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found');
  console.error('Please run this script from the burn-app directory');
  process.exit(1);
}

console.log('✅ Found package.json');

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Burn Wallet Configuration
BURN_WALLET_ADDRESS=your_burn_wallet_address_here
BURN_WALLET_PRIVATE_KEY=your_burn_wallet_private_key_here

# Token Configuration
TOKEN_CONTRACT_ADDRESS=your_token_contract_address_here

# Burn Configuration
BURN_INTERVAL_MINUTES=60
MIN_BALANCE_SOL=0.01
SLIPPAGE_BPS=100
PRICE_IMPACT_PERCENT=0.5

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
LOG_LEVEL=info
LOG_FILE=burn-app.log
`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install');
} else {
  console.log('✅ Dependencies already installed');
}

console.log('\n📋 Setup Instructions:');
console.log('======================');
console.log('');
console.log('1. 🔧 Configure Environment Variables:');
console.log('   Edit the .env file and add your values:');
console.log('   - BURN_WALLET_ADDRESS: Your burn wallet address');
console.log('   - BURN_WALLET_PRIVATE_KEY: Your burn wallet private key');
console.log('   - TOKEN_CONTRACT_ADDRESS: Your token contract address');
console.log('   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL');
console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key');
console.log('');
console.log('2. 🗄️ Set up Supabase Database:');
console.log('   a) Go to https://supabase.com and create a new project');
console.log('   b) Go to SQL Editor in your Supabase dashboard');
console.log('   c) Run the SQL from supabase-burn-schema.sql');
console.log('   d) Run: node setup-database.js');
console.log('');
console.log('3. 📦 Install Dependencies:');
console.log('   npm install');
console.log('');
console.log('4. 🚀 Start the Application:');
console.log('   npm run dev');
console.log('');
console.log('5. 🌐 Open in Browser:');
console.log('   http://localhost:3000');
console.log('');
console.log('✅ Setup complete! Follow the instructions above to configure your app.');
