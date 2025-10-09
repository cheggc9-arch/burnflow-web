-- Create burn_records table for tracking burn operations
CREATE TABLE IF NOT EXISTS burn_records (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  sol_amount DECIMAL(20, 9) NOT NULL,
  tokens_burned BIGINT NOT NULL,
  buy_signature TEXT,
  burn_signature TEXT,
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

-- Insert some sample data for testing (remove in production)
INSERT INTO burn_records (timestamp, sol_amount, tokens_burned, burn_signature, status, burn_wallet_address, token_contract_address)
VALUES 
  (NOW() - INTERVAL '2 hours', 0.5, 500000, 'sample_burn_1', 'success', 'BURN_WALLET_ADDRESS_NOT_SET', 'TOKEN_CONTRACT_ADDRESS_NOT_SET'),
  (NOW() - INTERVAL '4 hours', 0.3, 300000, 'sample_burn_2', 'success', 'BURN_WALLET_ADDRESS_NOT_SET', 'TOKEN_CONTRACT_ADDRESS_NOT_SET'),
  (NOW() - INTERVAL '6 hours', 0.8, 800000, 'sample_burn_3', 'success', 'BURN_WALLET_ADDRESS_NOT_SET', 'TOKEN_CONTRACT_ADDRESS_NOT_SET')
ON CONFLICT DO NOTHING;
