@echo off
echo 🔥 RewardFlow Burn Application Installer
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

echo.
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file with your configuration:
    echo    - BURN_WALLET_ADDRESS
    echo    - BURN_WALLET_PRIVATE_KEY
    echo    - TOKEN_CONTRACT_ADDRESS
    echo.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your configuration
echo 2. Run 'npm test' to test the application
echo 3. Run 'npm start' to start the burn service
echo.
echo 💡 For more information, see README.md
pause
