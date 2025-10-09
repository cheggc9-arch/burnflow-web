#!/usr/bin/env node

const { config, validateConfig } = require('./config');
const BurnService = require('./burn-service');

class BurnApp {
  constructor() {
    this.burnService = new BurnService(config);
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
      await this.burnService.start();

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
    console.log(`Status: ${status.isRunning ? '🟢 Running' : '🔴 Stopped'}`);
    console.log(`Interval: ${status.intervalMinutes} minutes`);
    console.log(`Token: ${status.config.token}`);
    console.log(`Burn Address: ${status.config.burnAddress}`);
    console.log(`Min Balance: ${status.config.minBalance} SOL`);
    
    console.log('\n💡 Tips:');
    console.log('- The application will run continuously');
    console.log('- Check logs for burn operations');
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
