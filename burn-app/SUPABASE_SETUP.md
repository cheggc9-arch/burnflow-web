# Supabase Setup for Burn App

## 🗄️ **Database Setup Required**

The burn app now uses Supabase to track real burn data instead of fake data. You need to set up the database first.

### 1. **Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

### 2. **Run Database Schema**

Execute this SQL in your Supabase SQL editor:

```sql
-- Create burn_records table for tracking burn operations
CREATE TABLE IF NOT EXISTS burn_records (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  sol_amount DECIMAL(20, 9) NOT NULL,
  tokens_burned BIGINT NOT NULL,
  burn_signature TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  burn_wallet_address TEXT NOT NULL,
  token_contract_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_burn_records_timestamp ON burn_records(timestamp);
CREATE INDEX IF NOT EXISTS idx_burn_records_status ON burn_records(status);
CREATE INDEX IF NOT EXISTS idx_burn_records_burn_wallet ON burn_records(burn_wallet_address);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_burn_records_updated_at 
    BEFORE UPDATE ON burn_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. **Environment Variables**

Create a `.env` file in the `burn-app` directory:

```bash
# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Burn Wallet Configuration
BURN_WALLET_ADDRESS=your_burn_wallet_address_here
BURN_WALLET_PRIVATE_KEY=your_burn_wallet_private_key_here

# Token Configuration
TOKEN_CONTRACT_ADDRESS=your_token_contract_address_here

# Burn Configuration
BURN_INTERVAL_MINUTES=60
MIN_BALANCE_SOL=0.01
SLIPPAGE_BPS=100
PRICE_IMPACT_PERCENT=0.5

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
LOG_LEVEL=info
LOG_FILE=burn-app.log
```

### 4. **Install Dependencies**

```bash
cd burn-app
npm install
```

### 5. **Test the Setup**

```bash
npm run dev
```

## ✅ **What This Fixes**

- **Real Data**: Burn statistics now come from Supabase database
- **No Fake Data**: Shows 0 burns and 0 tokens burned until real burns happen
- **Burn Tracking**: Each successful burn is recorded in the database
- **Real-time Updates**: UI updates with real burn data from database

## 🔄 **Data Flow**

```
Burn Service → Records Burn → Supabase Database → API → UI
```

1. **Burn Service** executes burn cycle
2. **Records burn** in Supabase database
3. **API** fetches real data from Supabase
4. **UI** displays real burn statistics

## 🎯 **Expected Results**

- **Initial State**: 0 burns, 0 tokens burned (real data)
- **After Burns**: Real burn count and token amounts from database
- **Burn History**: Shows actual burn records with timestamps
- **Real-time**: Updates automatically as burns happen

The burn app now uses **real database data** instead of fake simulated data!
