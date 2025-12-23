# Windows Setup Guide

This guide will help you set up and run Lumina AI on Windows.

## Prerequisites

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **pnpm** - Install globally: `npm install -g pnpm`
3. **Git** - Download from [git-scm.com](https://git-scm.com/)
4. **Docker Desktop** (Optional) - For containerized deployment

## Quick Start (PowerShell)

### Option 1: Automated Setup Script

```powershell
# Run the setup script
.\scripts\setup.ps1

# Setup database
.\scripts\db-setup.ps1

# Start development
.\scripts\start-dev.ps1
```

### Option 2: Manual Setup

```powershell
# 1. Install dependencies
pnpm install

# 2. Generate Prisma client
pnpm db:generate

# 3. Create .env file (copy from .env.example)
Copy-Item .env.example .env

# 4. Update .env with your configuration
# Edit .env file with your database URL, API keys, etc.

# 5. Setup database
pnpm db:migrate
pnpm db:seed

# 6. Start development servers
pnpm dev
```

## Using Git Bash (Alternative)

If you prefer using Git Bash, you can use the Makefile:

```bash
# Install dependencies
make install

# Setup database
make db-setup

# Start development
make dev
```

## Common Commands

### Development
```powershell
pnpm dev              # Start all development servers
pnpm build            # Build for production
pnpm start            # Start production servers
```

### Database
```powershell
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with demo data
pnpm db:studio        # Open Prisma Studio (database GUI)
pnpm db:reset         # Reset and reseed database
```

### Utilities
```powershell
pnpm clean            # Clean build artifacts and node_modules
pnpm lint             # Run linters
pnpm type-check       # TypeScript type checking
```

## Docker on Windows

### Using Docker Desktop

```powershell
# Start all services
docker-compose up -d

# Setup database (run inside API container)
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Troubleshooting

### Issue: "pnpm: command not found"

**Solution:**
```powershell
npm install -g pnpm
```

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```powershell
pnpm db:generate
```

### Issue: "Database connection failed"

**Solutions:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env file
3. Verify database exists
4. Check Windows Firewall settings

### Issue: "Port already in use"

**Solutions:**
1. Check if ports 3000 or 4000 are in use:
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :4000
   ```
2. Kill the process or change ports in .env

### Issue: PowerShell script execution policy

If you get an execution policy error:

```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user (temporary)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run script with bypass
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

### Issue: Path too long on Windows

If you encounter "Path too long" errors:

1. Enable long paths in Windows:
   - Run PowerShell as Administrator
   - Execute: `New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`
   - Restart your computer

2. Or use a shorter path for the project

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lumina_ai?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
REFRESH_TOKEN_EXPIRES_IN="30d"
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-pro"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000"
API_URL="http://localhost:4000"
NODE_ENV="development"
```

## Windows-Specific Notes

1. **Line Endings**: Git should handle this automatically, but if you see issues, ensure `core.autocrlf=true` in Git config

2. **File Watching**: If you experience issues with file watching (hot reload), you may need to increase the file watcher limit:
   ```powershell
   # Run as Administrator
   fsutil behavior set DisableDeleteNotify 0
   ```

3. **Performance**: For better performance on Windows:
   - Use WSL2 (Windows Subsystem for Linux) for development
   - Or use Docker Desktop with WSL2 backend

## Using WSL2 (Recommended for Better Performance)

If you have WSL2 installed:

```bash
# In WSL2 terminal
cd /mnt/c/path/to/lumina-ai
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Getting Help

- Check the main [README.md](./README.md)
- Review [SETUP.md](./SETUP.md) for detailed setup
- Check [APPLICATION.md](./APPLICATION.md) for complete application guide

## Default Credentials

After seeding the database:
- **Email**: `demo@lumina.ai`
- **Password**: `demo123`

---

**Note**: All scripts are cross-platform compatible. Use PowerShell scripts on Windows, or Git Bash/Makefile if preferred.

