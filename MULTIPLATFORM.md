# Multi-Platform Support

Lumina AI is **fully multiplatform** and works seamlessly on Windows, macOS, and Linux.

## ✅ Platform Support Matrix

| Feature | Windows | macOS | Linux | Docker |
|---------|---------|-------|-------|--------|
| Development | ✅ | ✅ | ✅ | ✅ |
| Production | ✅ | ✅ | ✅ | ✅ |
| Docker | ✅ | ✅ | ✅ | ✅ |
| Scripts | ✅ | ✅ | ✅ | ✅ |
| Database | ✅ | ✅ | ✅ | ✅ |
| CI/CD | ✅ | ✅ | ✅ | ✅ |

## 🎯 Universal Commands

These commands work **identically** on all platforms:

```bash
# Setup
pnpm setup

# Database
pnpm db:setup
pnpm db:migrate
pnpm db:seed

# Development
pnpm dev
pnpm build
pnpm start

# Utilities
pnpm clean
pnpm check-platform
pnpm env:check
```

## 🔧 Platform Detection

The application automatically detects your platform:

```bash
pnpm check-platform
```

Output example:
```json
{
  "platform": "win32",
  "isWindows": true,
  "isMac": false,
  "isLinux": false,
  "arch": "x64",
  "nodeVersion": "v20.10.0",
  "pnpmVersion": "8.15.0"
}
```

## 📝 Scripts by Platform

### Universal (Node.js - All Platforms)
- `scripts/setup.js` - Setup script
- `scripts/db-setup.js` - Database setup
- `scripts/clean.js` - Clean script
- `scripts/launch.js` - Universal launcher
- `scripts/env-check.js` - Environment checker
- `scripts/copy-env.js` - Environment copier

### Windows
- `scripts/setup.ps1` - PowerShell setup
- `scripts/db-setup.ps1` - PowerShell DB setup
- `scripts/start-dev.ps1` - Start development

### Unix (macOS/Linux)
- `scripts/setup.sh` - Bash setup
- `Makefile` - Make commands

## 🐳 Docker (Universal)

Docker works identically on all platforms:

```bash
# Start
docker-compose up -d

# Database
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🔄 CI/CD Multi-Platform Testing

GitHub Actions tests on:
- ✅ Ubuntu (Linux)
- ✅ Windows Server
- ✅ macOS

See `.github/workflows/ci.yml`

## 📚 Documentation

- [PLATFORMS.md](./PLATFORMS.md) - Detailed platform guide
- [WINDOWS.md](./WINDOWS.md) - Windows-specific guide
- [SETUP.md](./SETUP.md) - General setup
- [APPLICATION.md](./APPLICATION.md) - Complete guide

## ✨ Key Features

1. **Cross-Platform Scripts** - Node.js scripts work everywhere
2. **Platform Detection** - Automatic platform detection
3. **Path Handling** - Proper path separators for each OS
4. **File Permissions** - Automatic permission setting on Unix
5. **Environment Variables** - Consistent across platforms
6. **Docker Support** - Works identically everywhere
7. **CI/CD Testing** - Tests on all major platforms

## 🚀 Quick Start (Any Platform)

```bash
# 1. Install dependencies
pnpm install

# 2. Setup (creates .env, generates Prisma client)
pnpm setup

# 3. Setup database
pnpm db:setup

# 4. Start development
pnpm dev
```

That's it! Works on Windows, macOS, and Linux. 🎉

---

**Lumina AI** - Built for every platform! 🌍

