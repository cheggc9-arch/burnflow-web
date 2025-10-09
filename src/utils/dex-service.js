#!/usr/bin/env node

const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');

class DexService {
    constructor() {
        this.connection = null;
        this.tokenMint = null;
        this.solMint = new PublicKey('So11111111111111111111111111111111111111112'); // Wrapped SOL
    }

    async initialize() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        this.connection = new Connection(rpcUrl, 'confirmed');
        
        const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
        if (!tokenContractAddress) {
            throw new Error('TOKEN_CONTRACT_ADDRESS not set');
        }
        
        this.tokenMint = new PublicKey(tokenContractAddress);
        console.log(`🔗 DEX Service initialized for token: ${this.tokenMint.toBase58()}`);
    }

    /**
     * Buy Pump.fun tokens using PumpPortal API
     */
    async buyPumpFunTokens(walletKeypair, solAmount) {
        try {
            console.log(`🔄 Buying Pump.fun tokens with ${solAmount.toFixed(4)} SOL via PumpPortal...`);
            
            // For Pump.fun tokens, we need to use PumpPortal API
            // Pump.fun tokens are traded on the bonding curve via PumpPortal
            
            // Use PumpPortal service for buying tokens
            const PumpPortalService = require('./pumpportal-service');
            const pumpPortalService = new PumpPortalService();
            await pumpPortalService.initialize();
            
            // Execute buy via PumpPortal
            const buyResult = await pumpPortalService.buyPumpFunTokens(walletKeypair, solAmount);
            
            console.log(`✅ Pump.fun token buyback completed via PumpPortal!`);
            console.log(`📝 Transaction: ${buyResult.signature}`);
            console.log(`🪙 Tokens received: ${buyResult.tokensReceived.toFixed(0)}`);
            
            return {
                success: true,
                tokensReceived: buyResult.tokensReceived,
                signature: buyResult.signature
            };
            
        } catch (error) {
            console.error('❌ Pump.fun buyback failed:', error.message);
            throw error; // Don't fallback - throw the error so the transaction fails
        }
    }

    /**
     * Get quote from Jupiter API for Pump.fun token with retry logic
     */
    async getJupiterQuote(solAmount, retryCount = 0) {
        const maxRetries = 3;
        const retryDelay = 2000; // 2 seconds
        
        try {
            console.log(`🔍 Getting Jupiter quote for Pump.fun token... (attempt ${retryCount + 1}/${maxRetries + 1})`);
            console.log(`   - Input: ${solAmount.toFixed(4)} SOL`);
            console.log(`   - Token: ${this.tokenMint.toBase58()}`);
            
            // Jupiter API endpoint for quote
            const jupiterUrl = 'https://quote-api.jup.ag/v6/quote';
            const params = new URLSearchParams({
                inputMint: this.solMint.toBase58(),
                outputMint: this.tokenMint.toBase58(),
                amount: Math.floor(solAmount * LAMPORTS_PER_SOL).toString(),
                slippageBps: '100', // 1% slippage
                onlyDirectRoutes: 'false',
                asLegacyTransaction: 'false'
            });
            
            console.log(`   - Jupiter URL: ${jupiterUrl}?${params}`);
            
            // Add timeout and better error handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            try {
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
                
                if (!response.ok) {
                    throw new Error(`Jupiter API error: ${response.status} ${response.statusText}`);
                }
                
                const quote = await response.json();
                
                if (!quote.outAmount || quote.outAmount === '0') {
                    throw new Error('No liquidity available for this token pair');
                }
                
                const tokensOut = parseInt(quote.outAmount) / Math.pow(10, 6); // Assuming 6 decimals
                const priceImpact = parseFloat(quote.priceImpactPct) * 100;
                
                console.log(`   ✅ Jupiter quote received:`);
                console.log(`     - Output: ${tokensOut.toFixed(0)} tokens`);
                console.log(`     - Price Impact: ${priceImpact.toFixed(2)}%`);
                
                return {
                    success: true,
                    tokensOut: tokensOut,
                    priceImpact: priceImpact,
                    quote: quote
                };
                
            } catch (fetchError) {
                clearTimeout(timeoutId);
                
                // If it's a network error and we haven't exceeded retries, try again
                if (retryCount < maxRetries && (
                    fetchError.name === 'AbortError' || 
                    fetchError.message.includes('fetch failed') ||
                    fetchError.message.includes('network')
                )) {
                    console.log(`   ⚠️ Network error, retrying in ${retryDelay/1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    return this.getJupiterQuote(solAmount, retryCount + 1);
                }
                
                throw fetchError;
            }
            
        } catch (error) {
            console.error(`❌ Jupiter quote failed (attempt ${retryCount + 1}):`, error.message);
            
            // If we've exhausted retries, return failure
            if (retryCount >= maxRetries) {
                return {
                    success: false,
                    error: `Failed after ${maxRetries + 1} attempts: ${error.message}`
                };
            }
            
            // Otherwise, retry
            console.log(`   ⚠️ Retrying in ${retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return this.getJupiterQuote(solAmount, retryCount + 1);
        }
    }

    /**
     * Execute Jupiter swap
     */
    async executeJupiterSwap(walletKeypair, quote) {
        try {
            console.log('🔄 Executing Jupiter swap...');
            
            // Get swap transaction from Jupiter
            const swapUrl = 'https://quote-api.jup.ag/v6/swap';
            const swapRequest = {
                quoteResponse: quote.quote,
                userPublicKey: walletKeypair.publicKey.toBase58(),
                wrapAndUnwrapSol: true,
                dynamicComputeUnitLimit: true,
                prioritizationFeeLamports: 'auto'
            };
            
            const response = await fetch(swapUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(swapRequest)
            });
            
            if (!response.ok) {
                throw new Error(`Jupiter swap API error: ${response.status} ${response.statusText}`);
            }
            
            const swapResponse = await response.json();
            
            // Deserialize and sign transaction
            const transaction = Transaction.from(Buffer.from(swapResponse.swapTransaction, 'base64'));
            transaction.sign(walletKeypair);
            
            // Send transaction
            const signature = await this.connection.sendRawTransaction(transaction.serialize());
            
            // Confirm transaction
            await this.connection.confirmTransaction(signature, 'confirmed');
            
            const tokensReceived = parseInt(quote.quote.outAmount) / Math.pow(10, 6);
            
            return {
                success: true,
                tokensReceived: tokensReceived,
                signature: signature
            };
            
        } catch (error) {
            console.error('❌ Jupiter swap execution failed:', error.message);
            return {
                success: false,
                tokensReceived: 0,
                signature: null,
                error: error.message
            };
        }
    }

}

module.exports = DexService;
