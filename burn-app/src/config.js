require('dotenv').config();

const config = {
  burn: {
    intervalMinutes: parseInt(process.env.BURN_INTERVAL_MINUTES) || 60,
    minBalance: parseFloat(process.env.MIN_BURN_AMOUNT_SOL) || 0.01
  },
  burnWallet: {
    address: process.env.BURN_WALLET_ADDRESS || 'BURN_WALLET_ADDRESS_NOT_SET',
    privateKey: process.env.BURN_WALLET_PRIVATE_KEY || 'BURN_WALLET_PRIVATE_KEY_NOT_SET'
  },
  token: {
    contractAddress: process.env.TOKEN_CONTRACT_ADDRESS || 'TOKEN_CONTRACT_ADDRESS_NOT_SET',
    burnAddress: '1nc1nerator11111111111111111111111111111111'
  },
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    network: process.env.SOLANA_NETWORK || 'mainnet-beta'
  }
};

function validateConfig() {
  const required = [
    'BURN_WALLET_ADDRESS',
    'BURN_WALLET_PRIVATE_KEY', 
    'TOKEN_CONTRACT_ADDRESS'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '));
    console.warn('Using default values for development');
  }
}

module.exports = { config, validateConfig };