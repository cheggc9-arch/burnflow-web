# Burn Wallet Setup for RewardFlow - Pump.fun Token Support

This document explains the new burn wallet functionality that has been added to RewardFlow, specifically optimized for Pump.fun tokens.

## Overview

The burn wallet system implements a 80/20 distribution split:
- **80%** of creator fees go to token holders (existing functionality)
- **20%** of creator fees go to a dedicated burn wallet
- The burn wallet automatically buys back tokens and burns them

## New Environment Variables

Add these variables to your `.env` file:

```bash
# Burn Wallet Configuration
BURN_WALLET_ADDRESS=your_burn_wallet_address_here
BURN_WALLET_PRIVATE_KEY=your_burn_wallet_private_key_here

# Burn Script Configuration
BURN_SCRIPT_INTERVAL_MINUTES=60
```

## How It Works

### 1. Distribution Changes
- The distribution service now splits creator fees 80/20
- 80% goes to holders based on their weightage
- 20% goes to the burn wallet

### 2. Pump.fun Token Burn Process
- The burn wallet receives SOL from distributions
- An automated script runs at configurable intervals
- The script uses DEX integration optimized for Pump.fun tokens
- Multi-hop routing: SOL -> USDC -> Pump.fun tokens
- Higher slippage tolerance (1%) for Pump.fun token liquidity
- All purchased tokens are transferred to the burn address: `1nc1nerator11111111111111111111111111111111`
- Pump.fun tokens are permanently burned (removed from circulation)

## New API Endpoints

### `/api/trigger-burn`
Manually trigger a burn operation.

**Method:** POST

**Response:**
```json
{
  "success": true,
  "message": "Burn completed successfully",
  "data": {
    "solUsed": 0.5,
    "tokensBurned": 1000000,
    "signature": "transaction_signature_here"
  }
}
```

### `/api/burn-status`
Check the status of the burn wallet and background job.

**Method:** GET

**Response:**
```json
{
  "success": true,
  "data": {
    "burnWalletBalance": 1.5,
    "shouldRunBurn": true,
    "backgroundJob": {
      "isRunning": true,
      "intervalMinutes": 60
    },
    "burnAddress": "1nc1nerator11111111111111111111111111111111"
  }
}
```

## Testing

### Test the Burn Service
```bash
node scripts/test-burn.js
```

### Test the Complete BurnFlow
```bash
node scripts/test-burnflow.js
```

### Test Token Buyback and Burn
```bash
node scripts/test-token-burn.js
```

### Test Pump.fun Token Burn
```bash
node scripts/test-pumpfun-burn.js
```

## Background Job

The burn background job runs automatically at the configured interval. To start/stop it:

```javascript
import { startBurnBackgroundJob, stopBurnBackgroundJob } from '@/utils/burn-background-job';

// Start the background job
startBurnBackgroundJob();

// Stop the background job
stopBurnBackgroundJob();
```

## Configuration

### Burn Script Interval
Set `BURN_SCRIPT_INTERVAL_MINUTES` in your `.env` file to control how often the burn script runs.

### Minimum Balance
The burn script only runs when the burn wallet has sufficient balance (default: 0.001 SOL).

## Security Notes

1. **Private Key Security**: Store the burn wallet private key securely
2. **Burn Address**: The burn address `1nc1nerator11111111111111111111111111111111` is a well-known Solana burn address
3. **Transaction Fees**: The system reserves SOL for transaction fees

## Implementation Details

### Files Added/Modified

**New Files:**
- `src/utils/burn-service.ts` - Core burn functionality optimized for Pump.fun tokens
- `src/utils/dex-service.ts` - DEX integration for Pump.fun token buyback
- `src/utils/burn-background-job.ts` - Automated burn scheduling
- `src/app/api/trigger-burn/route.ts` - Manual burn trigger
- `src/app/api/burn-status/route.ts` - Burn status endpoint
- `scripts/test-burn.js` - Burn service testing
- `scripts/test-burnflow.js` - Complete system testing
- `scripts/test-token-burn.js` - Token buyback and burn testing
- `scripts/test-pumpfun-burn.js` - Pump.fun token specific testing

**Modified Files:**
- `src/utils/distribution-service.ts` - Added 80/20 split logic
- `src/utils/solana.ts` - Added burn wallet address function

### Distribution Logic Changes

The distribution service now:
1. Calculates 80% for holders and 20% for burn wallet
2. Distributes to holders using existing weightage system
3. Sends 20% to burn wallet
4. Records all transactions in the distribution history

### Pump.fun Token Burn Logic

The burn service optimized for Pump.fun tokens:
1. Checks burn wallet balance
2. Reserves SOL for transaction fees
3. Uses DEX integration with Pump.fun optimized routing (SOL -> USDC -> Token)
4. Applies higher slippage tolerance (1%) for Pump.fun token liquidity
5. Transfers purchased Pump.fun tokens to burn address
6. Pump.fun tokens are permanently burned (removed from circulation)
7. Logs all burn operations with Pump.fun specific metrics

## Next Steps

1. Set up your `.env` file with the required variables
2. Test the system using the provided test scripts
3. Deploy and monitor the burn operations
4. Consider implementing actual token buyback logic (currently simulated)

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Ensure all required variables are set
2. **Insufficient Balance**: The burn wallet needs SOL to execute burns
3. **Transaction Failures**: Check Solana network status and RPC endpoint

### Monitoring

Use the `/api/burn-status` endpoint to monitor:
- Burn wallet balance
- Background job status
- Burn execution history
