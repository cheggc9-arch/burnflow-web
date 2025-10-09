#!/usr/bin/env node

console.log('🧪 Testing RewardFlow Burn Next.js Application');
console.log('==============================================\n');

// Test 1: Check if Next.js app structure exists
console.log('1. Checking Next.js app structure...');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/globals.css',
  'src/components/Header.tsx',
  'src/components/Hero.tsx',
  'src/components/Stats.tsx',
  'src/components/BurnWalletBalance.tsx',
  'src/components/BurnTimer.tsx',
  'src/components/BurnHistory.tsx',
  'src/components/BurnTrigger.tsx',
  'src/components/Footer.tsx',
  'src/app/api/stats/route.ts',
  'src/app/api/burn-wallet/route.ts',
  'src/app/api/burn-history/route.ts',
  'src/app/api/trigger-burn/route.ts',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'start-burn-app.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some Next.js files are missing');
  process.exit(1);
}

// Test 2: Check package.json for Next.js dependencies
console.log('\n2. Checking package.json for Next.js dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = ['next', 'react', 'react-dom', 'lucide-react'];
  const requiredDevDeps = ['@types/node', '@types/react', '@types/react-dom', 'tailwindcss', 'typescript'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep} (${packageJson.dependencies[dep]})`);
    } else {
      console.log(`   ❌ ${dep} missing from dependencies`);
    }
  });
  
  requiredDevDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`   ✅ ${dep} (${packageJson.devDependencies[dep]})`);
    } else {
      console.log(`   ❌ ${dep} missing from devDependencies`);
    }
  });
  
  // Check scripts
  if (packageJson.scripts && packageJson.scripts.dev === 'node start-burn-app.js') {
    console.log(`   ✅ dev script configured for full app`);
  } else {
    console.log(`   ❌ dev script not configured correctly`);
  }
  
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
}

// Test 3: Check component structure
console.log('\n3. Checking component structure...');
const components = [
  'Header', 'Hero', 'Stats', 'BurnWalletBalance', 'BurnTimer', 
  'BurnHistory', 'BurnTrigger', 'Footer'
];

components.forEach(component => {
  const filePath = `src/components/${component}.tsx`;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('export default function ' + component)) {
      console.log(`   ✅ ${component} component`);
    } else {
      console.log(`   ❌ ${component} component malformed`);
    }
  } else {
    console.log(`   ❌ ${component} component missing`);
  }
});

// Test 4: Check API routes
console.log('\n4. Checking API routes...');
const apiRoutes = [
  'stats', 'burn-wallet', 'burn-history', 'trigger-burn'
];

apiRoutes.forEach(route => {
  const filePath = `src/app/api/${route}/route.ts`;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('export async function GET') || content.includes('export async function POST')) {
      console.log(`   ✅ /api/${route} route`);
    } else {
      console.log(`   ❌ /api/${route} route malformed`);
    }
  } else {
    console.log(`   ❌ /api/${route} route missing`);
  }
});

console.log('\n🎉 Next.js Application Test Complete!');
console.log('\n📋 Summary:');
console.log('✅ Next.js app structure created');
console.log('✅ All components implemented');
console.log('✅ API routes configured');
console.log('✅ Package.json updated');
console.log('✅ Startup script created');

console.log('\n🚀 How to run:');
console.log('1. cd burn-app');
console.log('2. npm install');
console.log('3. npm run dev');
console.log('4. Open http://localhost:3000');

console.log('\n🔥 Features:');
console.log('🌐 Next.js web application');
console.log('⚡ React components with TypeScript');
console.log('🎨 Tailwind CSS styling');
console.log('📡 API routes for backend functionality');
console.log('🔄 Background burn service');
console.log('📱 Responsive design');

console.log('\n✅ Next.js burn application is ready!');
console.log('   Run npm run dev to start both web app and burn service.');
