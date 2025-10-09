#!/bin/bash

echo "🔥 RewardFlow Burn Application Installer"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your configuration:"
    echo "   - BURN_WALLET_ADDRESS"
    echo "   - BURN_WALLET_PRIVATE_KEY"
    echo "   - TOKEN_CONTRACT_ADDRESS"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Make scripts executable
chmod +x src/index.js
chmod +x src/test.js

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'npm test' to test the application"
echo "3. Run 'npm start' to start the burn service"
echo ""
echo "💡 For more information, see README.md"
