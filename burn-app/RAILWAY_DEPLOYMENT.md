# 🚀 Railway Deployment Guide

## 📋 **Pre-Deployment Checklist**

### **1. Environment Variables Required**
Set these in Railway dashboard under "Variables":

```bash
# Solana Configuration
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY
SOLANA_NETWORK=mainnet

# Burn Wallet Configuration
BURN_WALLET_ADDRESS=YOUR_BURN_WALLET_ADDRESS
BURN_WALLET_PRIVATE_KEY=YOUR_BURN_WALLET_PRIVATE_KEY

# Token Configuration
TOKEN_CONTRACT_ADDRESS=YOUR_TOKEN_CONTRACT_ADDRESS
TOKEN_DECIMALS=6

# PumpPortal API Configuration
PUMP_PORTAL_API_KEY=YOUR_PUMPPORTAL_API_KEY
NEXT_PUBLIC_PUMP_PORTAL_API_KEY=YOUR_PUMPPORTAL_API_KEY

# Burn Configuration
ENABLE_BURN_AFTER_BUY=true
ENABLE_BUY_TOKENS=true
SOL_RESERVE_AMOUNT=0.06
MIN_BALANCE_SOL=0.001
SHOW_MANUAL_BURN_TRIGGER=false
NEXT_PUBLIC_SHOW_MANUAL_BURN_TRIGGER=false

# Burn Timer Configuration
BURN_INTERVAL_MINUTES=60

# DEX Configuration
DEX_SLIPPAGE_BPS=100
DEX_PRICE_IMPACT_LIMIT=2.0

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Logging Configuration
LOG_LEVEL=info
LOG_TO_FILE=false

# Port Configuration
PORT=3000
```

### **2. Build Configuration**
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+ (specified in package.json)

### **3. Database Setup**
1. **Create Supabase project**
2. **Run the SQL schema** from `supabase-burn-schema.sql`
3. **Add Supabase URL and key** to environment variables

## 🚀 **Deployment Steps**

### **1. Connect to Railway**
1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Choose the `burn-app` folder

### **2. Configure Environment Variables**
1. Go to your project dashboard
2. Click on "Variables" tab
3. Add all the environment variables listed above
4. **IMPORTANT**: Replace placeholder values with real values

### **3. Deploy**
1. Railway will automatically detect it's a Next.js app
2. It will run `npm run build` during build
3. It will run `npm start` to start the application
4. Both the web interface and burn service will start

## 🔧 **Application Structure**

### **Standalone Components:**
- ✅ **Next.js frontend** (web interface)
- ✅ **Node.js burn service** (background automation)
- ✅ **All dependencies** included in package.json
- ✅ **No external dependencies** on rewardflow-web

### **Key Files:**
- `start-burn-app.js` - Orchestrates both web and burn service
- `src/burn-service.js` - Core burn automation logic
- `src/app/` - Next.js web interface
- `railway.json` - Railway deployment configuration

## 🎯 **Post-Deployment Verification**

### **1. Check Application Status**
- Visit your Railway URL
- Verify the burn dashboard loads
- Check that timer is running

### **2. Verify Burn Service**
- Check Railway logs for burn service startup
- Look for "🔥 Starting burn service..." message
- Verify timer is checking every 10 seconds

### **3. Test Environment Variables**
- Check that all required variables are set
- Verify Supabase connection
- Test Solana RPC connection

## 🚨 **Important Notes**

### **Security:**
- **Never commit** `.env` files to git
- **Use Railway's environment variables** for sensitive data
- **Keep private keys secure**

### **Monitoring:**
- **Check Railway logs** regularly
- **Monitor burn operations** in Supabase
- **Verify timer is working** correctly

### **Scaling:**
- **Single instance** recommended (timer conflicts with multiple instances)
- **Railway will handle** automatic restarts
- **Health checks** configured in railway.json

## 🎉 **Deployment Complete!**

Your burn app is now:
- ✅ **Fully standalone** and deployed
- ✅ **Automatically buying and burning** tokens
- ✅ **Web interface** accessible to users
- ✅ **Production-ready** and monitored

Perfect for Railway deployment! 🔥
