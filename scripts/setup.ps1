# PowerShell setup script for Windows
# Run this script: .\scripts\setup.ps1

Write-Host "🚀 Setting up Lumina AI on Windows..." -ForegroundColor Cyan

# Check if pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ pnpm is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host "✓ pnpm found" -ForegroundColor Green
Write-Host "✓ Node.js found" -ForegroundColor Green

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate Prisma client
Write-Host "`n🗄️  Generating Prisma client..." -ForegroundColor Cyan
pnpm db:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "`n⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✓ Created .env file. Please update it with your configuration." -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env.example not found. Please create .env manually." -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update .env with your database and API keys" -ForegroundColor White
Write-Host "2. Run: pnpm db:migrate" -ForegroundColor White
Write-Host "3. Run: pnpm db:seed" -ForegroundColor White
Write-Host "4. Run: pnpm dev" -ForegroundColor White

