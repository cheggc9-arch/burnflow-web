#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Migrating distribution history to Supabase...\n');

// Check if distribution-history.json exists
const jsonFile = path.join(process.cwd(), 'distribution-history.json');

if (!fs.existsSync(jsonFile)) {
  console.log('❌ No distribution-history.json file found');
  console.log('   Nothing to migrate.');
  process.exit(0);
}

try {
  // Read existing JSON data
  const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  
  if (!jsonData.distributions || jsonData.distributions.length === 0) {
    console.log('✅ No distributions found in JSON file');
    console.log('   Nothing to migrate.');
    process.exit(0);
  }

  console.log(`📊 Found ${jsonData.distributions.length} distributions to migrate`);
  
  // Create SQL migration script
  const sqlScript = `
-- Migration script for existing distribution data
-- Run this in your Supabase SQL editor

${jsonData.distributions.map((dist, index) => {
  const transactionsJson = JSON.stringify(dist.transactions || []);
  return `INSERT INTO distributions (
  timestamp,
  total_distributed,
  recipients_count,
  transactions_count,
  failed_transactions,
  transactions,
  treasury_balance,
  status
) VALUES (
  '${dist.timestamp}',
  ${dist.totalDistributed},
  ${dist.recipientsCount},
  ${dist.transactionsCount},
  ${dist.failedTransactions},
  '${transactionsJson}',
  ${dist.treasuryBalance},
  '${dist.status}'
);`;
}).join('\n\n')}

-- Update sequence to continue from the last ID
SELECT setval('distributions_id_seq', ${jsonData.lastId || jsonData.distributions.length}, true);
`;

  // Write SQL script to file
  const sqlFile = path.join(process.cwd(), 'migration-to-supabase.sql');
  fs.writeFileSync(sqlFile, sqlScript);
  
  console.log('✅ Migration script created: migration-to-supabase.sql');
  console.log('\n📋 Next steps:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the contents of migration-to-supabase.sql');
  console.log('4. Run the SQL script');
  console.log('5. Verify the data in the distributions table');
  console.log('6. Delete migration-to-supabase.sql when done');
  
  console.log(`\n📊 Migration summary:`);
  console.log(`   - Distributions: ${jsonData.distributions.length}`);
  console.log(`   - Last ID: ${jsonData.lastId || jsonData.distributions.length}`);
  console.log(`   - SQL file: ${sqlFile}`);

} catch (error) {
  console.error('❌ Error during migration:', error.message);
  process.exit(1);
}
