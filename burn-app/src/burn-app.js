#!/usr/bin/env node

const { config, validateConfig } = require('./config');
const BurnService = require('./burn-service');
const BurnWebServer = require('./web-server');

class BurnApp {
    constructor() {
        this.burnService = new BurnService(config);
        this.webServer = new BurnWebServer();
        this.isShuttingDown = false;
    }

    async start() {
        try {
            console.log('🔥 RewardFlow Burn Application');
            console.log('=====================================\n');

            // Validate configuration
            validateConfig();

            // Set up graceful shutdown
            this.setupGracefulShutdown();

            // Start the burn service
            console.log('🚀 Starting burn service...');
            await this.burnService.start();

            // Start the web server
            console.log('🌐 Starting web dashboard...');
            this.webServer.start(3001);

            // Keep the application running
            this.logStatus();
            
        } catch (error) {
            console.error('❌ Failed to start burn application:', error.message);
            process.exit(1);
        }
    }

    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            if (this.isShuttingDown) return;
            this.isShuttingDown = true;

            console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
            
            try {
                await this.burnService.stop();
                this.webServer.stop();
                console.log('✅ Burn application stopped successfully');
                process.exit(0);
            } catch (error) {
                console.error('❌ Error during shutdown:', error.message);
                process.exit(1);
            }
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGUSR2', () => shutdown('SIGUSR2')); // For nodemon
    }

    logStatus() {
        console.log('\n📊 Burn Application Status:');
        console.log('============================');
        
        const status = this.burnService.getStatus();
        console.log(`Burn Service: ${status.isRunning ? '🟢 Running' : '🔴 Stopped'}`);
        console.log(`Interval: ${status.intervalMinutes} minutes`);
        console.log(`Token: ${status.config.token}`);
        console.log(`Burn Address: ${status.config.burnAddress}`);
        console.log(`Min Balance: ${status.config.minBalance} SOL`);
        
        console.log('\n🌐 Web Dashboard:');
        console.log('============================');
        console.log(`Dashboard: http://localhost:3001`);
        console.log(`API Status: http://localhost:3001/api/status`);
        console.log(`Burn History: http://localhost:3001/api/burn-history`);
        
        console.log('\n💡 Tips:');
        console.log('- The application will run continuously');
        console.log('- Check the web dashboard for real-time status');
        console.log('- Use Ctrl+C to stop gracefully');
        console.log('- Monitor burn wallet balance for operations');
        
        console.log('\n🔄 Burn Application is running...\n');
    }
}

// Start the application
const app = new BurnApp();
app.start().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
});
