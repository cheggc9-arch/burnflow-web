#!/usr/bin/env node

console.log('🔍 PumpPortal Transaction Debug Test');
console.log('====================================\n');

// Test 1: Check if the token address is valid
console.log('1. Checking token address validity...');
const { PublicKey } = require('@solana/web3.js');

try {
  const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS || 'Ej8FUr9Sjn3Qwf77gzrLyCyu1EFq2K8UdV2fqYytpump';
  const tokenMint = new PublicKey(tokenAddress);
  console.log(`   ✅ Token address is valid: ${tokenMint.toBase58()}`);
} catch (error) {
  console.log(`   ❌ Invalid token address: ${error.message}`);
}

// Test 2: Check if API key is set
console.log('\n2. Checking API key configuration...');
const apiKey = process.env.PUMP_PORTAL_API_KEY || process.env.NEXT_PUMP_PORTAL_API_KEY;
if (apiKey) {
  console.log(`   ✅ API key is set: ${apiKey.substring(0, 8)}...`);
} else {
  console.log('   ❌ API key not set - this will cause failures');
}

// Test 3: Check wallet balance
console.log('\n3. Checking wallet balance...');
try {
  const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
  const bs58 = require('bs58');
  
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  const connection = new Connection(rpcUrl, 'confirmed');
  
  const privateKey = process.env.BURN_WALLET_PRIVATE_KEY;
  if (privateKey) {
    const keypair = require('@solana/web3.js').Keypair.fromSecretKey(bs58.decode(privateKey));
    const balance = await connection.getBalance(keypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    
    console.log(`   ✅ Wallet address: ${keypair.publicKey.toBase58()}`);
    console.log(`   💰 Balance: ${solBalance.toFixed(4)} SOL`);
    
    if (solBalance < 0.01) {
      console.log('   ⚠️ Warning: Low balance, transactions might fail');
    }
  } else {
    console.log('   ❌ Private key not set');
  }
} catch (error) {
  console.log(`   ❌ Error checking balance: ${error.message}`);
}

// Test 4: Test PumpPortal API directly
console.log('\n4. Testing PumpPortal API directly...');
async function testPumpPortalAPI() {
  try {
    const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS || 'Ej8FUr9Sjn3Qwf77gzrLyCyu1EFq2K8UdV2fqYytpump';
    const apiKey = process.env.PUMP_PORTAL_API_KEY || process.env.NEXT_PUMP_PORTAL_API_KEY;
    
    if (!apiKey) {
      console.log('   ❌ Cannot test API - no API key set');
      return;
    }
    
    const requestBody = {
      action: "buy",
      mint: tokenAddress,
      amount: 0.001, // Very small amount for testing
      denominatedInSol: "true",
      slippage: 10,
      priorityFee: 0.00005,
      pool: "auto",
      skipPreflight: "false" // Enable simulation
    };
    
    console.log('   📤 Testing with request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`https://pumpportal.fun/api/trade?api-key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ API request failed: ${response.status} ${response.statusText}`);
      console.log(`   Error details: ${errorText}`);
      return;
    }
    
    const data = await response.json();
    console.log('   📥 API response:', JSON.stringify(data, null, 2));
    
    if (data.signature) {
      console.log(`   ✅ API returned signature: ${data.signature}`);
      console.log(`   🔗 Check on Solscan: https://solscan.io/tx/${data.signature}`);
    } else {
      console.log('   ❌ API did not return signature');
    }
    
  } catch (error) {
    console.log(`   ❌ API test failed: ${error.message}`);
  }
}

testPumpPortalAPI();

console.log('\n🎯 Debugging Tips:');
console.log('1. Check if the token address is correct for Pump.fun');
console.log('2. Verify the API key is valid and has permissions');
console.log('3. Ensure wallet has sufficient SOL balance');
console.log('4. Check if the token is still on the bonding curve');
console.log('5. Try with a larger SOL amount (0.01+ SOL)');
console.log('6. Check PumpPortal documentation for any API changes');

console.log('\n⚠️  Common Issues:');
console.log('- Token might be bonded (no longer on bonding curve)');
console.log('- Insufficient SOL balance for transaction + fees');
console.log('- API key might not have trading permissions');
console.log('- Token address might be incorrect');
console.log('- Network congestion causing transaction failures');

console.log('\n✅ Debug test complete!');
