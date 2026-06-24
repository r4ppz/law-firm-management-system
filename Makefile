DEV_COMPOSE := docker compose -f docker-compose.yml --env-file .env.dev
PROD_COMPOSE := docker compose -f docker-compose.prod.yml --env-file .env.prod

.PHONY: help dev dev-up dev-down dev-clean dev-reset prod prod-up prod-down prod-ps prod-reset down clean reset

.DEFAULT_GOAL := help

help: ## Show this help menu
	@printf "\nUsage: make \033[36m<target>\033[0m\n"
	@awk ' \
		BEGIN {FS = ":.*?## "} \
		/^[a-zA-Z_-]+:.*?## / { \
			printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 \
		} \
		/^# ── / { \
			gsub(/^# ── | ──+$$/, ""); \
			printf "\n\033[1;35m%s\033[0m\n", $$0 \
		} \
	' $(MAKEFILE_LIST)
	@printf "\n"

# ── Development ──────────────────────────────────
dev: dev-up ## Start dev infra, migrate, and run application
	@echo "Waiting for Postgres..."
	$(DEV_COMPOSE) exec -T db pg_isready -U testing -t 10
	@echo "Running migrations..."
	pnpm prisma:deploy
	@echo "Starting dev server..."
	pnpm dev

dev-up: ## Start dev containers
	$(DEV_COMPOSE) up -d

dev-down: ## Stop dev containers
	$(DEV_COMPOSE) down

dev-clean: ## Stop dev containers and remove volumes
	$(DEV_COMPOSE) down -v

dev-reset: ## Hard reset dev environment
	$(DEV_COMPOSE) down -v
	$(MAKE) dev-up

# ── Production ───────────────────────────────────
prod: prod-up ## Build and start prod container stack natively

prod-up: ## Build and start prod container stack natively
	$(PROD_COMPOSE) up -d --build

prod-down: ## Stop prod containers
	$(PROD_COMPOSE) down

prod-ps: ## Status of prod containers
	$(PROD_COMPOSE) ps

prod-reset: ## Hard reset prod environment
	$(PROD_COMPOSE) down -v
	$(MAKE) prod-up

# ── Global ───────────────────────────────────────
down: ## Stop all container environments
	$(DEV_COMPOSE) down
	$(PROD_COMPOSE) down

clean: ## Stop all environments and purge all volumes
	$(DEV_COMPOSE) down -v
	$(PROD_COMPOSE) down -v

reset: ## Hard reset everything (clean + rebuild + restart)
	$(MAKE) clean
	$(MAKE) dev-up
	$(MAKE) prod-up
