-- Create distributions table
CREATE TABLE IF NOT EXISTS distributions (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  total_distributed DECIMAL(20, 8) NOT NULL DEFAULT 0,
  recipients_count INTEGER NOT NULL DEFAULT 0,
  transactions_count INTEGER NOT NULL DEFAULT 0,
  failed_transactions INTEGER NOT NULL DEFAULT 0,
  transactions JSONB NOT NULL DEFAULT '[]',
  treasury_balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial', 'threshold_not_met')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_distributions_timestamp ON distributions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_distributions_status ON distributions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on distributions" ON distributions
  FOR ALL USING (true) WITH CHECK (true);

-- Note: No sample record inserted to avoid sequence conflicts
