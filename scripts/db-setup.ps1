# PowerShell script for database setup on Windows
# Run this script: .\scripts\db-setup.ps1

Write-Host "🗄️  Setting up database..." -ForegroundColor Cyan

# Generate Prisma client
Write-Host "`n1. Generating Prisma client..." -ForegroundColor Yellow
pnpm db:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "`n2. Running database migrations..." -ForegroundColor Yellow
pnpm db:migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to run migrations" -ForegroundColor Red
    exit 1
}

# Seed database
Write-Host "`n3. Seeding database..." -ForegroundColor Yellow
pnpm db:seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Database setup complete!" -ForegroundColor Green

