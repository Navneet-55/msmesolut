# Scripts Directory

This directory contains **cross-platform** setup and utility scripts that work on Windows, macOS, and Linux.

## 🌍 Universal Scripts (All Platforms)

These Node.js scripts work identically on **all platforms**:

### Setup & Installation
- **`setup.js`** - Complete automated setup
  ```bash
  node scripts/setup.js
  # or
  pnpm setup
  ```

- **`db-setup.js`** - Database setup (migrate + seed)
  ```bash
  node scripts/db-setup.js
  # or
  pnpm db:setup
  ```

- **`launch.js`** - Universal launcher (setup + start)
  ```bash
  node scripts/launch.js
  # or
  pnpm launch
  ```

### Utilities
- **`clean.js`** - Clean build artifacts and node_modules
  ```bash
  node scripts/clean.js
  # or
  pnpm clean
  ```

- **`check-platform.js`** - Detect and display platform info
  ```bash
  node scripts/check-platform.js
  # or
  pnpm check-platform
  ```

- **`copy-env.js`** - Copy .env.example to .env
  ```bash
  node scripts/copy-env.js
  # or
  pnpm env:copy
  ```

- **`env-check.js`** - Verify required environment variables
  ```bash
  node scripts/env-check.js
  # or
  pnpm env:check
  ```

- **`postinstall.js`** - Post-install setup (runs automatically)

## 🪟 Windows Scripts (PowerShell)

- **`setup.ps1`** - PowerShell setup script
  ```powershell
  .\scripts\setup.ps1
  ```

- **`db-setup.ps1`** - PowerShell database setup
  ```powershell
  .\scripts\db-setup.ps1
  ```

- **`start-dev.ps1`** - Start development servers
  ```powershell
  .\scripts\start-dev.ps1
  ```

## 🐧 Unix Scripts (macOS/Linux)

- **`setup.sh`** - Bash setup script
  ```bash
  bash scripts/setup.sh
  ```

## 📦 Package Scripts

All scripts are also available via npm/pnpm:

```bash
pnpm setup          # Run setup.js
pnpm db:setup       # Run db-setup.js
pnpm launch         # Run launch.js
pnpm clean          # Run clean.js
pnpm check-platform # Run check-platform.js
pnpm env:copy       # Run copy-env.js
pnpm env:check      # Run env-check.js
```

## 🎯 Recommended Usage

### For Maximum Compatibility
Use the **Node.js scripts** - they work on all platforms:
```bash
node scripts/setup.js
node scripts/db-setup.js
pnpm dev
```

### For Platform-Specific Experience
- **Windows**: Use PowerShell scripts (`.ps1`)
- **macOS/Linux**: Use Bash scripts (`.sh`) or Makefile

### For Docker
Docker commands work identically on all platforms:
```bash
docker-compose up -d
```

## 🔧 Script Features

All scripts include:
- ✅ Platform detection
- ✅ Prerequisite checking
- ✅ Error handling
- ✅ Clear output messages
- ✅ Cross-platform path handling

## 📝 Notes

- All Node.js scripts use `path.join()` for cross-platform paths
- File operations use Node.js `fs` module (cross-platform)
- No shell-specific commands in universal scripts
- Platform-specific scripts are optional enhancements

---

**Use universal scripts for best compatibility across all platforms!** 🌍
