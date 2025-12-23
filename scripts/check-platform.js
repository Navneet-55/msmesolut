#!/usr/bin/env node

/**
 * Platform detection utility
 */

const os = require('os');
const platform = process.platform;

const platformInfo = {
  platform,
  isWindows: platform === 'win32',
  isMac: platform === 'darwin',
  isLinux: platform === 'linux',
  arch: os.arch(),
  nodeVersion: process.version,
  pnpmVersion: null,
};

try {
  const { execSync } = require('child_process');
  platformInfo.pnpmVersion = execSync('pnpm --version', { encoding: 'utf-8' }).trim();
} catch {
  platformInfo.pnpmVersion = 'not installed';
}

console.log(JSON.stringify(platformInfo, null, 2));

module.exports = platformInfo;

