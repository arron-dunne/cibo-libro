# What we’re testing (and why)

* **Confidence**: new changes don’t break sign in/out, manual add, viewing recipes, or the grid.
* **Speed**: catch regressions locally and in CI before deploys.
* **User value**: the core “happy paths” always work (adding/viewing recipes; seeing them in the grid).

# Test layers & tools

1. **Unit tests (fast)**

* Scope: pure functions, validation schemas, small utilities (slugging, tag parsing, filters).
* Goal: high signal, run on every save locally and in CI.

2. **Component tests**

* Scope: React components with state/props (form fields, grid cards, cards-as-links, empty/skeleton states).
* Tools: React Testing Library + jest‑dom style assertions; keep tests user‑centric (query by role/label).

3. **Integration tests**

* Scope: server actions / route handlers working against a **test database**; auth flows with a **mock session**; image-sign endpoints with **fake R2**.
* Goal: verify contracts between layers without a browser.

4. **End‑to‑end (E2E) tests**

* Scope: real browser (Playwright), minimal critical journeys:

  * Sign in → add manual recipe → see it in grid → open detail.
  * Sign out/in again and ensure persistence.
* Keep the E2E suite **small and reliable**; tag a subset as **@smoke** for staging.

5. **Non-functional checks**

* **Accessibility**: axe checks on key pages (manual add, recipe view, grid).
* **Performance**: basic LCP-ish guard via Playwright trace + a Lighthouse snapshot on the recipe page (budget: images lazy-load, no layout shift).
* **Security**: authz checks (can’t view another user’s private recipe), basic CSP headers exist, forms reject invalid inputs.

# What to test—by feature

## Auth (sign in & log out)

* **Unit**: credential validation schema rejects bad emails/password lengths.
* **Integration**: session is created; protected routes 302 to login when unauthenticated; logout clears session.
* **E2E**: happy path sign in; logout returns to public state.
* **Negative**: wrong password shows error; no user leakage in errors.

## Manual entry form

* **Component**:

  * All fields render with labels (Description, Prep, Cook, Servings).
  * Client-side validations surface inline errors (e.g., non-numeric Prep mins).
  * Enter in ingredient/step field adds a new row; “Add row” button appends.
* **Integration**:

  * Server action persists all fields to DB; steps & ingredients stored as arrays; slug generated.
  * Rejects oversized images or disallowed types (even though image URL is deferred, keep the validator ready).
* **E2E**:

  * Fill form → save → confirm success toast / redirect → open recipe page → values match.

## View recipe (detail)

* **Component**: renders title, image (fallback), tags, ingredients, steps; skeleton while loading.
* **Integration**: only owner (or public recipes) can fetch; 404/403 behavior.
* **E2E**: open from grid; back navigation returns where you left off (grid filters intact).

## Recipe grid (library)

* **Component**: consistent card height; cards are focusable links; hover shows pointer; empty state and skeletons.
* **Integration**: search and tag filters return expected subsets; pagination (if present) stable.
* **E2E**: search by keyword shows matching cards; clicking a card goes to `/view/[slug]`.

# Test data & environments

## Databases

* **Unit/Component**: no DB.
* **Integration**: use a **throwaway Postgres** (e.g., Neon branch or dockerized Postgres) with `prisma migrate deploy` + **seed script** to create:

  * 1 user + session fixture
  * 10 recipes (mix of OWNED/EXTERNAL), varied tags
* **E2E**:

  * **Local**: ephemeral DB with seed.
  * **Staging smoke**: tiny seed on staging only (not prod).

## Factories & fixtures

* Lightweight data factories (e.g., faker) for recipes, tags, and steps.
* Deterministic seeds (fixed IDs/slugs) so tests can assert exact URLs.

## External services

* **Auth**: mock session util for integration tests; for E2E use real sign in against test user credentials.
* **R2**: mock the “sign URL” routes in integration tests; in E2E, avoid actual uploads in MVP (or use a tiny data URL upload to a stubbed endpoint).
* **Email** (if any): no‑op provider in test env.

# Structure, naming, and tags

```
/tests
  /unit           // *.spec.ts
  /components     // *.spec.tsx
  /integration    // *.spec.ts
/e2e
  add-recipe-manual.spec.ts
  auth.spec.ts                 // @smoke
  library-grid.spec.ts
  recipe-detail.spec.ts        // @smoke
```

* Use **descriptive test names** and **@smoke** tag for the two quickest “site is alive” flows (auth + cook/view).

# Quality gates & when they run

## Locally

* **Unit/Component** on file save (watch mode).
* **Integration** before opening a PR.
* **E2E** locally for big changes touching flows.

## CI (for every PR and on `develop`/`main`)

* Typecheck → Lint → Unit → Build → **Playwright (Chromium)**
* Keep E2E time < \~2–3 minutes by limiting to essential paths.

## Post‑deploy (staging)

* **Smoke E2E** against `staging` URL on successful CI.
* Optional Lighthouse check on key page.

# Conventions that make testing easier

