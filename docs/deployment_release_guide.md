# Cibo Libro — Deployment & Release Guide (PR‑lite, Solo Dev)

A concise, copy‑pastable playbook for deploying the Cibo Libro MVP with Vercel + Neon + Playwright tests. Optimized for **solo development**, **low cost**, and **high confidence**.

---

## 1) Objectives
- Keep infra **$0–$20/mo** until traction.
- Ship safely with **staging → prod** promotion.
- Run **typecheck, unit tests, and Playwright E2E** automatically.
- Enable **clean rollbacks** for both app and database.

---

## 2) Branching & Release Flow (PR‑lite)
- **main** → **Production** (protected)
- **develop** → **Staging** (protected)
- **feature/*** → Work branch. Open a **self‑PR** to `develop` when you want a preview.

**Day‑to‑day:**
1. `git switch -c feature/<topic>`
2. Push WIP as often as you like.
3. Open **PR to `develop`** → Vercel **Preview** URL spins up automatically.
4. Merge PR → **Staging deploy** on `develop`.
5. Sanity check staging → **PR `develop` → `main`** → Production.

> Tip: You can skip PRs for tiny changes (push to `develop` or `main`), but prefer PRs to get a preview URL and test gate.

---

## 3) Environment Mapping

### Vercel
- **Production**: branch `main` → domain `cibolibro.com`
- **Staging**: branch `develop` → domain `staging.cibolibro.com`
- **Preview**: every PR gets its own preview URL

### Database (Neon)
- **Prod DB**: used by `main`
- **Staging DB**: used by `develop`
- **(Optional)** Ephemeral **Neon branch per PR** for risky DB changes

### Object Storage
- **Cloudflare R2** (images). Public bucket via Cloudflare CDN on `img.cibolibro.com`.

---

## 4) Secrets & Env Vars
Create these in **Vercel Project → Settings → Environment Variables** (replicate per env):

```
DATABASE_URL
DIRECT_URL                          # for migrations if using Neon direct
NEXTAUTH_SECRET
RESEND_API_KEY
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_BASE_URL                  # https://img.cibolibro.com
SENTRY_DSN                          # optional but recommended
POSTHOG_KEY                         # optional
```

Add a GitHub repo secret:
```
STAGING_URL = https://staging.cibolibro.com
```

---

## 5) CI: Typecheck, Unit, Build, Playwright (local server)
Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main, develop, "feature/**"]
  pull_request:
    branches: [develop, main]

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Install deps
        run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Unit tests
        run: pnpm test -- --ci

      - name: Build app
        run: pnpm build

      - name: Install Playwright
        run: pnpm exec playwright install --with-deps

      - name: E2E (local)
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000
          NODE_ENV: production
        run: |
          pnpm start &
          npx wait-on http://localhost:3000
          pnpm exec playwright test --project=chromium
```

**Branch Protection** (GitHub → Settings → Branches): require `CI` to pass on **develop** and **main** before merge.

---

## 6) Optional: Smoke E2E vs Staging After Deploy
Minimal suite to verify env wiring (secrets/DB) on the real staging URL.

`.github/workflows/e2e-staging.yml`:
```yaml
name: E2E Staging
on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [develop]

jobs:
  e2e-staging:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - name: Smoke E2E vs staging
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.STAGING_URL }}
        run: pnpm exec playwright test -g "@smoke"
```

> Tag a handful of tests with `@smoke`.

---

## 7) Playwright Config (local + remote)
`playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: { baseURL, trace: 'on-first-retry' },
  projects: [ { name: 'chromium', use: { ...devices['Desktop Chrome'] } } ],
  webServer: !process.env.PLAYWRIGHT_BASE_URL ? {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  } : undefined,
});
```

Example folder structure:
```
/e2e
  ├─ onboarding.spec.ts           # @smoke
  ├─ add-recipe-manual.spec.ts
  ├─ import-recipe-url.spec.ts
  └─ cook-mode.spec.ts            # @smoke
```

---

## 8) Database Migrations & Seeding
- In Vercel **Build Command** for `develop` and `main`, run:
  - `pnpm prisma migrate deploy`
- Provide a tiny seed script for **staging** only (not prod). Example `pnpm db:seed:staging`.
- For risky schema changes, create a **temporary Neon branch** and point the PR preview to it.

**Seeding snippet (example):**
```bash
pnpm ts-node prisma/seed.ts
```

---

## 9) Rollbacks
- **App**: Vercel → Deployments → "Redeploy previous".
- **DB**: Neon **Point‑in‑Time Recovery** (enable PITR). For minor issues, ship a hotfix migration.

> Always keep migrations small and reversible.

---

## 10) Observability & Guardrails
- **Sentry** (app errors + performance) — init early.
- **Logtail/Better Stack** (structured logs) — optional.
- **PostHog** (events: `RecipeImported`, `CookStarted`, `ListCreated`).
- **Security headers & CSP** in `next.config.js`/middleware.
- **Rate limits** for importer (Upstash Redis later if needed).

---

## 11) Cost Guardrails
- Vercel Free: fine for MVP; upgrade to Pro when >100 WAUs or long‑running jobs appear.
- Neon Free: OK for early beta; monitor storage and connection limits.
- Cloudflare R2 Free: ample for initial images.

> Heavy importer (OCR/headless) → move to Inngest/Trigger.dev or a tiny Fly.io worker.

---

## 12) Checklists

### New Feature
- [ ] Feature flags if risky
- [ ] Unit tests added/updated
- [ ] E2E updated (happy path)
- [ ] Analytics events added (PostHog)
- [ ] Docs/README updated

### Before Merging to `develop`
- [ ] CI green (typecheck, unit, E2E local)
- [ ] PR description: what changed, how to test
- [ ] Preview URL sanity check

### Before Promoting to `main`
- [ ] Staging smoke tests green
- [ ] Manual sanity on `staging.cibolibro.com`
- [ ] Migration risk reviewed
- [ ] Rollback plan noted

---

## 13) Appendix: `package.json` Scripts (suggested)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "e2e:smoke": "playwright test -g '@smoke'",
    "db:migrate": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:seed:staging": "ts-node prisma/seed.ts"
  }
}
```

---

### That’s it
This guide is your single source of truth for deployment while you solo the MVP. Adjust as you grow (e.g., mandatory PRs, more environments, dedicated job runners).

