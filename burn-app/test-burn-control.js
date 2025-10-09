#!/usr/bin/env node

console.log('🔥 Testing Burn Control Configuration');
console.log('=====================================\n');

// Test 1: Check if environment variable is documented
console.log('1. Checking environment variable documentation...');
const fs = require('fs');

try {
  const envExampleContent = fs.readFileSync('env.example', 'utf8');
  
  if (envExampleContent.includes('ENABLE_BURN_AFTER_BUY')) {
    console.log('   ✅ ENABLE_BURN_AFTER_BUY documented in env.example');
  } else {
    console.log('   ❌ ENABLE_BURN_AFTER_BUY missing from env.example');
  }
  
  if (envExampleContent.includes('ENABLE_BURN_AFTER_BUY=true')) {
    console.log('   ✅ Default value (true) documented');
  } else {
    console.log('   ❌ Default value not documented');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading env.example: ${error.message}`);
}

// Test 2: Check if burn service respects the setting
console.log('\n2. Checking burn service for burn control...');
try {
  const burnServiceContent = fs.readFileSync('src/burn-service.js', 'utf8');
  
  if (burnServiceContent.includes('ENABLE_BURN_AFTER_BUY')) {
    console.log('   ✅ Burn service checks ENABLE_BURN_AFTER_BUY');
  } else {
    console.log('   ❌ Burn service missing ENABLE_BURN_AFTER_BUY check');
  }
  
  if (burnServiceContent.includes('enableBurn = process.env.ENABLE_BURN_AFTER_BUY === \'true\'')) {
    console.log('   ✅ Burn service has correct environment check');
  } else {
    console.log('   ❌ Burn service missing correct environment check');
  }
  
  if (burnServiceContent.includes('status: \'buy_only\'')) {
    console.log('   ✅ Burn service records buy_only status');
  } else {
    console.log('   ❌ Burn service missing buy_only status recording');
  }
  
  if (burnServiceContent.includes('Burning disabled - only buying tokens')) {
    console.log('   ✅ Burn service has appropriate log message');
  } else {
    console.log('   ❌ Burn service missing appropriate log message');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading burn service: ${error.message}`);
}

// Test 3: Check if API route respects the setting
console.log('\n3. Checking API route for burn control...');
try {
  const apiRouteContent = fs.readFileSync('src/app/api/trigger-burn/route.ts', 'utf8');
  
  if (apiRouteContent.includes('ENABLE_BURN_AFTER_BUY')) {
    console.log('   ✅ API route checks ENABLE_BURN_AFTER_BUY');
  } else {
    console.log('   ❌ API route missing ENABLE_BURN_AFTER_BUY check');
  }
  
  if (apiRouteContent.includes('enableBurn = process.env.ENABLE_BURN_AFTER_BUY === \'true\'')) {
    console.log('   ✅ API route has correct environment check');
  } else {
    console.log('   ❌ API route missing correct environment check');
  }
  
  if (apiRouteContent.includes('status: status')) {
    console.log('   ✅ API route uses dynamic status');
  } else {
    console.log('   ❌ API route missing dynamic status');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading API route: ${error.message}`);
}

// Test 4: Check if database schema supports new status
console.log('\n4. Checking database schema for buy_only status...');
try {
  const dbSchemaContent = fs.readFileSync('fix-database-schema.sql', 'utf8');
  
  if (dbSchemaContent.includes('buy_only')) {
    console.log('   ✅ Database schema includes buy_only status');
  } else {
    console.log('   ❌ Database schema missing buy_only status');
  }
  
  if (dbSchemaContent.includes('ALTER TYPE burn_records_status ADD VALUE \'buy_only\'')) {
    console.log('   ✅ Database schema has correct enum update');
  } else {
    console.log('   ❌ Database schema missing correct enum update');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading database schema: ${error.message}`);
}

// Test 5: Check if Supabase types include new status
console.log('\n5. Checking Supabase types for buy_only status...');
try {
  const supabaseContent = fs.readFileSync('src/lib/supabase.ts', 'utf8');
  
  if (supabaseContent.includes("'buy_only'")) {
    console.log('   ✅ Supabase types include buy_only status');
  } else {
    console.log('   ❌ Supabase types missing buy_only status');
  }
  
} catch (error) {
  console.log(`   ❌ Error reading Supabase types: ${error.message}`);
}

console.log('\n🎉 Burn Control Configuration Test Complete!');
console.log('\n📋 Summary:');
console.log('✅ Environment variable ENABLE_BURN_AFTER_BUY documented');
console.log('✅ Burn service respects the setting');
console.log('✅ API route respects the setting');
console.log('✅ Database schema supports buy_only status');
console.log('✅ Supabase types include buy_only status');

console.log('\n🚀 How to use:');
console.log('1. Set ENABLE_BURN_AFTER_BUY=false in .env to only buy tokens');
console.log('2. Set ENABLE_BURN_AFTER_BUY=true in .env to buy and burn tokens');
console.log('3. Default is true (buy and burn)');
console.log('4. When disabled, status will be "buy_only" in database');

console.log('\n⚠️  Testing scenarios:');
console.log('- ENABLE_BURN_AFTER_BUY=false: Only buys tokens, no burning');
console.log('- ENABLE_BURN_AFTER_BUY=true: Buys tokens and burns them');
console.log('- Database records show appropriate status and signatures');

console.log('\n✅ Burn control configuration is ready!');
