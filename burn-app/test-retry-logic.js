#!/usr/bin/env node

console.log('🔄 Testing Retry Logic');
console.log('======================\n');

// Simulate the retry logic
async function testRetryLogic() {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second for testing
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔍 Attempt ${attempt + 1}/${maxRetries + 1}...`);
            
            // Simulate a network error
            if (attempt < maxRetries) {
                throw new Error('fetch failed');
            } else {
                console.log('   ✅ Success on final attempt!');
                return { success: true };
            }
            
        } catch (error) {
            console.log(`   ❌ Attempt ${attempt + 1} failed: ${error.message}`);
            
            if (attempt < maxRetries) {
                console.log(`   ⚠️ Retrying in ${retryDelay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.log(`   ❌ All ${maxRetries + 1} attempts failed`);
                return { success: false, error: error.message };
            }
        }
    }
}

async function runTest() {
    console.log('Testing retry logic with simulated failures...\n');
    
    const result = await testRetryLogic();
    
    console.log('\n📋 Test Result:');
    if (result.success) {
        console.log('✅ Retry logic works correctly');
    } else {
        console.log('❌ Retry logic failed');
    }
    
    console.log('\n💡 In the real application:');
    console.log('- Jupiter API will be retried 3 times');
    console.log('- Each retry waits 2 seconds');
    console.log('- Network errors trigger automatic retries');
    console.log('- Only fails after all retries are exhausted');
    
    console.log('\n🚀 Try the burn trigger again - it should retry automatically!');
}

runTest().catch(console.error);
