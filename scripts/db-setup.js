#!/usr/bin/env node

/**
 * Cross-platform database setup script
 */

const { execSync } = require('child_process');

console.log('🗄️  Setting up database...\n');

const steps = [
  { name: 'Generating Prisma client', command: 'pnpm db:generate' },
  { name: 'Running migrations', command: 'pnpm db:migrate' },
  { name: 'Seeding database', command: 'pnpm db:seed' },
];

steps.forEach((step, index) => {
  console.log(`${index + 1}. ${step.name}...`);
  try {
    execSync(step.command, { stdio: 'inherit' });
    console.log(`✓ ${step.name} complete\n`);
  } catch (error) {
    console.error(`❌ Failed: ${step.name}`);
    process.exit(1);
  }
});

console.log('✅ Database setup complete!');

