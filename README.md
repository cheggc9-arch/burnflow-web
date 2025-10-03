# RewardFlow - Solana Token Reward Distribution System

A Next.js application that automatically distributes creator fees from Pump.fun to token holders every 20 minutes using a sophisticated weighted algorithm.

## Features

- **Real-time Data**: Live treasury balance and holder statistics
- **Weighted Distribution**: Rewards early adopters and long-term holders
- **Transparent Formula**: Public reward calculation algorithm
- **Holders Leaderboard**: Track top holders and early adopters
- **Reward Calculator**: Estimate potential rewards

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with your Solana configuration:
   ```bash
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet
   CREATOR_WALLET_ADDRESS=your_creator_wallet_address
   TOKEN_CONTRACT_ADDRESS=your_token_contract_address
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## How It Works

1. **Hold Tokens**: Hold at least 20,000 tokens to be eligible
2. **Earn Weight**: Your reward weight increases based on balance and holding duration
3. **Receive Rewards**: Get your share of creator fees automatically distributed

## Reward Formula

The system uses a 4-phase weighted algorithm:
- **Early Adopter (0-24h)**: 3x-1.5x multiplier by hour
- **Growth Phase (1-7d)**: 12 points per day
- **Sustained Phase (7-30d)**: 6 points per day
- **Loyalty Phase (30d+)**: √(days) × 15 scaling

## API Endpoints

- `/api/stats` - Comprehensive statistics
- `/api/treasury-balance` - Creator wallet balance
- `/api/holders` - Token holder data
- `/api/test-connection` - Solana connection test

## Tech Stack

- **Next.js 15** with TypeScript
- **Solana Web3.js** for blockchain integration
- **Tailwind CSS** for styling
- **Real-time caching** with background jobs
