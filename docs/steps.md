# What’s next (in order)

1. **Freeze the MVP scope (1 page)**

- Copy the CSV into a short PRD: purpose, target user, top 6 MVP stories, out-of-scope.
- Define success metrics: activation (≥3 recipes added week 1), weekly cooks started, D7/D28 retention.

2. **Design foundations (1–2 days)**

- Pick brand basics: color palette, type pair (display + UI), spacing, radius, shadows.
- Build a tiny **UI kit** in Storybook (Card, Tag, Button, Input, Badge, Empty state, Toast).

3. **Wireframes (half day)**

- 4 flows: Add Recipe (manual/URL), Recipe Inbox, Library Grid + Filters, Cook Mode.
- Approve “clean view” (ingredients + steps only, always with “View Original”).

4. **Data model & API surface (1 day)**

- **Entities**
  - `User(id, email, password_hash, createdAt)`
  - `Recipe(id, ownerId, type[owned|external], title, imageUrl, ingredients[], steps[], tags[], sourceUrl, createdAt, isPublic)`
  - `ImportJob(id, userId, sourceUrl, status, rawHtml, parsedJson, createdAt)`
  - _(Release1+)_ `ShoppingList`, `ShoppingItem`

- **Minimal API**
  - POST `/api/recipes` (manual)
  - POST `/api/import` (URL) → returns ImportJob → creates Recipe
  - GET `/api/recipes?query=&tags=`
  - GET `/api/recipes/:id`
  - PATCH `/api/recipes/:id` (edit, toggle public for **owned** only)
  - GET `/r/:slug` → public recipe page (owned only)

5. **Architecture & repo setup (half day)**

- Next.js (App Router, TS) + Prisma/Postgres, Auth.js, Tailwind + shadcn, Zod for validation.
- Storage: R2/S3 for images. Feature flags via env.
- Observability: Sentry, Logtail/Better Stack, PostHog (events: RecipeImported, CookStarted, ListCreated).

6. **Importer plan (1 day)**

- Pass 1: JSON-LD / Microdata (`schema.org/Recipe`) → high-precision parse.
- Pass 2: heuristic fallback (title/image/opengraph + link only).
- Guardrails: robots.txt respect, timeouts, user-agent, rate limit per user.
- Legal: store **full text privately** for personal use; public allowed **only for owned** recipes.

7. **Legal & compliance basics (same week, quick drafts)**

- Terms of Use, Privacy Policy, **DMCA/Notice & Takedown**, Content Policy (no publishing imports).
- “Report” button on public pages. Age gate 16+.
- Logs for takedowns & audit. Include **R038** in the spec as a release gate.

8. **Performance & accessibility budgets**

- LCP < 2.5s on 4G, CLS < 0.1.
- Keyboard-navigable, focus states, prefers-reduced-motion, color contrast AA.

9. **Testing plan**

- Unit: parser, recipe validators, tag filters.
- E2E (Playwright): add manual, import URL, cook mode, toggle public (owned).
- Seed data script for dev: 10 recipes, 6 tags.

10. **Beta plan**

- 20–50 target testers (friends, cooking subs, Slack/Discord groups).
- In-product feedback widget; weekly synthesis; ship small fixes fast.

---

## Suggested 4-week MVP build plan (solo, realistic)

**Week 1**

- Repo, Auth, DB (Prisma), basic entities.
- Manual add → Recipe detail → Library grid.
- Card UI, tags, search/filter.

**Week 2**

- Importer v1 (JSON-LD first; fallback to link-only).
- Cook Mode (stepper, large type, basic inline timer).
- Export JSON/CSV.
- Sentry/PostHog wired.

**Week 3**

- Polish: empty states, error states, skeleton loaders.
- Public pages for **owned** recipes + “Report” button.
- Anonymized analytics dashboard.

**Week 4**

- Beta seed, bug bash, perf pass, accessibility pass.
- Write & publish TOS/Privacy/DMCA.
- Landing page + waitlist + onboarding email.

---

## Guardrails we didn’t want to miss (now covered)

- ✅ Content policy: **No public publishing of imported recipes**; public allowed only for user-owned/creator-owned.
- ✅ DMCA workflow & report abuse button.
- ✅ Export from day one (trust/ownership).
- ✅ Metrics to judge traction (not vibes).
- ✅ Basic security checklist: hashed passwords (argon2/bcrypt), HTTPS only, authz checks (recipe owner), input validation (Zod), file type/size checks, signed upload URLs, rate limits on import.
