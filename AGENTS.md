# AGENTS.md - Law Firm Management System

- Never commit, push, or create PRs unless explicitly asked.
- Read the actual file first. Don't assume you know what's in it.
- After making changes, run `pnpm validate` + `pnpm build` and loop (fix issues, re-run until passing).

## Commands

- `pnpm dev` - dev server
- `pnpm build` - prisma:generate + next build
- `pnpm start` - production server
- `pnpm lint` / `pnpm lint:fix` - ESLint
- `pnpm format` - Prettier (with import sorting) + Prisma format
- `pnpm validate` - format + lint + `tsc --noEmit`
- `pnpm test` / `pnpm test:watch` - vitest
- `pnpm test:coverage` - vitest with coverage
- `pnpm test:browser` - vitest with Playwright
- `pnpm storybook` (port 6006) / `pnpm build-storybook`
- `pnpm prisma:migrate` / `pnpm prisma:deploy` / `pnpm prisma:generate`
- `pnpm prisma:seed` - `tsx prisma/seed.ts`
- `pnpm prisma:studio` - Prisma Studio
- `pnpm prepare` - husky + prisma generate (runs on install)

## Tech Stack

- Framework: Next.js 16 (App Router), React 19 + React Compiler.
- Language: TypeScript strict, `@/*` alias for `./src/*`.
- Styling: CSS Modules + design tokens (`src/styles/variables.css` primitives → semantic tokens). `clsx` for composition. Never inline styles.
- UI: `react-aria-components` — wrap Aria primitives in local components (e.g. `Button.tsx` wraps `Button as AriaButton`); extend Aria props, apply CSS modules via `clsx`, forward external `className`.
- Icons: `react-icons` (subpath imports like `react-icons/fa6`).
- Auth: NextAuth v5 beta (`next-auth@5.0.0-beta.31`) with Google OAuth, JWT sessions, PrismaAdapter.
- Data: Prisma 7 + PostgreSQL via `@prisma/adapter-pg`. Adapter pattern: `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`. Generated client at `src/generated/prisma/`. Singleton at `src/lib/prisma.ts`. Prisma config at `prisma.config.ts`.
- Package Manager: pnpm.

## Architecture

- `src/app/page.tsx` — unauthenticated login page.
- `src/app/(dashboard)/` — authenticated section (Sidebar + Header shared layout). Dashboard routes: `dashboard/`, `case/`, `consultation/`, `user/`.
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API route (required by NextAuth). This is the only API route; do not create additional REST endpoints. Use Server Actions (`actions.ts`) for all custom server-side logic.
- `src/features/` — domain logic organized by feature (`auth/`, `users/`, `consultations/`, `cases/`, etc.).
  - Each domain has `actions.ts` (Server Actions), `queries.ts` (Prisma reads), and/or `mutations.ts` (Prisma writes).
  - Feature-specific components live in `src/features/{domain}/components/`.
- `src/components/{ui,layout}/` — shared primitives (ui) and app chrome (layout). Domain-agnostic; reusable across features.
- `src/lib/` — shared utilities: `prisma.ts` (singleton), `auth.ts` (NextAuth config), etc.
- `src/styles/` — design tokens (`variables.css`: primitives → semantic tokens).
- `src/stories/` — Storybook stories for UI components, imported via `@/` aliases.
- Docker Compose for local Postgres: `docker compose up -d`.

## Conventions

### Styling

- Use only CSS custom properties from `variables.css`.
- Token system: primitives (`--raw-*`) → semantic tokens (`--color-*`, `--space-*`, etc.).
- Style exclusively via CSS Modules, imported as `styles` and composed with `clsx`.
- Never use inline styles (except storybooks) or global element selectors.
- Nesting in CSS Modules must mirror the component or document hierarchy (parent element nests children).
- Accept and forward external `className` props for overrides.
- Use only semantic tokens from `variables.css`; no hardcoded values.

