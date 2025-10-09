console.log('🔍 Testing Token Status on Pump.fun');
console.log('====================================\n');

// Load environment variables
require('dotenv').config();

async function testTokenStatus() {
  try {
    const { Connection, PublicKey } = require('@solana/web3.js');
    const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS || 'Ej8FUr9Sjn3Qwf77gzrLyCyu1EFq2K8UdV2fqYytpump';
    const apiKey = process.env.PUMP_PORTAL_API_KEY || process.env.NEXT_PUMP_PORTAL_API_KEY;
    
    console.log(`Token: ${tokenAddress}`);
    console.log(`API Key: ${apiKey ? 'SET' : 'NOT SET'}`);
    
    if (!apiKey) {
      console.log('❌ Cannot test - no API key');
      return;
    }
    
    // Test 1: Try to get token info from PumpPortal
    console.log('\n1. Testing PumpPortal API with minimal amount...');
    
    const requestBody = {
      action: "buy",
      mint: tokenAddress,
      amount: 0.001, // Very small amount
      denominatedInSol: "true",
      slippage: 50, // Higher slippage
      priorityFee: 0.0001, // Higher priority fee
      pool: "pump", // Force pump pool
      skipPreflight: "false" // Enable simulation
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`https://pumpportal.fun/api/trade?api-key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.signature) {
      console.log(`✅ Got signature: ${data.signature}`);
      console.log(`🔗 Check: https://solscan.io/tx/${data.signature}`);
      
      // Wait and check transaction status
      console.log('\n2. Checking transaction status...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');
      
      try {
        const txInfo = await connection.getTransaction(data.signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0
        });
        
        if (txInfo) {
          if (txInfo.meta && txInfo.meta.err) {
            console.log('❌ Transaction failed:', JSON.stringify(txInfo.meta.err, null, 2));
          } else {
            console.log('✅ Transaction successful!');
          }
        } else {
          console.log('⚠️ Transaction not found on-chain');
        }
      } catch (txError) {
        console.log('❌ Error checking transaction:', txError.message);
      }
    } else {
      console.log('❌ No signature returned');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testTokenStatus();

console.log('\n🎯 Possible Issues:');
console.log('1. Token might be bonded (no longer on bonding curve)');
console.log('2. Token might not exist on Pump.fun');
console.log('3. API key might not have trading permissions');
console.log('4. Network congestion');
console.log('5. Insufficient SOL for transaction fees');

console.log('\n💡 Solutions:');
console.log('1. Check if token is still on Pump.fun bonding curve');
console.log('2. Try with a different token address');
console.log('3. Increase SOL amount and priority fee');
console.log('4. Check PumpPortal API documentation for changes');
