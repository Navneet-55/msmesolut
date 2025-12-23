# PowerShell script to start development servers on Windows
# Run this script: .\scripts\start-dev.ps1

Write-Host "🚀 Starting Lumina AI development servers..." -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Please create it first." -ForegroundColor Yellow
    exit 1
}

# Start development servers
Write-Host "`nStarting frontend and backend..." -ForegroundColor Cyan
pnpm dev

