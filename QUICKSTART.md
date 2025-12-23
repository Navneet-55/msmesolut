# Quick Start Guide

Get Lumina AI running in **3 commands** on any platform!

## 🌍 Universal (All Platforms)

```bash
pnpm setup && pnpm db:setup && pnpm dev
```

That's it! The application will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## 📋 What Each Command Does

1. **`pnpm setup`** - Installs dependencies, generates Prisma client, creates .env
2. **`pnpm db:setup`** - Runs migrations and seeds database
3. **`pnpm dev`** - Starts frontend and backend servers

## 🔐 Login

After setup, use these credentials:
- **Email**: `demo@lumina.ai`
- **Password**: `demo123`

## 🪟 Windows Users

If you prefer PowerShell:
```powershell
.\scripts\setup.ps1
.\scripts\db-setup.ps1
.\scripts\start-dev.ps1
```

## 🐳 Docker Users

```bash
docker-compose up -d
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed
```

## ⚙️ Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+ (or use Docker)
- Redis 6+ (or use Docker)

## 📚 Need More Help?

- [Complete Setup Guide](./SETUP.md)
- [Windows Guide](./WINDOWS.md)
- [Platform Guide](./PLATFORMS.md)
- [Multi-Platform Guide](./MULTIPLATFORM.md)

---

**Ready in 3 commands, works on all platforms!** 🚀

