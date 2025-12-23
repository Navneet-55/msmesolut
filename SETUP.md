# Lumina AI - Setup Guide

## Windows Users

**👉 See [WINDOWS.md](./WINDOWS.md) for Windows-specific instructions**

For Windows, use the PowerShell scripts:
- `.\scripts\setup.ps1` - Automated setup
- `.\scripts\db-setup.ps1` - Database setup
- `.\scripts\start-dev.ps1` - Start development

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

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
PYTHON_API_URL="http://localhost:5000"
PYTHON_API_PORT="5000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000"
API_URL="http://localhost:4000"
NODE_ENV="development"
```

### 3. Set Up Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
pnpm dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### 5. Login

Use the demo credentials:
- Email: `demo@lumina.ai`
- Password: `demo123`

## Project Structure

```
Demo1234/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── prisma/       # Shared Prisma schema
└── ...
```

## Development

### Running Individual Services

```bash
# Frontend only
cd apps/web && pnpm dev

# Backend only
cd apps/api && pnpm dev
```

### Database Management

```bash
# Prisma Studio (GUI for database)
pnpm db:studio

# Create new migration
cd packages/prisma && pnpm migrate
```

## Production Build

```bash
# Build all packages
pnpm build

# Start production servers
cd apps/web && pnpm start
cd apps/api && pnpm start:prod
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### API Connection Issues
- Ensure backend is running on port 4000
- Check NEXT_PUBLIC_API_URL in .env

### Gemini API Issues
- If no API key is provided, the app will use MockProvider
- MockProvider works for development but returns simulated responses

## Next Steps

1. Configure your Gemini API key for real AI responses
2. Customize the brand colors in `BRAND.md`
3. Add your own data integrations
4. Extend agent capabilities


