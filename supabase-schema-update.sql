-- Add token_metadata table to store token launch time and other metadata
CREATE TABLE IF NOT EXISTS token_metadata (
  id SERIAL PRIMARY KEY,
  token_address VARCHAR(44) NOT NULL UNIQUE,
  launch_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_token_metadata_address ON token_metadata(token_address);

-- Enable Row Level Security (RLS)
ALTER TABLE token_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on token_metadata" ON token_metadata
  FOR ALL USING (true) WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_token_metadata_updated_at 
    BEFORE UPDATE ON token_metadata 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
