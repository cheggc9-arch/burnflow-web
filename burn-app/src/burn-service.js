#!/usr/bin/env node

const { config, validateConfig } = require('./config');

class BurnService {
    constructor(config) {
        this.config = config;
        this.isRunning = false;
        this.intervalId = null;
    }

    async start() {
        console.log('🔥 Starting burn service...');
        this.isRunning = true;
        
        // Start checking global timer every 10 seconds
        this.intervalId = setInterval(() => {
            console.log('🕐 Checking global timer...');
            this.checkAndExecuteBurn();
        }, 10 * 1000); // Check every 10 seconds
        
        console.log(`✅ Burn service started - checking global timer every 10 seconds`);
        
        // Also check immediately
        console.log('🕐 Initial timer check...');
        this.checkAndExecuteBurn();
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('🛑 Burn service stopped');
    }

                async executeBurnCycle() {
                    try {
                        console.log('🔥 Executing burn cycle...');

                        // Get real burn wallet balance
                        const balance = await this.getBurnWalletBalance();
                        console.log(`💰 Burn wallet balance: ${balance.toFixed(4)} SOL`);

                        // Check if buying is enabled
                        const enableBuy = process.env.ENABLE_BUY_TOKENS === 'true';
                        
                        if (enableBuy) {
                            // Only check SOL reserve when buying tokens
                            const reserveAmount = parseFloat(process.env.SOL_RESERVE_AMOUNT || '0.06');
                            const minBalance = parseFloat(process.env.MIN_BALANCE_SOL || '0.001');
                            
                            // First check: Must have at least the reserve amount
                            if (balance < reserveAmount) {
                                console.log(`⚠️ Insufficient balance for burn operation. Need at least ${reserveAmount} SOL to reserve (have ${balance.toFixed(4)} SOL)`);
                                console.log(`💤 Skipping burn cycle - insufficient SOL. Timer will restart.`);
                                return { status: 'insufficient_sol', message: 'Insufficient SOL balance' };
                            }
                            
                            const availableForBuy = balance - reserveAmount;
                            
                            // Second check: Available amount must be at least minimum balance
                            if (availableForBuy >= minBalance) {
                            console.log('🔄 Starting real token buyback...');
                            console.log(`💰 Total balance: ${balance.toFixed(4)} SOL`);
                            console.log(`💰 Reserve amount: ${reserveAmount} SOL`);
                            console.log(`💰 Available for buy: ${availableForBuy.toFixed(4)} SOL`);

                            // Perform real buyback operation (pass total balance, let service handle reserve)
                            const buybackResult = await this.performRealBuyback(balance);

                            if (buybackResult.success && buybackResult.tokensReceived > 0) {
                                // Check if burning is enabled
                                const enableBurn = process.env.ENABLE_BURN_AFTER_BUY === 'true';
                                
                                if (enableBurn) {
                                    console.log('🔥 Performing real token burn...');

                                    // Perform real burn operation
                                    const burnResult = await this.performRealBurn(buybackResult.tokensReceived);

                                    if (burnResult.success) {
                                        // Record real burn in Supabase
                                        await this.recordBurnInSupabase({
                                            solAmount: balance,
                                            tokensBurned: burnResult.tokensBurned || buybackResult.tokensReceived,
                                            buySignature: buybackResult.signature,
                                            burnSignature: burnResult.signature,
                                            status: 'success'
                                        });

                                        console.log('✅ Real burn cycle completed successfully');
                                        console.log(`📊 Bought: ${buybackResult.tokensReceived} tokens`);
                                        console.log(`🔥 Burned: ${burnResult.tokensBurned || buybackResult.tokensReceived} tokens`);
                                        console.log(`💸 Buy TX: ${buybackResult.signature}`);
                                        console.log(`🔥 Burn TX: ${burnResult.signature}`);
                                        return { status: 'success', message: 'Burn completed successfully' };
                                    } else {
                                        console.error('❌ Burn operation failed:', burnResult.error);
                                        
                                        // Record buy-only operation
                                        await this.recordBurnInSupabase({
                                            solAmount: balance,
                                            tokensBurned: 0, // No tokens burned
                                            buySignature: buybackResult.signature,
                                            burnSignature: null,
                                            status: 'buy_only'
                                        });
                                    }
                                } else {
                                    console.log('⚠️ Burning disabled - only buying tokens');
                                    console.log(`📊 Bought: ${buybackResult.tokensReceived} tokens (not burned)`);
                                    console.log(`💸 Buy TX: ${buybackResult.signature}`);
                                    
                                    // Record buy-only operation
                                    await this.recordBurnInSupabase({
                                        solAmount: balance,
                                        tokensBurned: 0, // No tokens burned
                                        buySignature: buybackResult.signature,
                                        burnSignature: null,
                                        status: 'buy_only'
                                    });
                                    return { status: 'success', message: 'Buy completed successfully' };
                                }
                            } else {
                                console.error('❌ Buyback operation failed:', buybackResult.error);
                                return { status: 'failed', message: 'Buyback operation failed' };
                            }
                            } else {
                                console.log(`⚠️ Insufficient balance (${balance.toFixed(4)} SOL) for burn operation. Minimum required: ${minBalance} SOL`);
                                console.log(`💤 Skipping burn cycle - insufficient SOL. Timer will restart.`);
                                return { status: 'insufficient_sol', message: 'Insufficient SOL balance' };
                            }
                        } else {
                            // When not buying, no SOL balance check needed - just burn existing tokens
                            console.log('⚠️ Buying tokens is disabled - checking for existing tokens...');
                            console.log(`💰 Total balance: ${balance.toFixed(4)} SOL`);
                            console.log(`🔥 Burning existing tokens (no SOL check needed)`);
                            
                            // Check for existing tokens in the wallet
                            try {
                                const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');
                                const tokenMint = new PublicKey(process.env.TOKEN_CONTRACT_ADDRESS);
                                const sourceTokenAccount = await getAssociatedTokenAddress(tokenMint, keypair.publicKey);
                                
                                const tokenAccount = await getAccount(connection, sourceTokenAccount);
                                const existingTokens = Number(tokenAccount.amount);
                                
                                console.log(`🔍 Found ${existingTokens} existing tokens in wallet`);
                                
                                if (existingTokens > 0) {
                                    // Check if burning is enabled
                                    const enableBurn = process.env.ENABLE_BURN_AFTER_BUY === 'true';
                                    
                                    if (enableBurn) {
                                        console.log('🔥 Performing real token burn...');
                                        
                                        // Perform real burn operation
                                        const burnResult = await this.performRealBurn(existingTokens);
                                        
                                        if (burnResult.success) {
                                            // Record real burn in Supabase
                                            await this.recordBurnInSupabase({
                                                solAmount: 0, // No SOL used since we didn't buy
                                                tokensBurned: existingTokens,
                                                buySignature: null, // No buy signature
                                                burnSignature: burnResult.signature,
                                                status: 'success'
                                            });
                                            
                                            console.log('✅ Real burn cycle completed successfully');
                                            console.log(`🔥 Burned: ${existingTokens} existing tokens`);
                                            console.log(`🔥 Burn TX: ${burnResult.signature}`);
                                        } else {
                                            console.error('❌ Burn operation failed:', burnResult.error);
                                        }
                                    } else {
                                        console.log('⚠️ Burning disabled - existing tokens remain in wallet');
                                    }
                                } else {
                                    console.log('⚠️ No existing tokens found in wallet and buying is disabled');
                                }
                            } catch (error) {
                                console.log(`⚠️ No tokens available for burning: ${error.message}`);
                            }
                        }
                    } catch (error) {
                        console.error('❌ Burn cycle failed:', error.message);
                        return { status: 'error', message: error.message };
                    }
                    
                    return { status: 'completed', message: 'Burn cycle completed' };
                }

