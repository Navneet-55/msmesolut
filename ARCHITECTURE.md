# Lumina AI - Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js App Router (React 18, TypeScript)           │  │
│  │  • Pages: Dashboard, Agents, Analytics, Settings     │  │
│  │  • Components: Glass UI, Charts, Tables, Forms       │  │
│  │  • State: TanStack Query, React Context              │  │
│  │  • Motion: Framer Motion (spring physics)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                        API GATEWAY                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js API Routes / NestJS Controllers             │  │
│  │  • Authentication & Authorization                    │  │
│  │  • Request Validation (Zod)                          │  │
│  │  • Rate Limiting                                     │  │
│  │  • Tenant Isolation Middleware                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Agents     │  │   Data       │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Notify     │  │   Integrate  │  │   Analytics  │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      AI PROVIDER LAYER                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AIProvider Interface (Abstract)                      │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  GeminiProvider (Google Gemini API)            │  │  │
│  │  │  • generateText, summarize, extractStructured   │  │  │
│  │  │  • classify, embed (stub)                      │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  MockProvider (Development)                    │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      8 AI AGENT MODULES                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Customer  │ │Marketing │ │Financial │ │Supply    │       │
│  │Support   │ │& Content │ │Forecast  │ │Chain     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Employee  │ │Competitive│ │Data      │ │Sales     │       │
│  │Onboarding│ │Analysis   │ │Integration│ │Lead      │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma ORM                                           │  │
│  │  • Multi-tenant schema                                │  │
│  │  • Relations, indexes, constraints                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                  │  │
│  │  • Tenant isolation via orgId                        │  │
│  │  • Row-level security (optional)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Redis / BullMQ                                       │  │
│  │  • Background job queue                               │  │
│  │  • Agent run processing                               │  │
│  │  • Cache layer                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User Request** → Next.js page/component
2. **API Call** → TanStack Query → Next.js API route
3. **Validation** → Zod schema validation
4. **Auth Check** → JWT verification + tenant extraction
5. **Service Call** → Business logic in service layer
6. **AI Agent** → Agent module → AIProvider interface → Gemini API
7. **Data Persistence** → Prisma → PostgreSQL
8. **Background Jobs** → BullMQ → Redis → Async processing
9. **Real-time Updates** → WebSocket/SSE → Client
10. **Response** → Optimistic UI update → Server confirmation

## Security Layers

- **Authentication**: JWT tokens, refresh tokens
- **Authorization**: RBAC per organization
- **Tenant Isolation**: Every query filtered by orgId
- **Rate Limiting**: Per user, per endpoint
- **Input Validation**: Zod schemas on all boundaries
- **SQL Injection**: Prisma parameterized queries
- **XSS**: React auto-escaping, sanitization

## Performance Optimizations

- **Frontend**: Code splitting, lazy loading, image optimization
- **API**: Response caching, query optimization
- **Database**: Indexed queries, connection pooling
- **Background Jobs**: Queue-based processing for heavy tasks
- **Real-time**: WebSocket connection pooling


