# Lumina AI

**Intelligent Business Operations, Illuminated** ✨

A world-class, production-grade SaaS platform that unifies 8 AI-powered Business Innovation Agents into one seamless system.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-green)

## 🎨 Design Philosophy

Lumina AI features a premium Liquid Glass design language inspired by Apple's aesthetic:
- Glassmorphism with frosted glass panels
- Backdrop blur with layered translucency
- Physics-based animations (60-120 FPS)
- Spring-based transitions
- GPU-accelerated, jank-free interactions
- **Dark/Light mode with system preference support**

## 🚀 Features

### 8 AI-Powered Business Agents

1. **Customer Support & Service Agent** - Automated ticket handling, sentiment analysis, response generation
2. **Marketing & Content Generation Agent** - Campaign creation, content generation, engagement optimization
3. **Financial Forecasting & Cash Flow Agent** - Predictive analytics, budget planning, financial insights
4. **Supply Chain & Inventory Management Agent** - Stock optimization, demand forecasting, supplier management
5. **Employee Onboarding & Training Agent** - Personalized onboarding, training plans, progress tracking
6. **Competitive Analysis & Market Research Agent** - Market insights, competitor tracking, trend analysis
7. **Data Integration & Business Intelligence Agent** - Data unification, dashboard creation, insights
8. **Sales Lead Qualification Agent** - Lead scoring, enrichment, pipeline optimization

### Core Platform Features

- **Analytics Dashboard** - Revenue tracking, agent usage, ticket metrics with beautiful charts
- **Activity Log** - Complete audit trail with filtering
- **Notification Center** - Real-time notifications with badge counts
- **User Settings** - Profile, appearance, notifications, privacy settings
- **Data Export** - Export data in CSV, JSON, or TXT formats
- **Universal Inbox** - Unified view of tickets, leads, alerts, and tasks
- **Central Knowledge Base** - SOPs, manuals, policies, FAQs
- **Integrations Hub** - CSV imports, webhooks, scheduled data pulls
- **Agent Runs & Audit Trail** - Complete history and transparency
- **Workflow & Rule Engine** - Customizable automation
- **Keyboard Shortcuts** - Power user navigation (Ctrl+K, /, etc.)
- **Help Modal** - Keyboard shortcuts and resources

## 🏗️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (custom glass utilities)
- shadcn/ui (customized)
- Framer Motion
- TanStack Query
- react-hook-form + zod

### Backend
- NestJS (TypeScript)
- Python (FastAPI) - AI/ML services
- PostgreSQL + Prisma
- Redis/BullMQ
- WebSockets/SSE

### AI
- Google Gemini API (abstracted provider pattern)
- Python ML Services (embeddings, sentiment, analysis)
- Sentence Transformers (embeddings)
- scikit-learn (classification)

## 🚀 Quick Start

### 🌍 Universal Setup (All Platforms - Recommended)

**One-command setup:**
```bash
pnpm setup && pnpm db:setup && pnpm dev
```

**Or use the launcher:**
```bash
pnpm launch
```

### Platform-Specific Guides

- **Windows** → [WINDOWS.md](./WINDOWS.md)
- **macOS/Linux** → [PLATFORMS.md](./PLATFORMS.md)
- **All Platforms** → [SETUP.md](./SETUP.md)

### Quick Options

**Option 1: Node.js Scripts (Universal)**
```bash
node scripts/setup.js
node scripts/db-setup.js
pnpm dev
```

**Option 2: Package Scripts (Universal)**
```bash
pnpm setup
pnpm db:setup
pnpm dev
```

**Option 3: Docker (All Platforms)**
```bash
docker-compose up -d
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed
```

**Option 4: Platform-Specific Scripts**

Windows (PowerShell):
```powershell
.\scripts\setup.ps1
.\scripts\db-setup.ps1
.\scripts\start-dev.ps1
```

macOS/Linux:
```bash
bash scripts/setup.sh
make db-setup
make dev
```

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm 8+
- Python 3.10+ (optional, for enhanced AI services)
- PostgreSQL 14+
- Redis 6+

### Setup

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database, Redis, and Gemini API key
   ```

3. **Set up database:**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

4. **Start development servers:**
   ```bash
   pnpm dev
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 🗄️ Database

The application uses Prisma with a comprehensive multi-tenant schema. Run migrations and seed data:

```bash
pnpm db:migrate
pnpm db:seed
```

Access Prisma Studio:
```bash
pnpm db:studio
```

## 🔐 Authentication

Default demo credentials:
- Email: `demo@lumina.ai`
- Password: `demo123`

## 🧪 Development

- **Type checking:** `pnpm type-check`
- **Linting:** `pnpm lint`
- **Build:** `pnpm build`

## 📚 Documentation

- [Complete Application Guide](./APPLICATION.md) - **Start here!**
- [Final Polish & Features](./FINAL_POLISH.md) - **All new features!**
- [UX Improvements](./UX_IMPROVEMENTS.md) - User experience enhancements
- [Multi-Platform Support](./MULTIPLATFORM.md) - **Platform compatibility**
- [Platform Guide](./PLATFORMS.md) - Detailed platform instructions
- [Windows Guide](./WINDOWS.md) - Windows-specific setup
- [Setup Guide](./SETUP.md) - General setup instructions
- [Brand Identity](./BRAND.md)
- [Architecture](./ARCHITECTURE.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Code Refinements](./REFINEMENTS.md)

## 🎯 Production Deployment

1. Copy environment file: `cp env.example .env`
2. Set all environment variables in `.env`
3. Run database migrations: `pnpm db:migrate`
4. Seed the database: `pnpm db:seed`
5. Build the application: `pnpm build`
6. Start production servers: `pnpm start`

## 🌍 Multi-Platform Support

Lumina AI is **fully multiplatform** and works on:
- ✅ Windows (PowerShell, CMD, Git Bash, WSL2)
- ✅ macOS (Terminal, iTerm2)
- ✅ Linux (Ubuntu, Debian, Fedora, etc.)
- ✅ Docker (all platforms)

See [MULTIPLATFORM.md](./MULTIPLATFORM.md) for complete platform guide.

## 🎨 UI Components

The application includes a comprehensive UI component library:
- Toast notifications
- Skeleton loaders
- Empty states
- Theme toggle
- Notification center
- Help modal
- Data export
- Confirmation dialogs
- Progress bars
- Badges
- Avatars
- Tabs

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` or `Ctrl+K` | Focus search |
| `Ctrl+H` | Go to dashboard |
| `Ctrl+N` | New item |
| `?` | Open help |
| `Esc` | Close modal/menu |

## 📄 License

Proprietary - All rights reserved

---

Built with precision, designed with intention. Works on every platform. 🌍✨


