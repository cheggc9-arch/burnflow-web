const { Connection, PublicKey } = require('@solana/web3.js');
const { config } = require('./config');

class SolanaClient {
  constructor() {
    this.connection = new Connection(config.solana.rpcUrl, 'confirmed');
  }

  getConnection() {
    return this.connection;
  }

  getBurnWalletAddress() {
    return new PublicKey(config.burnWallet.address);
  }

  getTokenContractAddress() {
    return new PublicKey(config.token.contractAddress);
  }
}

module.exports = new SolanaClient();