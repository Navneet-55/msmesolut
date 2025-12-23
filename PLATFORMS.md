# Multi-Platform Support Guide

Lumina AI is fully compatible with **Windows**, **macOS**, and **Linux**. This guide covers platform-specific setup and usage.

## 🌍 Supported Platforms

- ✅ **Windows** (10, 11) - PowerShell, CMD, Git Bash, WSL2
- ✅ **macOS** (10.15+) - Terminal, iTerm2
- ✅ **Linux** (Ubuntu, Debian, Fedora, etc.) - Bash, Zsh

## 🚀 Universal Setup (All Platforms)

### Option 1: Node.js Script (Recommended - Works Everywhere)

```bash
# Install dependencies and setup
node scripts/setup.js

# Setup database
node scripts/db-setup.js

# Start development
pnpm dev
```

### Option 2: Package Scripts (Cross-Platform)

```bash
# Setup
pnpm setup

# Database setup
pnpm db:setup

# Development
pnpm dev
```

### Option 3: Docker (All Platforms)

```bash
docker-compose up -d
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed
```

## 🪟 Windows

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- pnpm: `npm install -g pnpm`
- Git ([Download](https://git-scm.com/))
- Docker Desktop (Optional)

### Quick Start

**PowerShell (Recommended):**
```powershell
.\scripts\setup.ps1
.\scripts\db-setup.ps1
.\scripts\start-dev.ps1
```

**CMD:**
```cmd
node scripts\setup.js
node scripts\db-setup.js
pnpm dev
```

**Git Bash:**
```bash
node scripts/setup.js
node scripts/db-setup.js
pnpm dev
```

### Windows-Specific Notes

1. **Path Length**: Enable long paths in Windows:
   ```powershell
   # Run as Administrator
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```

2. **File Watching**: If hot reload doesn't work:
   ```powershell
   # Run as Administrator
   fsutil behavior set DisableDeleteNotify 0
   ```

3. **Execution Policy**: If PowerShell scripts are blocked:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## 🍎 macOS

### Prerequisites
- Node.js 18+ (via Homebrew: `brew install node`)
- pnpm: `npm install -g pnpm`
- PostgreSQL: `brew install postgresql@14`
- Redis: `brew install redis`

### Quick Start

**Terminal:**
```bash
# Using Node.js script
node scripts/setup.js
node scripts/db-setup.js
pnpm dev

# Or using Makefile
make setup
make db-setup
make dev

# Or using bash script
bash scripts/setup.sh
```

### macOS-Specific Notes

1. **Homebrew**: Recommended package manager
2. **PostgreSQL**: Start with `brew services start postgresql@14`
3. **Redis**: Start with `brew services start redis`

## 🐧 Linux

### Prerequisites
- Node.js 18+ (via nvm or package manager)
- pnpm: `npm install -g pnpm`
- PostgreSQL 14+
- Redis 6+

### Quick Start

**Ubuntu/Debian:**
```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y nodejs npm postgresql redis-server

# Setup project
node scripts/setup.js
node scripts/db-setup.js
pnpm dev
```

**Fedora/RHEL:**
```bash
# Install dependencies
sudo dnf install -y nodejs npm postgresql redis

# Setup project
node scripts/setup.js
node scripts/db-setup.js
pnpm dev
```

**Using Makefile:**
```bash
make setup
make db-setup
make dev
```

### Linux-Specific Notes

1. **PostgreSQL**: Start with `sudo systemctl start postgresql`
2. **Redis**: Start with `sudo systemctl start redis`
3. **Permissions**: May need `sudo` for system services

## 🐳 Docker (All Platforms)

Docker works identically on all platforms:

```bash
# Start services
docker-compose up -d

# Setup database
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Platform Detection

Check your platform:
```bash
pnpm check-platform
```

Or:
```bash
node scripts/check-platform.js
```

## 📝 Environment Variables

Environment variables work the same on all platforms. Create `.env` file:

```bash
# Cross-platform way
node scripts/copy-env.js

# Or manually copy
# Windows: copy .env.example .env
# Unix: cp .env.example .env
```

## 🛠️ Platform-Specific Scripts

### Windows
- `scripts/setup.ps1` - PowerShell setup
- `scripts/db-setup.ps1` - PowerShell database setup
- `scripts/start-dev.ps1` - Start development

### Unix (macOS/Linux)
- `scripts/setup.sh` - Bash setup
- `Makefile` - Make commands

### Universal (All Platforms)
- `scripts/setup.js` - Node.js setup
- `scripts/db-setup.js` - Node.js database setup
- `scripts/clean.js` - Cross-platform clean

## 🚨 Troubleshooting by Platform

### Windows

**Issue: Port already in use**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Issue: Permission denied**
- Run PowerShell as Administrator
- Or use Git Bash

### macOS

**Issue: Permission denied**
```bash
chmod +x scripts/*.sh
```

**Issue: PostgreSQL not found**
```bash
brew services start postgresql@14
```

### Linux

**Issue: Permission denied**
```bash
chmod +x scripts/*.sh
sudo chmod +x scripts/*.js
```

**Issue: PostgreSQL connection failed**
```bash
sudo systemctl status postgresql
sudo -u postgres psql
```

## 📦 Package Manager Compatibility

All package managers work on all platforms:
- ✅ **pnpm** (Recommended) - Fast, efficient
- ✅ **npm** - Built-in with Node.js
- ✅ **yarn** - Alternative package manager

## 🔄 CI/CD Multi-Platform Testing

The GitHub Actions workflow tests on:
- Ubuntu (Linux)
- Windows Server
- macOS

See `.github/workflows/ci.yml` for details.

## 📚 Additional Resources

- [Windows Guide](./WINDOWS.md) - Detailed Windows setup
- [Setup Guide](./SETUP.md) - General setup instructions
- [Application Guide](./APPLICATION.md) - Complete application docs

## ✅ Platform Compatibility Checklist

- [x] Windows 10/11 support
- [x] macOS 10.15+ support
- [x] Linux (Ubuntu, Debian, Fedora) support
- [x] Cross-platform scripts (Node.js)
- [x] Platform-specific scripts (PowerShell, Bash)
- [x] Docker support (all platforms)
- [x] Path handling (Windows/Unix)
- [x] Environment variables (all platforms)
- [x] File permissions (Unix)
- [x] Line endings (Git handles automatically)

---

**Lumina AI** - Truly multiplatform, works everywhere! 🚀

