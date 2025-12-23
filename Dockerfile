# Multi-stage build for Lumina AI

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY packages/prisma/package.json ./packages/prisma/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Build applications
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY packages/prisma/package.json ./packages/prisma/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built applications
COPY --from=builder /app/packages/prisma ./packages/prisma
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/

# Generate Prisma client
RUN pnpm db:generate

# Expose ports
EXPOSE 3000 4000

# Start script
CMD ["node", "apps/api/dist/main.js"]

