console.log('🔧 Testing Improved PumpPortal Parameters');
console.log('==========================================\n');

// Load environment variables
require('dotenv').config();

async function testImprovedParams() {
  try {
    const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS || 'Ej8FUr9Sjn3Qwf77gzrLyCyu1EFq2K8UdV2fqYytpump';
    const apiKey = process.env.PUMP_PORTAL_API_KEY || process.env.NEXT_PUMP_PORTAL_API_KEY;
    
    if (!apiKey) {
      console.log('❌ No API key set');
      return;
    }
    
    console.log('Testing with improved parameters:');
    console.log('- Slippage: 50% (was 10%)');
    console.log('- Priority Fee: 0.0001 SOL (was 0.00005)');
    console.log('- Pool: pump (was auto)');
    console.log('- Max Amount: 0.1 SOL per transaction');
    
    // Test with the same amount that failed before
    const testAmount = 0.0397; // Same as the failed transaction
    
    const requestBody = {
      action: "buy",
      mint: tokenAddress,
      amount: testAmount,
      denominatedInSol: "true",
      slippage: 50, // Higher slippage
      priorityFee: 0.0001, // Higher priority fee
      pool: "pump", // Force pump pool
      skipPreflight: "false" // Enable simulation
    };
    
    console.log(`\nTesting with ${testAmount} SOL...`);
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
      console.log('\nChecking transaction status...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const { Connection } = require('@solana/web3.js');
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
            console.log('🎉 Improved parameters work!');
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

testImprovedParams();

console.log('\n📊 Parameter Comparison:');
console.log('┌─────────────────┬──────────┬─────────────┐');
console.log('│ Parameter       │ Old      │ New         │');
console.log('├─────────────────┼──────────┼─────────────┤');
console.log('│ Slippage        │ 10%      │ 50%         │');
console.log('│ Priority Fee    │ 0.00005  │ 0.0001      │');
console.log('│ Pool            │ auto     │ pump        │');
console.log('│ Max Amount      │ None     │ 0.1 SOL     │');
console.log('└─────────────────┴──────────┴─────────────┘');

console.log('\n✅ Improved parameters should work better for Pump.fun tokens!');
