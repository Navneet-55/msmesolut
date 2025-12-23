#!/usr/bin/env node

/**
 * Post-install script - runs after npm/pnpm install
 * Sets up platform-specific configurations
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const platform = process.platform;

// Make scripts executable on Unix-like systems
if (platform !== 'win32') {
  const scriptsDir = path.join(__dirname);
  const scripts = ['setup.sh', 'clean.js', 'setup.js', 'db-setup.js'];

  scripts.forEach(script => {
    const scriptPath = path.join(scriptsDir, script);
    if (fs.existsSync(scriptPath)) {
      try {
        fs.chmodSync(scriptPath, '755');
      } catch (error) {
        // Ignore errors on Windows or if chmod fails
      }
    }
  });
}

// Platform-specific setup
if (platform === 'win32') {
  console.log('ℹ️  Windows detected. Use PowerShell scripts for best experience.');
  console.log('   Run: .\\scripts\\setup.ps1');
} else {
  console.log('ℹ️  Unix-like system detected. You can use:');
  console.log('   - Node.js scripts: node scripts/setup.js');
  console.log('   - Bash scripts: bash scripts/setup.sh');
  console.log('   - Makefile: make setup');
}