                // New method to check if it's time to burn based on global timer
                async checkAndExecuteBurn() {
                    try {
                        // Fetch global timer state
                        const port = process.env.PORT || 3000;
                        const response = await fetch(`http://localhost:${port}/api/burn-status`);
                        const result = await response.json();
                        
                        if (result.success && result.data.timeRemaining === 0) {
                            console.log('🔥 Global timer reached zero - executing burn cycle...');
                            
                            // Clear any previous burn result
                            try {
                                await fetch(`http://localhost:${port}/api/burn-result`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        status: 'processing',
                                        message: 'Starting burn operation...'
                                    })
                                });
                            } catch (error) {
                                console.error('❌ Failed to clear burn result:', error.message);
                            }
                            
                            const burnResult = await this.executeBurnCycle();
                            
                            // If insufficient SOL, wait a few seconds before resetting timer
                            if (burnResult && burnResult.status === 'insufficient_sol') {
                                console.log('⏳ Waiting 5 seconds before restarting timer...');
                                await new Promise(resolve => setTimeout(resolve, 5000));
                            }
                            
                            // Store burn result only for insufficient SOL or completed operations
                            if (burnResult && (burnResult.status === 'insufficient_sol' || burnResult.status === 'success' || burnResult.status === 'completed')) {
                                try {
                                    await fetch(`http://localhost:${port}/api/burn-result`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            status: burnResult.status,
                                            message: burnResult.message
                                        })
                                    });
                                } catch (error) {
                                    console.error('❌ Failed to store burn result:', error.message);
                                }
                            }
                            
                            // Reset timer after burn execution
                            console.log('🔄 Resetting timer after burn execution...');
                            const resetResponse = await fetch(`http://localhost:${port}/api/burn-status`, {
                                method: 'POST'
                            });
                            const resetResult = await resetResponse.json();
                            
                            if (resetResult.success) {
                                console.log('✅ Timer reset successfully');
                            } else {
                                console.error('❌ Failed to reset timer:', resetResult.error);
                            }
                        } else {
                            console.log(`🕐 Timer check: ${result.data?.timeRemaining || 'unknown'} seconds remaining`);
                        }
                    } catch (error) {
                        console.error('❌ Error checking global timer:', error.message);
                    }
                }

    async getBurnWalletBalance() {
        try {
            const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
            
            const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
            const connection = new Connection(rpcUrl, 'confirmed');
            
            const burnWalletAddress = process.env.BURN_WALLET_ADDRESS;
            if (!burnWalletAddress) {
                throw new Error('BURN_WALLET_ADDRESS not set');
            }
            
            const publicKey = new PublicKey(burnWalletAddress);
            const balance = await connection.getBalance(publicKey);
            return balance / LAMPORTS_PER_SOL;
        } catch (error) {
            console.error('❌ Failed to get burn wallet balance:', error.message);
            return 0;
        }
    }

    async performRealBuyback(solAmount) {
        try {
            console.log(`🔄 Executing real buyback for ${solAmount.toFixed(4)} SOL...`);
            
            // Use DEX service for Pump.fun token buyback
            const DexService = require('./dex-service');
            const dexService = new DexService();
            await dexService.initialize();
            
            // Load burn wallet keypair
            const privateKey = process.env.BURN_WALLET_PRIVATE_KEY;
            if (!privateKey) {
                throw new Error('BURN_WALLET_PRIVATE_KEY not set');
            }
            
            const keypair = require('@solana/web3.js').Keypair.fromSecretKey(require('bs58').decode(privateKey));
            
            // Execute real token buyback via Jupiter API
            const buybackResult = await dexService.buyPumpFunTokens(keypair, solAmount);
            
            console.log(`✅ Real buyback completed: ${buybackResult.tokensReceived} tokens`);
            console.log(`📝 Buy transaction: ${buybackResult.signature}`);
            
            return buybackResult;
            
        } catch (error) {
            console.error('❌ Real buyback failed:', error.message);
            return {
                success: false,
                tokensReceived: 0,
                signature: null,
                error: error.message
            };
        }
    }

                async performRealBurn(expectedTokenAmount) {
                    try {
                        console.log(`🔥 Executing real burn for expected ${expectedTokenAmount} tokens...`);

                        const { Connection, PublicKey, Transaction } = require('@solana/web3.js');
                        const { getAssociatedTokenAddress, createBurnInstruction, getAccount } = require('@solana/spl-token');
                        const bs58 = require('bs58');

                        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
                        const connection = new Connection(rpcUrl, 'confirmed');

                        // Load burn wallet keypair
                        const privateKey = process.env.BURN_WALLET_PRIVATE_KEY;
                        if (!privateKey) {
                            throw new Error('BURN_WALLET_PRIVATE_KEY not set');
                        }

                        const keypair = require('@solana/web3.js').Keypair.fromSecretKey(bs58.decode(privateKey));

                        const tokenMint = new PublicKey(process.env.TOKEN_CONTRACT_ADDRESS);
                        
                        console.log(`   🔍 Token mint: ${tokenMint.toBase58()}`);
                        
                        // Get the token account for the burn wallet
                        const sourceTokenAccount = await getAssociatedTokenAddress(
                            tokenMint,
                            keypair.publicKey
                        );
                        
                        console.log(`   🔍 Source token account: ${sourceTokenAccount.toBase58()}`);
                        
                        // Get actual token balance from wallet
                        const tokenAccount = await getAccount(connection, sourceTokenAccount);
                        const actualTokenAmount = Number(tokenAccount.amount);
                        
                        console.log(`   🔍 Expected token amount: ${expectedTokenAmount}`);
                        console.log(`   🔍 Actual token balance: ${actualTokenAmount}`);
                        
                        if (actualTokenAmount === 0) {
                            throw new Error('No tokens found in wallet to burn');
                        }
                        
                        // Use actual token amount instead of expected amount
                        const tokensToBurn = actualTokenAmount;
                        console.log(`   🔍 Burning actual token amount: ${tokensToBurn}`);
                        
                        // Create burn instruction to permanently destroy tokens and reduce supply
                        const burnInstruction = createBurnInstruction(
                            sourceTokenAccount, // Token account to burn from
                            tokenMint,          // Token mint
                            keypair.publicKey,  // Owner of the token account
                            tokensToBurn        // Amount to burn in smallest units
                        );
                        
                        const transaction = new Transaction();
                        transaction.add(burnInstruction);
                        
                        const { blockhash } = await connection.getLatestBlockhash();
                        transaction.recentBlockhash = blockhash;
                        transaction.feePayer = keypair.publicKey;
                        
                        transaction.sign(keypair);
                        const signature = await connection.sendRawTransaction(transaction.serialize());
                        await connection.confirmTransaction(signature, 'confirmed');
                        
                        console.log(`✅ SPL Token burn completed: ${tokensToBurn} tokens (supply reduced)`);
                        console.log(`📝 Burn transaction: ${signature}`);

                        return {
                            success: true,
                            signature: signature,
                            tokensBurned: tokensToBurn
                        };

                    } catch (error) {
                        console.error('❌ Real token burn failed:', error.message);
                        return {
                            success: false,
                            signature: null,
                            error: error.message
                        };
                    }
                }

    async recordBurnInSupabase(burnData) {
        try {
            const { createClient } = require('@supabase/supabase-js');
            
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            
            if (!supabaseUrl || !supabaseKey) {
                console.warn('⚠️ Supabase credentials not found, skipping database record');
                return;
            }
            
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            const { data, error } = await supabase
                .from('burn_records')
                .insert({
                    timestamp: new Date().toISOString(),
                    sol_amount: burnData.solAmount,
                    tokens_burned: burnData.tokensBurned,
                    buy_signature: burnData.buySignature || null,
                    burn_signature: burnData.burnSignature || null,
                    status: burnData.status,
                    burn_wallet_address: process.env.BURN_WALLET_ADDRESS || 'BURN_WALLET_ADDRESS_NOT_SET',
                    token_contract_address: process.env.TOKEN_CONTRACT_ADDRESS || 'TOKEN_CONTRACT_ADDRESS_NOT_SET'
                });
            
            if (error) {
                console.error('❌ Failed to record burn in Supabase:', error);
            } else {
                console.log('✅ Burn recorded in Supabase:', data);
            }
        } catch (error) {
            console.error('❌ Error recording burn in Supabase:', error.message);
        }
    }
}

class BurnBackgroundService {
    constructor() {
        this.burnService = new BurnService(config);
        this.isRunning = false;
    }

    async start() {
        try {
            console.log('🔥 Starting RewardFlow Burn Background Service');
            console.log('==========================================\n');

            // Validate configuration
            validateConfig();

            // Start the burn service
            console.log('🚀 Starting burn service...');
            await this.burnService.start();
            this.isRunning = true;

            console.log('✅ Burn background service started successfully');
            console.log('🔄 Burn service is running in the background');
            
        } catch (error) {
            console.error('❌ Failed to start burn background service:', error.message);
            process.exit(1);
        }
    }

    stop() {
        if (this.isRunning) {
            console.log('🛑 Stopping burn background service...');
            this.burnService.stop();
            this.isRunning = false;
            console.log('✅ Burn background service stopped');
        }
    }
}

// Start the service if this file is run directly
if (require.main === module) {
    const service = new BurnBackgroundService();
    service.start();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        service.stop();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        service.stop();
        process.exit(0);
    });
}

module.exports = BurnBackgroundService;