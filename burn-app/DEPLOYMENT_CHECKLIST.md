# ✅ Railway Deployment Checklist

## 🎯 **Pre-Deployment Verification**

### **1. Standalone Verification**
- ✅ **No dependencies** on parent rewardflow-web folder
- ✅ **All imports** use relative paths within burn-app
- ✅ **Package.json** has all required dependencies
- ✅ **No external file references**

### **2. Build Configuration**
- ✅ **Build command**: `npm run build` (Next.js build)
- ✅ **Start command**: `npm start` (runs start-burn-app.js)
- ✅ **Node version**: 18+ specified in package.json
- ✅ **Railway.json** configured for deployment

### **3. Environment Variables**
- ✅ **All required variables** documented in RAILWAY_DEPLOYMENT.md
- ✅ **Production values** ready to be set in Railway
- ✅ **No hardcoded values** in code
- ✅ **Environment-specific** configurations

### **4. Database Setup**
- ✅ **Supabase schema** ready (supabase-burn-schema.sql)
- ✅ **Database connection** configured
- ✅ **Burn records table** structure defined
- ✅ **API endpoints** for database operations

## 🚀 **Deployment Steps**

### **1. Railway Setup**
1. **Create Railway account** and connect GitHub
2. **Create new project** from GitHub repository
3. **Select burn-app folder** as root directory
4. **Configure build settings** (auto-detected)

### **2. Environment Configuration**
1. **Go to Variables tab** in Railway dashboard
2. **Add all environment variables** from checklist
3. **Set production values** (replace placeholders)
4. **Verify all variables** are correctly set

### **3. Database Preparation**
1. **Create Supabase project**
2. **Run SQL schema** from supabase-burn-schema.sql
3. **Get Supabase URL and key**
4. **Add to Railway environment variables**

### **4. Deploy and Verify**
1. **Trigger deployment** in Railway
2. **Monitor build logs** for any errors
3. **Check application logs** for startup
4. **Verify web interface** loads correctly
5. **Test burn service** is running

## 🔧 **Required Environment Variables**

### **Solana Configuration**
```bash
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
SOLANA_NETWORK=mainnet
```

### **Burn Wallet**
```bash
BURN_WALLET_ADDRESS=YOUR_BURN_WALLET_ADDRESS
BURN_WALLET_PRIVATE_KEY=YOUR_BURN_WALLET_PRIVATE_KEY
```

### **Token Configuration**
```bash
TOKEN_CONTRACT_ADDRESS=YOUR_TOKEN_CONTRACT_ADDRESS
TOKEN_DECIMALS=6
```

### **PumpPortal API**
```bash
PUMP_PORTAL_API_KEY=YOUR_PUMPPORTAL_API_KEY
NEXT_PUBLIC_PUMP_PORTAL_API_KEY=YOUR_PUMPPORTAL_API_KEY
```

### **Burn Settings**
```bash
ENABLE_BURN_AFTER_BUY=true
ENABLE_BUY_TOKENS=true
SOL_RESERVE_AMOUNT=0.06
MIN_BALANCE_SOL=0.001
BURN_INTERVAL_MINUTES=60
```

### **UI Settings**
```bash
SHOW_MANUAL_BURN_TRIGGER=false
NEXT_PUBLIC_SHOW_MANUAL_BURN_TRIGGER=false
```

### **Supabase**
```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### **System**
```bash
PORT=3000
LOG_LEVEL=info
```

## 🎯 **Post-Deployment Verification**

### **1. Application Status**
- ✅ **Web interface** loads at Railway URL
- ✅ **Burn dashboard** displays correctly
- ✅ **Timer is running** and counting down
- ✅ **No console errors** in browser

### **2. Burn Service**
- ✅ **Burn service started** (check Railway logs)
- ✅ **Timer checking** every 10 seconds
- ✅ **No errors** in service logs
- ✅ **Environment variables** loaded correctly

### **3. Database Connection**
- ✅ **Supabase connection** working
- ✅ **Burn records table** accessible
- ✅ **API endpoints** responding
- ✅ **No database errors**

### **4. External APIs**
- ✅ **Solana RPC** connection working
- ✅ **PumpPortal API** accessible
- ✅ **Wallet balance** retrievable
- ✅ **No API errors**

## 🚨 **Common Issues & Solutions**

### **Build Failures**
- **Check Node version** (18+ required)
- **Verify all dependencies** in package.json
- **Check for TypeScript errors**
- **Ensure all imports** are correct

### **Runtime Errors**
- **Verify environment variables** are set
- **Check API keys** are valid
- **Test database connection**
- **Monitor Railway logs**

### **Service Not Starting**
- **Check start command** in package.json
- **Verify start-burn-app.js** exists
- **Check for port conflicts**
- **Review Railway logs**

## 🎉 **Deployment Complete!**

### **Success Indicators:**
- ✅ **Application deployed** successfully
- ✅ **Web interface** accessible
- ✅ **Burn service** running in background
- ✅ **Timer counting down** to next burn
- ✅ **All systems** operational

### **Next Steps:**
- **Monitor application** for first few hours
- **Check burn operations** when timer reaches zero
- **Verify database records** are being created
- **Test with small amounts** before full deployment

**Your burn app is now live and ready to automatically burn tokens!** 🔥
