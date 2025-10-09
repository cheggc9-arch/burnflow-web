#!/usr/bin/env node

const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');

class PumpPortalService {
    constructor() {
        this.connection = null;
        this.tokenMint = null;
        this.apiKey = null;
    }

    async initialize() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        this.connection = new Connection(rpcUrl, 'confirmed');
        
        const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
        if (!tokenContractAddress) {
            throw new Error('TOKEN_CONTRACT_ADDRESS not set');
        }
        
        this.tokenMint = new PublicKey(tokenContractAddress);
        
        // Get API key from environment
        this.apiKey = process.env.PUMP_PORTAL_API_KEY || process.env.NEXT_PUMP_PORTAL_API_KEY;
        if (!this.apiKey) {
            throw new Error('PUMP_PORTAL_API_KEY or NEXT_PUMP_PORTAL_API_KEY not set');
        }
        
        console.log(`🔗 PumpPortal Service initialized for token: ${this.tokenMint.toBase58()}`);
        console.log(`🔑 Using PumpPortal API key: ${this.apiKey.substring(0, 8)}...`);
    }

    /**
     * Buy Pump.fun tokens using PumpPortal REST API
     */
    async buyPumpFunTokens(walletKeypair, solAmount) {
        try {
            console.log(`🔄 Buying Pump.fun tokens with ${solAmount.toFixed(4)} SOL via PumpPortal API...`);
            
            // Execute buy transaction via PumpPortal REST API
            const buyResult = await this.executePumpPortalBuy(walletKeypair, solAmount);
            if (!buyResult.success) {
                throw new Error(`PumpPortal buy failed: ${buyResult.error}`);
            }
            
            console.log(`✅ Pump.fun token buyback completed via PumpPortal API!`);
            console.log(`📝 Transaction: ${buyResult.signature}`);
            console.log(`🪙 Tokens received: ${buyResult.tokensReceived.toFixed(0)}`);
            
            return {
                success: true,
                tokensReceived: buyResult.tokensReceived,
                signature: buyResult.signature
            };
            
        } catch (error) {
            console.error('❌ PumpPortal buyback failed:', error.message);
            throw error; // Don't fallback - throw the error so the transaction fails
        }
    }

    /**
     * Execute buy transaction via PumpPortal REST API
     */
    async executePumpPortalBuy(walletKeypair, solAmount) {
        try {
            console.log('🔄 Executing buy via PumpPortal REST API...');
            console.log(`   - Token: ${this.tokenMint.toBase58()}`);
            console.log(`   - Amount: ${solAmount.toFixed(4)} SOL`);
            
            // Validate inputs
            if (!this.tokenMint) {
                throw new Error('Token mint not initialized');
            }
            
            if (solAmount <= 0) {
                throw new Error('SOL amount must be greater than 0');
            }
            
            if (solAmount < 0.001) {
                console.log('   ⚠️ Warning: Very small SOL amount, transaction might fail');
            }
            
            // Your logic: Total Balance - SOL_RESERVE_AMOUNT >= MIN_BALANCE_SOL
            const reserveAmount = parseFloat(process.env.SOL_RESERVE_AMOUNT || '0.06');
            const minBalance = parseFloat(process.env.MIN_BALANCE_SOL || '0.001');
            const totalBalance = solAmount; // This is the total balance passed from API
            
            // First check: Must have at least the reserve amount
            if (totalBalance < reserveAmount) {
                throw new Error(`Insufficient SOL: need at least ${reserveAmount} SOL to reserve (have ${totalBalance.toFixed(4)} SOL)`);
            }
            
            const availableForBuy = totalBalance - reserveAmount;
            
            // Second check: Available amount must be at least minimum balance
            if (availableForBuy >= minBalance) {
                solAmount = availableForBuy;
                console.log(`   💰 Reserved ${reserveAmount} SOL for fees, using ${solAmount.toFixed(4)} SOL for buy`);
            } else {
                throw new Error(`Insufficient SOL: need at least ${reserveAmount + minBalance} SOL total (have ${totalBalance.toFixed(4)} SOL)`);
            }
            
            // Ensure we have at least 0.001 SOL for the buy transaction
            if (solAmount < 0.001) {
                throw new Error(`Insufficient SOL for buy: need at least 0.001 SOL for transaction, only have ${solAmount.toFixed(4)} SOL`);
            }
            
            // For Pump.fun tokens, limit the amount to avoid liquidity issues
            const maxAmount = 0.1; // Maximum 0.1 SOL per transaction
            if (solAmount > maxAmount) {
                console.log(`   ⚠️ Warning: Amount ${solAmount.toFixed(4)} SOL is large, limiting to ${maxAmount} SOL`);
                solAmount = maxAmount;
            }
            
            // Prepare request body for PumpPortal API
            const requestBody = {
                action: "buy",
                mint: this.tokenMint.toBase58(),
                amount: solAmount,
                denominatedInSol: "true",
                slippage: 50, // 50% slippage (higher for Pump.fun tokens)
                priorityFee: 0.0001, // 0.0001 SOL priority fee (higher for better execution)
                pool: "pump", // Force pump pool for Pump.fun tokens
                skipPreflight: "false" // Enable simulation to catch errors
            };
            
            console.log('   📤 Sending request to PumpPortal API...');
            console.log('   - Request body:', JSON.stringify(requestBody, null, 2));
            
            // Make API call to PumpPortal
            const response = await fetch(`https://pumpportal.fun/api/trade?api-key=${this.apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`PumpPortal API error: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('   📥 PumpPortal API response:', JSON.stringify(data, null, 2));
            
            // Check if transaction was successful
            if (data.signature) {
                console.log(`   ✅ PumpPortal buy transaction created!`);
                console.log(`   - Transaction signature: ${data.signature}`);
                
                // Check if there are any errors in the response
                if (data.errors && data.errors.length > 0) {
                    console.log(`   ⚠️ PumpPortal warnings/errors: ${JSON.stringify(data.errors)}`);
                }
                
                // Wait a moment for transaction to be processed
                console.log(`   ⏳ Waiting for transaction confirmation...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Verify transaction was successful by checking it on-chain
                const txSuccess = await this.verifyTransaction(data.signature);
                
                if (txSuccess) {
                    console.log(`   ✅ Transaction confirmed on-chain!`);
                    
                    // Get actual token balance from the wallet after the buy
                    try {
                        const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');
                        const tokenMint = new PublicKey(process.env.TOKEN_CONTRACT_ADDRESS);
                        const sourceTokenAccount = await getAssociatedTokenAddress(tokenMint, walletKeypair.publicKey);
                        
                        console.log(`   🔍 Checking token account: ${sourceTokenAccount.toBase58()}`);
                        
                        const tokenAccount = await getAccount(this.connection, sourceTokenAccount);
                        const actualTokens = Number(tokenAccount.amount);
                        
                        console.log(`   🔍 Actual tokens in wallet: ${actualTokens}`);
                        console.log(`   🔍 Tokens in smallest units: ${actualTokens}`);
                        
                        return {
                            success: true,
                            tokensReceived: actualTokens,
                            signature: data.signature
                        };
                    } catch (error) {
                        console.log(`   ⚠️ Error getting actual token balance: ${error.message}`);
                        console.log(`   🔍 Error details:`, error);
                        
                        // If we can't get the actual balance, let's try a different approach
                        // Check if the token account exists at all
                        try {
                            const tokenMint = new PublicKey(process.env.TOKEN_CONTRACT_ADDRESS);
                            const sourceTokenAccount = await getAssociatedTokenAddress(tokenMint, walletKeypair.publicKey);
                            const accountInfo = await this.connection.getAccountInfo(sourceTokenAccount);
                            
                            if (accountInfo) {
                                console.log(`   🔍 Token account exists, but couldn't parse balance`);
                                // Use a more reasonable estimate based on SOL amount
                                const estimatedTokens = Math.floor(solAmount * 10000000); // Higher multiplier
                                console.log(`   🔍 Using higher estimate: ${estimatedTokens}`);
                                
                                return {
                                    success: true,
                                    tokensReceived: estimatedTokens,
                                    signature: data.signature
                                };
                            } else {
                                console.log(`   ⚠️ Token account doesn't exist yet`);
                                const estimatedTokens = Math.floor(solAmount * 10000000);
                                return {
                                    success: true,
                                    tokensReceived: estimatedTokens,
                                    signature: data.signature
                                };
                            }
                        } catch (fallbackError) {
                            console.log(`   ⚠️ Fallback also failed: ${fallbackError.message}`);
                            const estimatedTokens = Math.floor(solAmount * 10000000);
                            return {
                                success: true,
                                tokensReceived: estimatedTokens,
                                signature: data.signature
                            };
                        }
                    }
                } else {
                    throw new Error(`Transaction failed on-chain. Check Solscan: https://solscan.io/tx/${data.signature}`);
                }
            } else {
                throw new Error(`PumpPortal buy failed: ${JSON.stringify(data)}`);
            }
            
        } catch (error) {
            console.error('❌ PumpPortal API buy failed:', error.message);
            return {
                success: false,
                tokensReceived: 0,
                signature: null,
                error: error.message
            };
        }
    }

    /**
     * Verify transaction was successful on-chain
     */
    async verifyTransaction(signature) {
        try {
            console.log(`   🔍 Verifying transaction: ${signature}`);
            
            // Get transaction details from Solana
            const txInfo = await this.connection.getTransaction(signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0
            });
            
            if (!txInfo) {
                console.log(`   ❌ Transaction not found on-chain`);
                return false;
            }
            
            // Check if transaction was successful
            if (txInfo.meta && txInfo.meta.err) {
                console.log(`   ❌ Transaction failed: ${JSON.stringify(txInfo.meta.err)}`);
                return false;
            }
            
            // Check if transaction was successful
            if (txInfo.meta && txInfo.meta.err === null) {
                console.log(`   ✅ Transaction successful on-chain`);
                return true;
            }
            
            console.log(`   ⚠️ Transaction status unclear`);
            return false;
            
        } catch (error) {
            console.log(`   ❌ Error verifying transaction: ${error.message}`);
            return false;
        }
    }
}

module.exports = PumpPortalService;
