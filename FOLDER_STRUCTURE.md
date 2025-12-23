# Lumina AI - Folder Structure

```
Demo1234/
├── apps/
│   ├── web/                          # Next.js Frontend
│   │   ├── app/                      # App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # Main dashboard
│   │   │   │   ├── agents/
│   │   │   │   │   ├── [agentId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── inbox/
│   │   │   │   ├── knowledge/
│   │   │   │   ├── integrations/
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   └── api/                  # API Routes
│   │   │       ├── auth/
│   │   │       ├── agents/
│   │   │       ├── data/
│   │   │       └── webhooks/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── glass/                # Glassmorphism components
│   │   │   ├── agents/               # Agent-specific components
│   │   │   ├── charts/               # Data visualization
│   │   │   ├── forms/                # Form components
│   │   │   └── layout/               # Layout components
│   │   ├── lib/
│   │   │   ├── api.ts                # API client
│   │   │   ├── auth.ts               # Auth utilities
│   │   │   ├── utils.ts              # Utilities
│   │   │   └── constants.ts           # Constants
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── styles/
│   │   │   └── globals.css           # Global styles + glass utilities
│   │   ├── public/                   # Static assets
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/                          # NestJS Backend
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── auth/
│       │   │   ├── auth.module.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── auth.controller.ts
│       │   │   └── strategies/
│       │   ├── agents/
│       │   │   ├── agents.module.ts
│       │   │   ├── agents.service.ts
│       │   │   ├── agents.controller.ts
│       │   │   └── modules/          # 8 agent modules
│       │   │       ├── customer-support/
│       │   │       ├── marketing/
│       │   │       ├── financial/
│       │   │       ├── supply-chain/
│       │   │       ├── onboarding/
│       │   │       ├── competitive/
│       │   │       ├── data-integration/
│       │   │       └── sales-lead/
│       │   ├── ai/
│       │   │   ├── ai.module.ts
│       │   │   ├── ai.provider.ts    # Interface
│       │   │   ├── providers/
│       │   │   │   ├── gemini.provider.ts
│       │   │   │   └── mock.provider.ts
│       │   ├── data/
│       │   │   ├── data.module.ts
│       │   │   └── data.service.ts
│       │   ├── integrations/
│       │   │   ├── integrations.module.ts
│       │   │   └── integrations.service.ts
│       │   ├── notifications/
│       │   │   ├── notifications.module.ts
│       │   │   └── notifications.service.ts
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   ├── guards/
│       │   │   ├── interceptors/
│       │   │   └── pipes/
│       │   └── config/
│       │       └── configuration.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── prisma/                       # Shared Prisma
│       ├── schema.prisma
│       ├── migrations/
│       └── seed.ts
│
├── .env.example
├── .gitignore
├── package.json                      # Root workspace
├── pnpm-workspace.yaml               # or npm/yarn workspace
├── README.md
├── BRAND.md
└── ARCHITECTURE.md
```


