#!/usr/bin/env node

/**
 * Cross-platform environment variable checker
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NEXT_PUBLIC_API_URL',
];

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  console.log('   Run: node scripts/copy-env.js');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const missing = [];

requiredVars.forEach(varName => {
  const regex = new RegExp(`^${varName}=`, 'm');
  if (!regex.test(envContent)) {
    missing.push(varName);
  }
});

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(v => console.error(`   - ${v}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set');

