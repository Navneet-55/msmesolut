#!/bin/bash

# Bash setup script for Linux/macOS
# Run this script: bash scripts/setup.sh
# Or use the universal Node.js script: node scripts/setup.js

set -e

echo "🚀 Setting up Lumina AI on $(uname -s)..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version)
PNPM_VERSION=$(pnpm --version)

echo "✓ Node.js found: $NODE_VERSION"
echo "✓ pnpm found: $PNPM_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo ""
echo "🗄️  Generating Prisma client..."
pnpm db:generate

# Check for .env file
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✓ Created .env file. Please update it with your configuration."
    else
        echo "⚠️  .env.example not found. Please create .env manually."
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your database and API keys"
echo "2. Run: pnpm db:setup (or: node scripts/db-setup.js)"
echo "3. Run: pnpm dev"
echo ""
echo "💡 Tip: You can also use the universal Node.js script:"
echo "   node scripts/setup.js"

