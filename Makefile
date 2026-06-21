.PHONY: dev dev-up dev-down dev-logs prod prod-up prod-down prod-build \
        prod-logs prod-ps migrate-logs down clean reset help

DEV_COMPOSE := docker compose --env-file .env.dev
PROD_COMPOSE := docker compose --env-file .env.prod

# ── Dev ──────────────────────────────────────────
dev-up:          ## Start dev infra (db + minio)
	$(DEV_COMPOSE) up -d

dev-down:        ## Stop dev infra
	$(DEV_COMPOSE) down

dev-logs:        ## Tail dev infra logs
	$(DEV_COMPOSE) logs -f

dev: dev-up      ## Start infra then pnpm dev (Ctrl+C to stop, infra keeps running)
	pnpm dev

# ── Prod ─────────────────────────────────────────
prod-build:      ## Build prod images
	$(PROD_COMPOSE) build

prod-up:         ## Start prod stack
	$(PROD_COMPOSE) up -d

prod: prod-build prod-up  ## Build + start prod

prod-down:       ## Stop prod stack
	$(PROD_COMPOSE) down

prod-logs:       ## Tail prod logs
	$(PROD_COMPOSE) logs -f

prod-ps:         ## Show prod container status
	$(PROD_COMPOSE) ps

migrate-logs:    ## Show last migrate run logs
	$(PROD_COMPOSE) logs migrate

# ── Docker Cleanup ───────────────────────────────
down:            ## Stop all environments
	$(DEV_COMPOSE) down
	$(PROD_COMPOSE) down

clean: down      ## Stop + remove volumes
	$(DEV_COMPOSE) down -v
	$(PROD_COMPOSE) down -v

reset: clean     ## Full reset: clean volumes + rebuild prod
	$(PROD_COMPOSE) build
	$(PROD_COMPOSE) up -d

# ── Help ─────────────────────────────────────────
help:            ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) \
	  | sort \
	  | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
