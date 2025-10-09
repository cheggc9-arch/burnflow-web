#!/usr/bin/env node

console.log('🔍 Testing Jupiter API Connection');
console.log('=================================\n');

async function testJupiterConnection() {
    try {
        console.log('1. Testing basic Jupiter API connectivity...');
        
        const jupiterUrl = 'https://quote-api.jup.ag/v6/quote';
        const params = new URLSearchParams({
            inputMint: 'So11111111111111111111111111111111111111112', // SOL
            outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC (common pair)
            amount: '1000000', // 0.001 SOL
            slippageBps: '100',
            onlyDirectRoutes: 'false',
            asLegacyTransaction: 'false'
        });
        
        console.log(`   - Testing URL: ${jupiterUrl}?${params}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${jupiterUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'RewardFlow-Burn-App/1.0',
                'Cache-Control': 'no-cache'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const quote = await response.json();
            console.log('   ✅ Jupiter API is accessible');
            console.log(`   - Response status: ${response.status}`);
            console.log(`   - Quote received: ${quote.outAmount ? 'Yes' : 'No'}`);
            
            if (quote.outAmount) {
                console.log(`   - Sample output: ${quote.outAmount} tokens`);
            }
        } else {
            console.log(`   ❌ Jupiter API returned error: ${response.status} ${response.statusText}`);
        }
        
    } catch (error) {
        console.log(`   ❌ Jupiter API connection failed: ${error.message}`);
        
        if (error.name === 'AbortError') {
            console.log('   - This is a timeout error - Jupiter API might be slow');
        } else if (error.message.includes('fetch failed')) {
            console.log('   - This is a network error - check your internet connection');
        } else {
            console.log('   - This is an unknown error');
        }
    }
}

async function testPumpFunToken() {
    try {
        console.log('\n2. Testing Pump.fun token specifically...');
        
        const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS || 'Ej8FUr9Sjn3Qwf77gzrLyCyu1EFq2K8UdV2fqYytpump';
        console.log(`   - Testing token: ${tokenAddress}`);
        
        const jupiterUrl = 'https://quote-api.jup.ag/v6/quote';
        const params = new URLSearchParams({
            inputMint: 'So11111111111111111111111111111111111111112', // SOL
            outputMint: tokenAddress,
            amount: '1000000', // 0.001 SOL
            slippageBps: '100',
            onlyDirectRoutes: 'false',
            asLegacyTransaction: 'false'
        });
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${jupiterUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'RewardFlow-Burn-App/1.0',
                'Cache-Control': 'no-cache'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const quote = await response.json();
            console.log('   ✅ Pump.fun token is accessible via Jupiter');
            console.log(`   - Output amount: ${quote.outAmount || 'N/A'}`);
            
            if (quote.outAmount && quote.outAmount !== '0') {
                console.log('   - Token has liquidity on Jupiter');
            } else {
                console.log('   - Token has no liquidity on Jupiter');
            }
        } else {
            console.log(`   ❌ Pump.fun token not accessible: ${response.status} ${response.statusText}`);
        }
        
    } catch (error) {
        console.log(`   ❌ Pump.fun token test failed: ${error.message}`);
    }
}

async function runTests() {
    await testJupiterConnection();
    await testPumpFunToken();
    
    console.log('\n🎉 Jupiter API Connection Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ Jupiter API connectivity tested');
    console.log('✅ Pump.fun token accessibility tested');
    
    console.log('\n💡 If Jupiter API is failing:');
    console.log('1. Check your internet connection');
    console.log('2. Try again in a few minutes (Jupiter might be down)');
    console.log('3. Verify your token address is correct');
    console.log('4. Check if the token has liquidity on Jupiter');
    
    console.log('\n🚀 The retry logic should help with temporary network issues!');
}

runTests().catch(console.error);
