console.log('🔍 Simple PumpPortal Debug Test');
console.log('================================\n');

// Load environment variables
require('dotenv').config();

console.log('1. Environment Variables:');
console.log(`   TOKEN_CONTRACT_ADDRESS: ${process.env.TOKEN_CONTRACT_ADDRESS || 'NOT SET'}`);
console.log(`   PUMP_PORTAL_API_KEY: ${process.env.PUMP_PORTAL_API_KEY ? 'SET' : 'NOT SET'}`);
console.log(`   NEXT_PUMP_PORTAL_API_KEY: ${process.env.NEXT_PUMP_PORTAL_API_KEY ? 'SET' : 'NOT SET'}`);
console.log(`   BURN_WALLET_PRIVATE_KEY: ${process.env.BURN_WALLET_PRIVATE_KEY ? 'SET' : 'NOT SET'}`);

console.log('\n2. Token Address Validation:');
try {
  const { PublicKey } = require('@solana/web3.js');
  const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS || 'Ej8FUr9Sjn3Qwf77gzrLyCyu1EFq2K8UdV2fqYytpump';
  const tokenMint = new PublicKey(tokenAddress);
  console.log(`   ✅ Token address is valid: ${tokenMint.toBase58()}`);
} catch (error) {
  console.log(`   ❌ Invalid token address: ${error.message}`);
}

console.log('\n3. API Key Check:');
const apiKey = process.env.PUMP_PORTAL_API_KEY || process.env.NEXT_PUMP_PORTAL_API_KEY;
if (apiKey) {
  console.log(`   ✅ API key is set: ${apiKey.substring(0, 8)}...`);
} else {
  console.log('   ❌ API key not set - this will cause failures');
}

console.log('\n4. Wallet Balance Check:');
async function checkBalance() {
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
}

checkBalance();

console.log('\n🎯 Debugging Tips:');
console.log('1. The transaction signature was returned but failed on-chain');
console.log('2. This usually means insufficient SOL or invalid parameters');
console.log('3. Check the Solscan link for detailed error information');
console.log('4. Try with a larger SOL amount (0.01+ SOL)');
console.log('5. Verify the token is still on the Pump.fun bonding curve');

console.log('\n✅ Simple debug test complete!');
