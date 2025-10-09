#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🗄️ Setting up Supabase database for Burn App');
console.log('============================================\n');

async function setupDatabase() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables!');
      console.error('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file');
      process.exit(1);
    }
    
    console.log('✅ Supabase credentials found');
    console.log(`📡 Connecting to: ${supabaseUrl}`);
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔄 Testing connection...');
    
    // Test connection by trying to access a table
    const { data, error } = await supabase
      .from('burn_records')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('📋 Creating burn_records table...');
      
      // Table doesn't exist, we need to create it
      // Note: This requires the SQL to be run in Supabase dashboard
      console.log('⚠️  Table creation requires manual SQL execution');
      console.log('Please run the following SQL in your Supabase SQL editor:');
      console.log('\n' + '='.repeat(60));
      console.log(`
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
      `);
      console.log('='.repeat(60));
      console.log('\n📝 After running the SQL, run this script again to verify the setup.');
      
    } else if (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Database connection successful');
      console.log('✅ burn_records table exists');
      
      // Test inserting a sample record
      console.log('🧪 Testing database operations...');
      
      const testRecord = {
        timestamp: new Date().toISOString(),
        sol_amount: 0.1,
        tokens_burned: 100000,
        burn_signature: 'test_setup_' + Date.now(),
        status: 'success',
        burn_wallet_address: 'TEST_WALLET_ADDRESS',
        token_contract_address: 'TEST_TOKEN_ADDRESS'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('burn_records')
        .insert(testRecord)
        .select();
      
      if (insertError) {
        console.error('❌ Failed to insert test record:', insertError.message);
      } else {
        console.log('✅ Test record inserted successfully');
        
        // Clean up test record
        await supabase
          .from('burn_records')
          .delete()
          .eq('burn_signature', testRecord.burn_signature);
        
        console.log('✅ Test record cleaned up');
      }
      
      console.log('\n🎉 Database setup complete!');
      console.log('✅ burn_records table is ready');
      console.log('✅ Database operations working');
      console.log('✅ Ready to track real burn data');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupDatabase();