* Prefer **`getByRole`, `getByLabelText`**; add `aria-label`s where needed.
* Provide **stable test-ids** sparingly for dynamic elements (e.g., card container, add-row buttons).
* Keep side effects isolated: server actions return **typed result objects** (not strings) to ease assertions.
* Display **clear error UI** for validation/network errors; tests assert visible feedback, not internals.

# What we won’t test (MVP)

* Heavy import parsing across dozens of blogs (save for a focused suite later).
* Full image pipelines to R2 (handled by contract tests + a single happy-path stub).

# Security & privacy checks (light but real)

* Private recipes not accessible by other users (integration).
* Rate limit placeholders for importer endpoints (unit for limiter config).
* No PII in logs during tests; redact emails in screenshots/traces.

# Definition of Done (per feature)

* Unit tests for any new utils/validators.
* Component tests for new UI state/edge cases.
* E2E happy path updated or added if user flow changed.
* If touching auth/db: **integration** test updated.
* Axe check passes on new page/major component.

# Rollout

* Start by writing:

  1. **Auth E2E (@smoke)**
  2. **Manual add recipe E2E**
  3. **Unit tests** for validators & filters
  4. **Component tests** for the manual form and grid cards
* Then add **integration tests** for server actions (persist/authorize/read).


# Test stack by layer

