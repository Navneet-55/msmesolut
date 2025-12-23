#!/usr/bin/env node

/**
 * Universal launcher script
 * Detects platform and launches appropriate setup
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const platform = process.platform;
const isWindows = platform === 'win32';

console.log(`🚀 Lumina AI Launcher (${platform})\n`);

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Running setup...\n');
  try {
    execSync('node scripts/setup.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Setup failed');
    process.exit(1);
  }
}

// Check if database is set up
console.log('\n📊 Checking database setup...');
try {
  execSync('pnpm db:generate', { stdio: 'ignore' });
} catch (error) {
  console.log('⚠️  Database not set up. Run: pnpm db:setup');
}

// Launch development servers
console.log('\n🚀 Starting development servers...\n');
try {
  execSync('pnpm dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start servers');
  process.exit(1);
}

