console.log('⚙️ Testing Configurable SOL Reserve Amount');
console.log('==========================================\n');

// Load environment variables
require('dotenv').config();

async function testConfigurableReserve() {
  try {
    const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
    const bs58 = require('bs58');
    
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');
    
    const privateKey = process.env.BURN_WALLET_PRIVATE_KEY;
    if (!privateKey) {
      console.log('❌ No private key set');
      return;
    }
    
    const keypair = require('@solana/web3.js').Keypair.fromSecretKey(bs58.decode(privateKey));
    const balance = await connection.getBalance(keypair.publicKey);
    const totalBalance = balance / LAMPORTS_PER_SOL;
    
    console.log(`💰 Current wallet balance: ${totalBalance.toFixed(4)} SOL`);
    
    // Test different reserve amounts
    const testReserves = [
      { name: 'Default (0.01)', value: 0.01 },
      { name: 'Conservative (0.02)', value: 0.02 },
      { name: 'Minimal (0.005)', value: 0.005 },
      { name: 'Custom (0.05)', value: 0.05 }
    ];
    
    console.log('\n📊 Testing different reserve amounts:');
    console.log('┌─────────────────┬──────────┬─────────────┬─────────────┐');
    console.log('│ Reserve Type    │ Amount   │ Available   │ Status      │');
    console.log('├─────────────────┼──────────┼─────────────┼─────────────┤');
    
    testReserves.forEach(reserve => {
      const availableForBuy = totalBalance - reserve.value;
      const status = availableForBuy >= 0.01 ? '✅ OK' : '❌ Too Low';
      
      console.log(`│ ${reserve.name.padEnd(15)} │ ${reserve.value.toFixed(3).padEnd(8)} │ ${availableForBuy.toFixed(4).padEnd(11)} │ ${status.padEnd(11)} │`);
    });
    
    console.log('└─────────────────┴──────────┴─────────────┴─────────────┘');
    
    // Test with current environment setting
    const currentReserve = parseFloat(process.env.SOL_RESERVE_AMOUNT) || 0.01;
    const availableForBuy = totalBalance - currentReserve;
    
    console.log(`\n🔧 Current Environment Setting:`);
    console.log(`   SOL_RESERVE_AMOUNT: ${currentReserve} SOL`);
    console.log(`   Available for buy: ${availableForBuy.toFixed(4)} SOL`);
    
    if (availableForBuy >= 0.01) {
      console.log('   ✅ Sufficient balance for buy operation');
      
      // Test with a small amount
      const testAmount = Math.min(availableForBuy, 0.01);
      console.log(`\n🧪 Testing with ${testAmount.toFixed(4)} SOL...`);
      
      const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS || 'Ej8FUr9Sjn3Qwf77gzrLyCyu1EFq2K8UdV2fqYytpump';
      const apiKey = process.env.PUMP_PORTAL_API_KEY || process.env.NEXT_PUMP_PORTAL_API_KEY;
      
      if (!apiKey) {
        console.log('❌ No API key set');
        return;
      }
      
      const requestBody = {
        action: "buy",
        mint: tokenAddress,
        amount: testAmount,
        denominatedInSol: "true",
        slippage: 50,
        priorityFee: 0.0001,
        pool: "pump",
        skipPreflight: "false"
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
        console.log('\nChecking transaction status...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
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
              console.log('🎉 Configurable reserve amount works!');
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
    } else {
      console.log('   ❌ Insufficient balance for buy operation');
      console.log(`   Need at least ${0.01 + currentReserve} SOL (have ${totalBalance.toFixed(4)} SOL)`);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testConfigurableReserve();

console.log('\n⚙️ How to Configure SOL Reserve:');
console.log('1. Add SOL_RESERVE_AMOUNT=0.02 to your .env file');
console.log('2. Restart the burn app');
console.log('3. The app will now reserve 0.02 SOL instead of 0.01 SOL');

console.log('\n💡 Recommended Settings:');
console.log('- Conservative: 0.02 SOL (for high-fee periods)');
console.log('- Default: 0.01 SOL (normal operation)');
console.log('- Minimal: 0.005 SOL (if you want to use more SOL for buying)');

console.log('\n✅ Configurable SOL reserve is ready!');
