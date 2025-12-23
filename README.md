# Lumina AI

**Intelligent Business Operations, Illuminated**

A world-class, production-grade SaaS platform that unifies 8 AI-powered Business Innovation Agents into one seamless system.

## 🎨 Design Philosophy

Lumina AI features a premium Liquid Glass design language inspired by Apple's aesthetic:
- Glassmorphism with frosted glass panels
- Backdrop blur with layered translucency
- Physics-based animations (60-120 FPS)
- Spring-based transitions
- GPU-accelerated, jank-free interactions

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

- **Universal Inbox** - Unified view of tickets, leads, alerts, and tasks
- **Central Knowledge Base** - SOPs, manuals, policies, FAQs
- **Integrations Hub** - CSV imports, webhooks, scheduled data pulls
- **Agent Runs & Audit Trail** - Complete history and transparency
- **Workflow & Rule Engine** - Customizable automation
- **Notifications & Alerts** - Real-time updates

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
- NestJS
- PostgreSQL + Prisma
- Redis/BullMQ
- WebSockets/SSE

### AI
- Google Gemini API (abstracted provider pattern)

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm 8+
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

- [Brand Identity](./BRAND.md)
- [Architecture](./ARCHITECTURE.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)

## 🎯 Production Deployment

1. Set all environment variables
2. Run database migrations
3. Build the application: `pnpm build`
4. Start production servers

## 📄 License

Proprietary - All rights reserved

---

Built with precision, designed with intention.


