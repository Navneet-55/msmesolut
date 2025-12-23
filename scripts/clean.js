#!/usr/bin/env node

/**
 * Cross-platform clean script
 * Removes node_modules, build artifacts, and cache directories
 */

const fs = require('fs');
const path = require('path');

const directoriesToRemove = [
  'node_modules',
  'apps/web/node_modules',
  'apps/api/node_modules',
  'packages/prisma/node_modules',
  'apps/web/.next',
  'apps/api/dist',
  'apps/web/.next/cache',
  '.pnpm-store',
];

function removeDir(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✓ Removed: ${dirPath}`);
    } catch (error) {
      console.error(`✗ Failed to remove ${dirPath}:`, error.message);
    }
  }
}

console.log('🧹 Cleaning project...\n');

directoriesToRemove.forEach(removeDir);

console.log('\n✅ Clean complete!');

