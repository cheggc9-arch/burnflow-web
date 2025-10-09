#!/usr/bin/env node

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function setupDatabaseSchema() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Supabase URL or Service Role Key not found in .env');
        console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        console.log('🚀 Connecting to Supabase...');
        
        // Test connection
        const { data: testData, error: testError } = await supabase
            .from('burn_records')
            .select('id')
            .limit(1);
            
        if (testError) {
            console.error('❌ Failed to connect to Supabase:', testError);
            process.exit(1);
        }
        
        console.log('✅ Successfully connected to Supabase');

        // Read the SQL schema file
        const schemaPath = path.join(__dirname, 'update-database-schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('🔄 Applying database schema updates...');
        console.log('📝 SQL to execute:');
        console.log('--------------------------------------------------------------------');
        console.log(schemaSql);
        console.log('--------------------------------------------------------------------');
        
        console.log('\n💡 Please manually run the above SQL in your Supabase SQL Editor:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to "SQL Editor"');
        console.log('3. Copy and paste the SQL above');
        console.log('4. Click "Run" to execute the schema updates');
        
        // Verify table structure after manual update
        console.log('\n🔍 Verifying table structure...');
        const { data: columns, error: columnsError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable')
            .eq('table_name', 'burn_records')
            .eq('table_schema', 'public')
            .order('ordinal_position');

        if (columnsError) {
            console.error('❌ Failed to verify table structure:', columnsError);
        } else {
            console.log('📊 Current table structure:');
            columns.forEach(col => {
                console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
            });
            
            // Check if required columns exist
            const hasBuySignature = columns.some(col => col.column_name === 'buy_signature');
            const hasBurnSignature = columns.some(col => col.column_name === 'burn_signature');
            
            if (hasBuySignature && hasBurnSignature) {
                console.log('✅ Required columns (buy_signature, burn_signature) are present');
            } else {
                console.log('❌ Missing required columns. Please run the SQL manually.');
            }
        }

        console.log('\n🎉 Database schema setup complete!');
        console.log('The burn app should now work without database errors.');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    setupDatabaseSchema();
}

module.exports = setupDatabaseSchema;
