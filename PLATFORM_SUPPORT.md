# Complete Multi-Platform Support

Lumina AI is now **fully multiplatform** and works seamlessly on Windows, macOS, and Linux.

## ✅ Platform Support Matrix

| Component | Windows | macOS | Linux | Docker |
|-----------|---------|-------|-------|--------|
| **Setup Scripts** | ✅ | ✅ | ✅ | ✅ |
| **Database** | ✅ | ✅ | ✅ | ✅ |
| **Development** | ✅ | ✅ | ✅ | ✅ |
| **Production** | ✅ | ✅ | ✅ | ✅ |
| **CI/CD** | ✅ | ✅ | ✅ | ✅ |
| **Docker** | ✅ | ✅ | ✅ | ✅ |

## 🌍 Universal Commands (Work Everywhere)

These commands work **identically** on all platforms:

```bash
# One-command setup
pnpm setup && pnpm db:setup && pnpm dev

# Or use the launcher
pnpm launch

# Individual commands
pnpm setup          # Install + generate Prisma + create .env
pnpm db:setup       # Migrate + seed database
pnpm dev            # Start development servers
pnpm build          # Build for production
pnpm clean          # Clean build artifacts
pnpm check-platform # Check platform info
pnpm env:check      # Verify environment variables
pnpm env:copy       # Copy .env.example to .env
```

## 📦 Universal Scripts (Node.js)

All these scripts work on **Windows, macOS, and Linux**:

- `scripts/setup.js` - Complete setup
- `scripts/db-setup.js` - Database setup
- `scripts/clean.js` - Clean script
- `scripts/launch.js` - Universal launcher
- `scripts/check-platform.js` - Platform detection
- `scripts/copy-env.js` - Environment file copier
- `scripts/env-check.js` - Environment validator
- `scripts/postinstall.js` - Post-install setup

## 🪟 Windows-Specific Scripts

- `scripts/setup.ps1` - PowerShell setup
- `scripts/db-setup.ps1` - PowerShell database setup
- `scripts/start-dev.ps1` - Start development

## 🐧 Unix-Specific Scripts (macOS/Linux)

- `scripts/setup.sh` - Bash setup
- `Makefile` - Make commands

## 🐳 Docker (All Platforms)

Docker works identically everywhere:

```bash
docker-compose up -d
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed
```

## 🔧 Key Features

### 1. Cross-Platform Path Handling
- Uses Node.js `path.join()` for all file operations
- No hardcoded path separators
- Works with Windows (`\`) and Unix (`/`) paths

### 2. Platform Detection
- Automatic platform detection
- Platform-specific optimizations
- Clear platform information

### 3. Environment Variables
- Consistent across all platforms
- Cross-platform `.env` file handling
- Validation scripts

### 4. File Permissions
- Automatic permission setting on Unix
- Windows-compatible file operations
- Proper script execution permissions

### 5. CI/CD Multi-Platform Testing
- Tests on Ubuntu (Linux)
- Tests on Windows Server
- Tests on macOS

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - 3-command setup
- [MULTIPLATFORM.md](./MULTIPLATFORM.md) - Complete multiplatform guide
- [PLATFORMS.md](./PLATFORMS.md) - Detailed platform instructions
- [WINDOWS.md](./WINDOWS.md) - Windows-specific guide
- [SETUP.md](./SETUP.md) - General setup

## 🎯 Quick Start (Any Platform)

```bash
# 1. Install dependencies and setup
pnpm setup

# 2. Setup database
pnpm db:setup

# 3. Start development
pnpm dev
```

## ✨ What Makes It Multi-Platform

1. **Node.js Scripts** - All universal scripts use Node.js (works everywhere)
2. **Path Handling** - Uses `path.join()` for cross-platform paths
3. **File Operations** - Uses Node.js `fs` module (cross-platform)
4. **No Shell Dependencies** - Universal scripts don't require specific shells
5. **Platform Detection** - Automatic detection and adaptation
6. **Docker Support** - Works identically on all platforms
7. **CI/CD Testing** - Tests on all major platforms

## 🚀 Platform-Specific Quick Starts

### Windows
```powershell
.\scripts\setup.ps1
.\scripts\db-setup.ps1
.\scripts\start-dev.ps1
```

### macOS/Linux
```bash
bash scripts/setup.sh
make db-setup
make dev
```

### Universal (All Platforms)
```bash
node scripts/setup.js
node scripts/db-setup.js
pnpm dev
```

## ✅ Compatibility Checklist

- [x] Windows 10/11 support
- [x] macOS 10.15+ support
- [x] Linux (Ubuntu, Debian, Fedora) support
- [x] Cross-platform scripts (Node.js)
- [x] Platform-specific scripts (PowerShell, Bash)
- [x] Docker support (all platforms)
- [x] Path handling (Windows/Unix)
- [x] Environment variables (all platforms)
- [x] File permissions (Unix)
- [x] Line endings (Git handles)
- [x] CI/CD multi-platform testing
- [x] Documentation for all platforms

---

**Lumina AI** - Truly multiplatform, works everywhere! 🌍✨