| Layer                                                      | Primary tools                                              | Why these                                                  | Helpful add-ons                                                                                                                                                               |
| ---------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit** (utils, validators)                               | **Vitest**                                                 | Fast, modern, ESM/TS-friendly; great DX                    | **c8** (coverage), **ts-node/tsx** (only if needed)                                                                                                                           |
| **Component** (React UI)                                   | **Vitest** + **@testing-library/react**                    | User-centric queries, minimal coupling to implementation   | **@testing-library/user-event**, **@testing-library/jest-dom**                                                                                                                |
| **Integration** (route handlers, server actions, auth, DB) | **Vitest** as runner; call handlers **directly** (no HTTP) | Fewer moving parts than spinning a server; fast feedback   | **Testcontainers** (real Postgres in Docker) or Neon branch; **@faker-js/faker** (fixtures); **aws-sdk-client-mock** (mock S3/R2 SDK v3) or **MinIO** in Docker for S3-compat |
| **E2E / Browser**                                          | **Playwright**                                             | Stable, fast, auto-waits, multi-browser; great trace/debug | **storageState** for logged-in fixtures; **@axe-core/playwright** (a11y); `expect(page).toHaveScreenshot()` for visual checks                                                 |
| **API (HTTP) contract** (optional)                         | **supertest** (only when you truly need HTTP)              | Quick assertions on status/headers for edge cases          | **nock**/**MSW** (see below) if external HTTP calls                                                                                                                           |
| **Accessibility**                                          | **jest-axe** (component) + **@axe-core/playwright** (E2E)  | Catch WCAG issues early                                    | —                                                                                                                                                                             |
| **Performance (spot checks)**                              | **Lighthouse CI** (on staged URL)                          | Budget guardrails for LCP/CLS/TTI                          | Playwright **traces** to inspect slow steps                                                                                                                                   |
| **Visual regression** (optional)                           | **Playwright screenshots** or **Percy/Chromatic**          | Lightweight first; graduate to hosted if needed            | —                                                                                                                                                                             |

---

# Mocks & fixtures (what to use vs. what to hand-roll)

* **Network mocking**

  * **MSW (Mock Service Worker)** for component/integration tests that talk `fetch()` — same mocks run in Node and browser.
  * **When to skip tools**: for your own Next.js **route handlers** and **server actions**, prefer **direct invocation** (import the handler/action and call it). It’s simpler and faster than mocking HTTP.

* **Database**

  * Prefer **Testcontainers** + real **Postgres** for integration tests (reliable, prod-like).
  * **Alternative**: use a **Neon** ephemeral branch for CI to avoid Docker.
  * Seed data with a tiny **factory** layer (plain TS helpers + **@faker-js/faker**). No heavy factory libs needed.

* **Auth**

  * **Playwright**: create a one-time **`storageState`** by logging in and saving cookies (reused across tests).
  * **Integration**: hand-roll a **`makeTestSession()`** helper that inserts a session row and returns a mocked `getSession()` result. Avoid complex auth test libs unless you hit pain.

* **Cloudflare R2 (S3-compatible)**

  * **aws-sdk-client-mock** for unit/integration tests hitting the AWS SDK v3 clients.
  * For “realistic” flows, spin up **MinIO** in Docker (S3-compatible) and point the SDK to it.
  * **E2E**: don’t upload large blobs — use a tiny data URL or stub the sign-URL endpoint.

* **Next.js specifics**

  * Mock **`next/image`** with a trivial `<img>` wrapper in component tests.
  * For routing, prefer testing via **links and URLs** (E2E). If needed in component tests, use **`next-router-mock`**.

---

# What we’ll write ourselves (by design)

* **Handler test harness**: a tiny helper that builds `Request` objects and calls your **route handlers** and **server actions** directly, returning `{ status, headers, json }`. This avoids supertest for most cases.
* **DB reset**: a `resetDb()` util that either:

  * wraps each test in a transaction and rolls back, or
  * truncates tables + reseeds per spec file.
* **Factories**: small TS functions like `makeUser()`, `makeRecipe()` returning typed objects; no extra lib needed.
* **Auth test utilities**: `signInTestUser()` for Playwright (creates user via API, logs in once, saves `storageState`).

---

# Minimal, pragmatic defaults

* **Pick one runner**: use **Vitest** for unit, component, and integration. Keep E2E on **Playwright**.
* **One mocking tool**: use **MSW** for fetch; avoid `nock` unless you must intercept third-party HTTP at the Node layer.
* **Real DB in integration**: **Testcontainers (Postgres)** locally and in CI (or Neon if Docker is painful).
* **Coverage**: **c8** thresholds on utils/validators; don’t chase 100% on UI.

---

# Suggested npm devDependencies (high level, no code)

* Core: `vitest`, `@types/node`, `typescript`, `c8`
* RTL stack: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
* Browser: `@playwright/test`, *(and run `npx playwright install` in CI)*
* Mocks/fixtures: `msw`, `@faker-js/faker`, `aws-sdk-client-mock`, `testcontainers` *(or MinIO via docker-compose)*
* A11y/Perf: `jest-axe`, `@axe-core/playwright`, `@lhci/cli`
* Optional: `supertest`, `next-router-mock`

---

# How this maps to your current features

* **Auth (sign in/out)**: Playwright (`storageState`) + integration helper to assert redirects/403s; no supertest unless checking headers.
* **Manual entry form**: RTL for field behavior (Enter adds row), Vitest for validators, Playwright happy path save→view.
* **Recipe detail & grid**: RTL for skeleton/empty states and link semantics; Playwright for navigation and search filters; integration tests for search/filter queries hitting DB.

Short answer: we don’t need everything from the “full stack” to ship the MVP safely. Let’s cut to a lean, high-signal test slice and implement that now, then layer the rest later.

# MVP test cut (do these now)

1. **E2E smoke (Playwright) — 2 flows**

   * **Auth**: sign in → land on library → sign out.
   * **Create & view**: open Manual Add → fill minimal valid data → save → appears in Grid → open Detail.
   * Add a `@smoke` tag so we can run just these fast.

2. **Integration tests (Vitest) — 3 contracts**

   * **createRecipe** server action persists: title, description, prep/cook/servings, ingredients, steps; returns slug.
   * **getRecipeBySlug** returns only owner’s private recipes; 404/403 behavior covered.
   * **listRecipes** respects search/filter and stable ordering.
   * DB: run against **real Postgres** with a tiny seed. Easiest options:

     * Local Docker via **Testcontainers** (fast + realistic), or
     * A **Neon** ephemeral branch if Docker is annoying.
   * Auth: a tiny `makeTestSession()` helper that inserts a session and mocks `getSession()`.

3. **Component tests (Vitest + RTL) — 4 checks**

   * Manual Entry Form renders all fields with labels; **Enter** in ingredient/step creates a new row; inline validation errors appear.
   * Recipe Card: fixed height, is a **real link**, keyboard focusable.
   * Grid: empty state and skeleton state render.
   * Detail page: shows fallback image and lists steps/ingredients.

4. **Unit tests (Vitest) — a handful**

   * Validation schemas (numbers for prep/cook/servings, non-empty title).
   * Slugify / utility helpers.

5. **Basic accessibility**

   * Run **@axe-core/playwright** on the two E2E routes (Manual Add, Recipe Detail) and fail on serious violations.

6. **Quality gates (local)**

   * Typecheck, lint, unit/component, integration, then `@smoke` E2E. All green before merging feature PRs.

> **Deliberate exclusions for MVP:** visual regression, Lighthouse CI, MSW/MinIO, performance budgets, heavy R2 flows, full a11y sweep, API contract tests via HTTP. We can add these once the core flows are guarded.

---

## Why this is enough

* It covers the **two user journeys that make Cibo Libro useful** today.
* Integration tests lock the **DB/auth contracts**, where most breaking bugs hide.
* Component/unit keep the UI predictable without over-testing implementation details.
* Accessibility smoke prevents obvious regressions early.

---

## Minimal testing scaffolding to create 

* **Playwright**: project config + `storageState` for a logged-in test user; two `@smoke` specs.
* **Vitest**: config shared by unit/component/integration.
* **DB reset**: `truncateAll()` + deterministic **seed** with 1 user, a few recipes.
* **Auth test util**: `makeTestSession()` for integration; Playwright sign-in once then reuse `storageState`.
* **Testing README** section explaining:

  * how to run unit/integration/E2E locally,
  * how to (optionally) start Docker for Postgres **OR** switch to a Neon test DB,
  * the definition of done for new PRs.

---

## Next layers to add later (in order)

1. **CI wiring** for `@smoke` on every PR + post-deploy staging run.
2. **MSW** (only if you start doing client-side fetch in component tests).
3. **Lighthouse CI** budget on staging (LCP/CLS guards).
4. **Visual checks** via Playwright screenshots or Percy, once the UI stabilises.
5. **R2 realism** with MinIO in Docker if/when the image pipeline becomes critical.
