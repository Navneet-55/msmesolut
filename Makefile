.PHONY: install dev build start test lint clean docker-up docker-down db-setup db-reset setup

# Cross-platform Makefile for Lumina AI
# On Windows, you can use: make (with Git Bash) or use the PowerShell scripts

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

test:
	pnpm test

lint:
	pnpm lint

clean:
	node scripts/clean.js

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

db-setup:
	pnpm db:generate
	pnpm db:migrate
	pnpm db:seed

db-reset:
	pnpm db:reset

setup:
	@echo "🚀 Setting up Lumina AI..."
	@pnpm install
	@pnpm db:generate
	@if [ ! -f .env ]; then \
		if [ -f .env.example ]; then \
			cp .env.example .env; \
			echo "✓ Created .env file"; \
		fi; \
	fi
	@echo "✅ Setup complete! Update .env and run 'make db-setup'"

