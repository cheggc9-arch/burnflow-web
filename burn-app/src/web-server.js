const express = require('express');
const path = require('path');
const { config } = require('./config');
const BurnService = require('./burn-service');

class BurnWebServer {
    constructor() {
        this.app = express();
        this.burnService = new BurnService(config);
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        // Serve static files from public directory
        this.app.use(express.static(path.join(__dirname, '..', 'public')));
        
        // Parse JSON bodies
        this.app.use(express.json());
        
        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    setupRoutes() {
        // Serve the main dashboard
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
        });

        // API Routes
        this.app.get('/api/status', async (req, res) => {
            try {
                const status = this.burnService.getStatus();
                const walletInfo = await this.burnService.getBurnWalletInfo();
                
                res.json({
                    success: true,
                    data: {
                        service: status,
                        wallet: walletInfo,
                        burnWallet: {
                            address: config.burnWallet.address || 'Not configured',
                            burnAddress: config.token.burnAddress
                        },
                        timestamp: new Date().toISOString()
                    }
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        this.app.get('/api/burn-history', async (req, res) => {
            try {
                // In a real implementation, this would fetch from a database
                // For now, we'll return mock data
                const mockHistory = [
                    {
                        id: 1,
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        solUsed: '0.245',
                        tokensBurned: 1250000,
                        signature: 'abc123def456...',
                        status: 'completed'
                    },
                    {
                        id: 2,
                        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                        solUsed: '0.189',
                        tokensBurned: 890000,
                        signature: 'def456ghi789...',
                        status: 'completed'
                    },
                    {
                        id: 3,
                        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                        solUsed: '0.312',
                        tokensBurned: 1560000,
                        signature: 'ghi789jkl012...',
                        status: 'completed'
                    }
                ];

                res.json({
                    success: true,
                    data: mockHistory
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        this.app.post('/api/trigger-burn', async (req, res) => {
            try {
                console.log('🔥 Manual burn trigger received via web interface');
                await this.burnService.executeBurnCycle();
                
                res.json({
                    success: true,
                    message: 'Burn cycle triggered successfully',
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        this.app.get('/api/burn-stats', async (req, res) => {
            try {
                const stats = {
                    totalBurns: 15,
                    totalTokensBurned: 12500000,
                    averageBurnSize: 833333,
                    lastBurn: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    burnAddress: config.token.burnAddress,
                    intervalMinutes: config.burn.intervalMinutes
                };

                res.json({
                    success: true,
                    data: stats
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Burn wallet information endpoint
        this.app.get('/api/burn-wallet', (req, res) => {
            try {
                res.json({
                    success: true,
                    data: {
                        burnWallet: {
                            address: config.burnWallet.address || 'Not configured',
                            burnAddress: config.token.burnAddress,
                            description: 'This wallet will buy and burn tokens automatically'
                        },
                        timestamp: new Date().toISOString()
                    }
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Health check endpoint
        this.app.get('/api/health', (req, res) => {
            res.json({
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });
    }

    start(port = 3001) {
        this.server = this.app.listen(port, () => {
            console.log(`🔥 Burn Dashboard running at http://localhost:${port}`);
            console.log(`📊 Dashboard: http://localhost:${port}`);
            console.log(`🔧 API: http://localhost:${port}/api/status`);
        });
    }

    stop() {
        if (this.server) {
            this.server.close();
        }
    }
}

module.exports = BurnWebServer;
