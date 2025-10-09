# Deployment Guide for RewardFlow Burn App

This is a **standalone application** that can be deployed independently from RewardFlow.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/rewardflow-burn-app.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

### Option 2: Netlify

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder
   - Configure environment variables
   - Deploy

### Option 3: Self-hosted

1. **Server Setup**:
   ```bash
   # Install dependencies
   npm install
   
   # Build the app
   npm run build
   
   # Start the app
   npm start
   ```

2. **Background Service**:
   ```bash
   # Run burn service in background
   nohup node src/burn-service.js > burn-service.log 2>&1 &
   ```

## 🔧 Environment Variables for Production

Set these in your deployment platform:

### Required Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BURN_WALLET_ADDRESS=your_burn_wallet_address
BURN_WALLET_PRIVATE_KEY=your_burn_wallet_private_key
TOKEN_CONTRACT_ADDRESS=your_token_contract_address
```

### Optional Variables:
```bash
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
BURN_INTERVAL_MINUTES=60
MIN_BALANCE_SOL=0.01
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 🗄️ Database Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get URL and anon key

2. **Run Database Schema**:
   - Go to SQL Editor in Supabase dashboard
   - Run the SQL from `supabase-burn-schema.sql`

3. **Test Database**:
   ```bash
   node setup-database.js
   ```

## 🔄 Background Service

The burn service needs to run continuously. Options:

### Option 1: PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start burn service
pm2 start src/burn-service.js --name "burn-service"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "src/burn-service.js"]
```

### Option 3: Systemd Service
```bash
# Create service file
sudo nano /etc/systemd/system/burn-service.service

# Add content:
[Unit]
Description=RewardFlow Burn Service
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/burn-app
ExecStart=/usr/bin/node src/burn-service.js
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable burn-service
sudo systemctl start burn-service
```

## 📊 Monitoring

### Logs
```bash
# View burn service logs
pm2 logs burn-service

# View application logs
tail -f burn-app.log
```

### Health Checks
- **Frontend**: Check if website loads
- **API**: Test `/api/stats` endpoint
- **Database**: Check Supabase dashboard
- **Burn Service**: Check PM2 status

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Private Keys**: Store securely, use environment variables
3. **Database**: Use Supabase RLS (Row Level Security)
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Consider adding rate limiting to APIs

## 🚀 Production Checklist

- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Environment variables set
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Background service running (PM2/Docker)
- [ ] Domain configured (if custom)
- [ ] SSL certificate installed
- [ ] Monitoring set up
- [ ] Logs configured
- [ ] Backup strategy in place

## 📝 Post-Deployment

1. **Test the application**:
   - Visit your deployed URL
   - Check burn wallet balance
   - Test manual burn trigger
   - Verify database records

2. **Monitor burn service**:
   - Check if service is running
   - Monitor logs for errors
   - Verify burn operations

3. **Set up alerts**:
   - Database errors
   - Service failures
   - Burn operation failures

## 🎉 Deployment Complete!

Your RewardFlow Burn App is now running independently and can be deployed anywhere!
