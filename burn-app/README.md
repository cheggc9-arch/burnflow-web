# 🔥 RewardFlow Burn App

A standalone application that automatically buys back and burns RewardFlow tokens using creator fees from the burn wallet.

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- Supabase account
- Solana wallet with private key
- PumpPortal API key

### **Installation**
```bash
# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Fill in your environment variables
# See RAILWAY_DEPLOYMENT.md for complete list
```

### **Development**
```bash
# Start both web interface and burn service
npm run dev

# Or start web interface only
npm run web-only

# Or start burn service only
npm run burn-service
```

### **Production**
```bash
# Build the application
npm run build

# Start the application
npm start
```

## 🏗️ **Architecture**

### **Components:**
- **Next.js Frontend** - Web dashboard for monitoring
- **Node.js Burn Service** - Background automation
- **Supabase Database** - Burn history and statistics
- **Solana Integration** - Token buying and burning

### **Key Features:**
- ✅ **Automated token buying** via PumpPortal API
- ✅ **SPL Token burning** to reduce supply
- ✅ **Real-time dashboard** with burn history
- ✅ **Configurable intervals** and settings
- ✅ **Transparent transaction** tracking

## 📁 **Project Structure**

```
burn-app/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   ├── burn-service.js     # Core burn automation
│   ├── dex-service.js      # DEX integration
│   └── pumpportal-service.js # PumpPortal API
├── start-burn-app.js       # Application orchestrator
├── package.json           # Dependencies and scripts
├── railway.json           # Railway deployment config
└── README.md              # This file
```

## 🔧 **Configuration**

### **Environment Variables:**
See `env.example` for all required variables.

### **Key Settings:**
- `BURN_INTERVAL_MINUTES` - How often to check for burns
- `SOL_RESERVE_AMOUNT` - SOL to keep in wallet for fees
- `ENABLE_BUY_TOKENS` - Enable/disable token buying
- `ENABLE_BURN_AFTER_BUY` - Enable/disable token burning

## 🚀 **Deployment**

### **Railway Deployment:**
1. See `RAILWAY_DEPLOYMENT.md` for complete guide
2. Set all environment variables in Railway dashboard
3. Deploy from GitHub repository

### **Other Platforms:**
- **Vercel** - For frontend only (requires separate burn service)
- **DigitalOcean** - Full application deployment
- **AWS/GCP** - Enterprise deployment

## 📊 **Monitoring**

### **Dashboard Features:**
- **Burn wallet balance** - Current SOL amount
- **Burn timer** - Countdown to next burn
- **Burn history** - All completed burns with transaction links
- **Statistics** - Total tokens burned, total burns

### **Logs:**
- **Console logs** for debugging
- **Supabase records** for burn history
- **Transaction signatures** for verification

## 🔒 **Security**

### **Best Practices:**
- **Never commit** `.env` files
- **Use environment variables** for sensitive data
- **Secure private keys** in production
- **Monitor wallet balances** regularly

### **Access Control:**
- **Public dashboard** (read-only)
- **No admin interface** (configuration via env vars)
- **Burn service** runs automatically

## 🎯 **Usage**

### **Automatic Operation:**
1. **Timer counts down** from configured interval
2. **When timer reaches zero** - burn cycle starts
3. **Checks wallet balance** - must have > 0.13 SOL
4. **Buys tokens** using available SOL (minus reserve)
5. **Burns all bought tokens** using SPL burn instruction
6. **Records transaction** in database
7. **Resets timer** for next cycle

### **Manual Testing:**
- **Manual burn trigger** (if enabled in env)
- **Real-time monitoring** via dashboard
- **Transaction verification** via Solscan links

## 🆘 **Troubleshooting**

### **Common Issues:**
- **Insufficient SOL** - Add more SOL to burn wallet
- **API failures** - Check PumpPortal API key
- **Database errors** - Verify Supabase configuration
- **Timer not working** - Check burn service logs

### **Support:**
- **Check logs** in Railway dashboard
- **Verify environment variables**
- **Test API connections**
- **Monitor wallet balance**

## 📈 **Performance**

### **Optimizations:**
- **Efficient RPC calls** with connection pooling
- **Minimal database queries** with caching
- **Background processing** without blocking UI
- **Error handling** with automatic retries

### **Scaling:**
- **Single instance** recommended (timer conflicts)
- **Railway auto-scaling** for traffic spikes
- **Database optimization** for high burn frequency

---

**Built with ❤️ for the RewardFlow community**

*Automated token burning for sustainable tokenomics* 🔥