#!/usr/bin/env node

/**
 * Cross-platform .env file copier
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (fs.existsSync(envPath)) {
  console.log('✓ .env file already exists');
  process.exit(0);
}

if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example not found');
  process.exit(1);
}

try {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✓ Created .env file from .env.example');
  console.log('  Please update .env with your configuration.');
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  process.exit(1);
}

