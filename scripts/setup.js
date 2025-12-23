#!/usr/bin/env node

/**
 * Universal cross-platform setup script
 * Works on Windows, macOS, and Linux
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const platform = process.platform;
const isWindows = platform === 'win32';
const isMac = platform === 'darwin';
const isLinux = platform === 'linux';

console.log(`🚀 Setting up Lumina AI on ${platform}...\n`);

// Check prerequisites
function checkCommand(command, installCommand) {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch {
    console.error(`❌ ${command} is not installed.`);
    if (installCommand) {
      console.error(`   Please install it: ${installCommand}`);
    }
    return false;
  }
}

// Check Node.js
if (!checkCommand('node --version', 'Download from https://nodejs.org/')) {
  process.exit(1);
}
const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
console.log(`✓ Node.js found: ${nodeVersion}`);

// Check pnpm
if (!checkCommand('pnpm --version', 'npm install -g pnpm')) {
  process.exit(1);
}
const pnpmVersion = execSync('pnpm --version', { encoding: 'utf-8' }).trim();
console.log(`✓ pnpm found: ${pnpmVersion}\n`);

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('pnpm install', { stdio: 'inherit' });
  console.log('✓ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Generate Prisma client
console.log('🗄️  Generating Prisma client...');
try {
  execSync('pnpm db:generate', { stdio: 'inherit' });
  console.log('✓ Prisma client generated\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma client');
  process.exit(1);
}

// Check for .env file
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found.');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✓ Created .env file from .env.example');
    console.log('  Please update .env with your configuration.\n');
  } else {
    console.log('⚠️  .env.example not found. Please create .env manually.\n');
  }
} else {
  console.log('✓ .env file exists\n');
}

console.log('✅ Setup complete!\n');
console.log('Next steps:');
console.log('1. Update .env with your database and API keys');
console.log('2. Run: pnpm db:migrate');
console.log('3. Run: pnpm db:seed');
console.log('4. Run: pnpm dev\n');

