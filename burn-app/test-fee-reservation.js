console.log('💰 Testing Fee Reservation Logic');
console.log('=================================\n');

// Load environment variables
require('dotenv').config();

async function testFeeReservation() {
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
    
    // Test fee reservation logic
    const feeReserve = 0.01;
    const availableForBuy = totalBalance - feeReserve;
    
    console.log(`💰 Fee reserve: ${feeReserve} SOL`);
    console.log(`💰 Available for buy: ${availableForBuy.toFixed(4)} SOL`);
    
    if (availableForBuy < 0.01) {
      console.log('❌ Insufficient balance for buy operation');
      console.log(`   Need at least ${0.01 + feeReserve} SOL (have ${totalBalance.toFixed(4)} SOL)`);
    } else {
      console.log('✅ Sufficient balance for buy operation');
      
      // Test with a small amount
      const testAmount = Math.min(availableForBuy, 0.01); // Use 0.01 SOL or available amount
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
              console.log('🎉 Fee reservation logic works!');
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
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testFeeReservation();

console.log('\n📊 Fee Reservation Logic:');
console.log('┌─────────────────┬──────────┬─────────────┐');
console.log('│ Balance Type    │ Amount   │ Purpose     │');
console.log('├─────────────────┼──────────┼─────────────┤');
console.log('│ Total Balance   │ X SOL    │ Available   │');
console.log('│ Fee Reserve     │ 0.01 SOL │ Transaction │');
console.log('│ Available Buy   │ X-0.01   │ Token Buy   │');
console.log('└─────────────────┴──────────┴─────────────┘');

console.log('\n✅ This should prevent "insufficient lamports" errors!');
