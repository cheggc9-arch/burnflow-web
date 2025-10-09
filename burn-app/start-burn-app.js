#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if already running
const pidFile = path.join(__dirname, '.burn-app.pid');
if (fs.existsSync(pidFile)) {
    console.log('⚠️ Application may already be running');
    console.log('If not, delete .burn-app.pid file and try again');
    process.exit(1);
}

// Write PID file
fs.writeFileSync(pidFile, process.pid.toString());

console.log('🔥 Starting RewardFlow Burn Application');
console.log('=====================================\n');

// Start Next.js development server
console.log('🌐 Starting Next.js development server...');
const nextProcess = spawn('npm', ['run', 'next-dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

// Start burn service in the background
console.log('🔥 Starting burn background service...');
const burnProcess = spawn('node', ['src/burn-service.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

// Handle process cleanup
const cleanup = () => {
    console.log('\n🛑 Shutting down RewardFlow Burn Application...');
    
    if (nextProcess) {
        nextProcess.kill('SIGTERM');
    }
    
    if (burnProcess) {
        burnProcess.kill('SIGTERM');
    }
    
    // Remove PID file
    if (fs.existsSync(pidFile)) {
        fs.unlinkSync(pidFile);
    }
    
    console.log('✅ Application stopped');
    process.exit(0);
};

// Handle graceful shutdown
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGUSR2', cleanup); // For nodemon

// Handle process errors
nextProcess.on('error', (error) => {
    console.error('❌ Next.js process error:', error);
    cleanup();
});

burnProcess.on('error', (error) => {
    console.error('❌ Burn service process error:', error);
    cleanup();
});

console.log('\n✅ RewardFlow Burn Application is running!');
console.log('🌐 Web Dashboard: http://localhost:3000');
console.log('🔥 Burn Service: Running in background');
console.log('💡 Press Ctrl+C to stop\n');