- Responsives:
- Desktop first aproach CSS - mobile will be added later.
- Use flexbox whenever possible - avoid grid.
- `@media` only at `48rem` (use literal `rem` — CSS variables don't work in media queries).
- Avoid the use JS viewport detection or conditional mobile/desktop components for layout — use CSS where possible.

### Components

- Always scan and use existing components from `components/` first.
- Interactive/browser API components: start with `"use client"`.
- Co-locate in `src/components/{category}/{ComponentName}/` — component, CSS module.
- Stories live in `src/stories/`, imported via `@/` aliases (no relative `./` imports).
- Wrapping Aria components pattern: extend Aria props interface, add local variants/props, use explicit interface.
- Extract component props into a named interface extending the Aria type when adding local variants/props — keeps function signatures terse and consistent.

### Data Layer

- Each feature domain (`src/features/{domain}/`) owns its data logic split across three files:
  - `actions.ts` — Next.js Server Actions (`"use server"`). Handle auth flows, form submissions, cookie management, and orchestrate calls to queries/mutations.
  - `queries.ts` — Prisma read operations (`findUnique`, `findMany`, aggregate, etc.). Keep these as plain async functions (no `"use server"`).
  - `mutations.ts` — Prisma write operations (`create`, `update`, `upsert`, `delete`, etc.). Plain async functions.
- Never import `prisma` directly outside of `queries.ts` or `mutations.ts`. Server actions and components must delegate to these files.
- Co-locate feature-specific components in `src/features/{domain}/components/`. Only put truly shared/reusable components in `src/components/ui/`.
- Prefer Server Actions over API routes. Do not create files under `src/app/api/` — the auth `[...nextauth]` route is the only exception (required by NextAuth).

### Testing

- Test files live in `__tests__/` directories co-located with their feature/component (Next.js convention).
  Example: `src/features/users/__tests__/queries.test.ts`
- Naming: `*.test.ts` for logic, `*.test.tsx` for components.
- Mock `@/lib/prisma` via `vi.mock` for data-layer tests. Use Prisma types for mock values (no `as any`).

### General

- Idiomatic, modular code is the top priority in this project, not a collection of hacks and workarounds.
- Named exports only — no default exports, except for Next.js special files (`page.tsx`, `layout.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx`, `route.tsx` etc.) which require a default export. Use inline `export default function` for these files.
- PascalCase components/types; camelCase variables/functions/files (component dirs are PascalCase).
- No comments unless explaining a non-obvious decision.
- Prisma schema: `snake_case` fields, `PascalCase` models/enums.
- Husky: pre-commit runs `lint-staged` (Prettier + ESLint on staged files); pre-push runs `pnpm validate && pnpm test`.

---

## TypeScript Coding Standards

### 1. Parameter Typing and Readability

- Ban Destructured Inline Types: Never mix variable destructuring and type definitions inside a function's parameter parentheses (e.g., `({ a, b }: { a: string; b: string })`).
- Parameter Handling: Pass complex inputs as a single unified object argument (e.g., `payload: DocumentPayload`) and destructure it within the first lines of the function body.
- Inline Exception: Simple inline types are permitted only if the object has 3 or fewer primitive properties, is not destructured in the signature, and is used in a non-exported helper.

### 2. Domain-Driven Naming (Anti-Nominal)

- No Function-Scoped Type Names: Do not name interfaces or types after a single specific function (avoid `ProcessDataArgs`).
- Focus on the Data Shape: Name types after the domain data or payload they represent (e.g., `DocumentPayload`, `UserSession`). This ensures types are structurally reusable across database utilities, API boundaries, and UI components.

### 3. Boundary Type Strictness

- Explicit Returns at Boundaries: Always explicitly declare return types on public API endpoints, exported Server Actions, and shared hooks (e.g., `Promise<ActionResponse>`). This protects contracts and speeds up compilation times.
- Implicit Internal Returns: Allow TypeScript's native type inference engine to handle return types for internal, unexported helper functions or simple utility chains.

### 4. Code Patterns

Avoid this signature clutter:

```typescript
// ANTI-PATTERN: Heavy cognitive load, zero reusability
export async function updateRecordAction({ id, Status, retry }: { id: string; status: "pending" | "done"; retry: boolean }) { ... }
```

Enforce this clean, reusable structure:

```typescript
// IDIOMATIC: Clear boundaries, reusable domain types, flexible composition
export interface TaskPayload {
  id: string;
  status: "pending" | "done";
  retry: boolean;
}

export async function updateRecordAction(payload: TaskPayload): Promise<{ success: boolean }> {
  const { id, status, retry } = payload;
  // implementation
  return { success: true };
}
```

### Avoid overengineering:

Do not generate brand-new named interfaces if the function only returns a simple primitive object (like `{ id: string }`) or if it can be cleanly represented using TypeScript's native `Pick<PrismaModel, Keys>`. Only create a new named domain type if the output combines data from multiple sources or requires custom computed fields.
