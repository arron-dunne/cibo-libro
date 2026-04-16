# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cibo Libro is a web app designed to be the best digital cookbook and assistant available. The goal is to be user's one-stop cooking app for all things food related. We want to orangise users recipes so they never forget one again. Let them browse and choose what to cook for dinner easily. We want to provide all the tools a food lover needs: unit conversion, browsing friends recipes, keeping a shopping list, and so much more. In the future we want to leverage the power of AI to be the cooking-brain for people: generating recipes, smart recommendations, orchastrating cooking and shopping seamlessly, and more. We want this to be a revenue-making product, but not greedy or expensive.

### Philosophy

Cibo Libro translates literally from Italain as Food Book. We are the bridge between the wonderful world of food and the powerful world of technology. By taking the cognitive load off users, there's more room to enjoy food and cooking.

### Goal

The goal is to acheive millions of regular users by providing an essential product that improves people's lives. The app should be the best on the market and beat every competitor out there on at least 1 front - price, features, visuals, performance etc. The visual design should be world-class - think apple liquid glass and not ai slop.

### Features

The abstract features are in bold with some examples of features and how we could provide them to users. This is not an exhaustive nor finalised list and discussion and adaptation is encouraged.

- **Importing recipe**: from a url, a video, social media, directly from another cooking site.
- **Adding personal recipes**: manually via a web form, uploading a photo.
- **Adding other recipes**: saving recipes from other users on the app, AI generated recipes.
- **Organising recipes**: organise, filter, sort, search and present recipes in a quick, easy-to-use, and convenient way.
- **Planning**: meal planner, shopping list/planner
- **Sharing**: share recipes with friends, interact with others about the food you made, the town square for food lovers
- **Cooking**: act as a cooking assistant when user's are cooking, presenting ingredients, steps, timer.
- **Learning**: teach users how to cook, cooking skills around the world, from beginner to advanced.
- **Create physical cookbooks**: from the recipes saved, users can create a physical cookbook, like ones made by profressional chefs, add personal touches, choose a style.

### UI/UX

The aesthetic is playful, rounded, and premium with subtle colors in the background — food-forward without being cold or clinical.

**Palette:** light pastel colors so attention isnt drawn away from the main components on the page. White cards and surfaces sit on top of the gradient background. Zinc greys (`zinc-600`, `zinc-900`) for text. Rose accents for tags and interactive highlights.

**Background:** Fixed full-screen gradient with a soft blur orb (`bg-orange-200/35 blur-3xl`) for depth. Inspired by Apple liquid glass — layered, not flat.

**Font:** [Nunito](https://fonts.google.com/specimen/Nunito) (Google Fonts) — rounded, friendly, highly legible. Applied globally via `--font-nunito`.

**Components:**
- Cards: `rounded-2xl` / `rounded-3xl`, `shadow-lg`, white background, subtle `border-zinc-200`
- Buttons: Gradient orange-to-rose pill shape, white text, `hover:brightness-90 active:brightness-75`
- Tags: Pill badges with `from-orange-100 to-rose-100` fill and `border-rose-200`
- Modals/menus: White `rounded-3xl` with `shadow-2xl`, `backdrop-blur-sm` overlays
- Hover interactions: `hover:scale-105` on cards; brightness shifts on buttons

**Icons:** Lucide React throughout.

### Business Model

The app should generate revenue but its not an essential part. Most apps these days provide a good service, but lock regular use behind a paywall. Users of Cibo Libro should be able to use the app freely with generous limits. Over 100 saved recipes, unlimited imports, additions. Users should feel like they are getting a useful and valuable tool for free, and the payment is for additional stuff, not the necessaties. Where infrastructure costs are low - like data storage and simple compute - we can potentially offer it for free. Advanced features like learning courses, physical cookbook creation and ai recipe generation should require payment. Paywalls could protect against power-users who rack up massive costs (like AI generating lots of recipes). We will not have adverts. Consider both subscription and pay-as-you-go payment models. 

### TOOLS

| Category | Tool |
| -------- | ---- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth v5 (credentials provider, JWT sessions) |
| Password hashing | Argon2 |
| Storage | Cloudflare R2 (AWS S3 SDK — presigned URLs) |
| Email | Resend |
| HTTP client | ky |
| HTML parsing | Cheerio |
| Validation | Zod v4 |
| Icons | Lucide React |
| Dates | Temporal polyfill |
| Testing | Vitest (unit + integration) + Playwright (e2e) |
| Deployment | Vercel (Analytics + Speed Insights) |

## MVP

THE PROJECT IS CURRENTLY IN THE MVP STAGE, THEREFORE EVERYTHING IN THIS SECTION CURRENTLY APPLIES. IF ANYTHING IN THIS SECTION CONTRADICTS OTHER PARTS, THIS SECTION TAKES PRECEDENCE.

#### MVP Overview

The Minimum Viable Product for Cibo Libro is a web app that users can use to upload/save their recipes, and easily organise and view them. We are helping users manage ALL their recipes and presenting them in a convenient way to seamlessly navigate and find them. We also need to provide some simple application features like accounts/auth, data storage, deployment on the web, basic settings etc. This is a slice of the full product and the aim is to give users something they will like and come back to, as quickly as possible. The goal is user sign-up, retention and feedback.
The MVP is a work in progess and you are encouraged to discuss modifications, adpatations and enhancements where applicable, and within the scope.

#### MVP Pages & Features

| Feature | Pages |
| ------- | ----- |
| Creating user accounts with email and password | `/login`, `/register` |
| Manually adding recipes via a web form | `/add` |
| Importing recipes from a URL | `/import` |
| Viewing all recipes and being able to seach, sort, and filter them | `/add` |
| Viewing individual recipes with all the details, ingredients, steps | `/view` |
| Cooking assistant showing ingredients, steps, timers | `/cook` |


#### MVP Limitations

- Recipes are only accessible by the user that made it - sharing and viewing other users recipes is not allowed

#### MVP Business Model

The MVP does not have to be revenue-generating and is focussed more on user sign-up and retention.

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and API routes
  - `(login)/` - Auth routes (login, register, forgot/reset password)
  - `(main)/` - Protected routes (home, all recipes, new/edit/view recipe, import, settings)
  - `cook/[slug]/` - Fullscreen cook mode
  - `api/` - API endpoints (auth, image management)
  - `actions/` - Server actions
  - `components/` - Shared React components
- `src/lib/` - Utility modules
  - `auth/` - NextAuth configuration (server-only)
  - `import/` - Recipe import system (JSON-LD parser, paywall detection, URL validation)
  - `images/` - Cloudflare R2 image handling
  - `prisma.ts` - Prisma client singleton
- `src/types/` - TypeScript type definitions
- `src/test/` - Test files (`unit/` and `integration/`)
- `prisma/schema.prisma` - Database schema

### Key Patterns (MVP)

**Auth:**

- NextAuth v5 with credentials provider
- Argon2 password hashing
- JWT sessions
- `sessionVersion` for invalidation (on password reset for example)
- New users create account on `/register` endpoint with email, password and confirm password
- Existing users login on `/login` endpoint with email and password
- Reset passwords via email (Resend email provider)

**Recipe Import Flow:**

1. Users inputs a URL via a form at `/import` endpoint
2. Server action first creates a database entry for the ImportJob
3. URL validation via DNS lookup (blocks private IPs, dangerous protocols, dangerous ports)
4. Check that the URL is allowed to be imported (not blocked by paywall, robots.txt or denylisted domains)
5. HTML fetched and parsed for JSON-LD `<script type="application/ld+json">`
6. If JSON-LD exists extract recipe, save it to the database and redirect user to new recipe page
7. If no JSON-LD exists direct the `/import/link` endpoint where users save a simplified link card (title, image, descritpion and tags) for this URL
8. Update the ImportJob entry with the results (failed with reason or success)

**Manual Add Recipe Flow**
From the `/add` endpoint users are given a form to add recipes. The form contains fields for all recipe properties, including images, and upon saving are saved into the database. The user is then redirected to this new reicpe to view.

**View All Recipes**
On the `/all` endpoint users can view all their recipes stored in the database. Recipes are shown as cards which can be clicked on to take the user to the view page for that recipe. Recipe cards contain a high level overview of a recipe (currently title, image, description and tags). The all page also has a search bar for searching titles, a sort button and a filter button to filter on tags and other relevant properties.

**Images:**

- Cloudflare R2 via AWS S3 SDK.
- Presigned URLs for upload/download. Stored as `user/<userId>/<uuid>.<ext>`.
- Avoids sending image data to vercel deployment server, which reduces bandwidth

**Recipe Types (in schema):**

- `OWNED` - User's own recipe
- `EXTERNAL_FULL` - Imported with full content
- `EXTERNAL_LINK` - Link-only (fallback when import fails)

### Database Models (Prisma)

- `User` - accounts with sessionVersion for session invalidation
- `Recipe` - recipes with owner relation, ingredients/steps as arrays
- `Upload` - image metadata (key, size, contentType)
- `ImportJob` - async import tracking with rawHtml and parsedJson

## Testing

### Unit tests

- Scope: pure functions, validation schemas, small utilities (slugging, tag parsing, filters).
- Goal: verify individual functions do as planned, catch edge cases and error handling, run in CI before every pull request
- Tooling: vitest
- File location: `src/test/unit/`
- Naming convention: `[filename].unit.test.js`
- Examples: isSafeUrl, uniqueSlug, parseIsoDurationMinutes

### Integration tests

- Scope: processes with multiple functions that depend of each other
- Goal: verify larger programs with many pieces work together, run in CI before every pull request
- Tools: vitest
- File location: `src/test/integration/`
- Naming convention: `[filename].int.test.js`
- Examples: parseJsonLd, saveLinkCard, importRecipe

### End‑to‑end (E2E) tests

- Scope: real browser with page rendering, simulating user interactions, connected to a test database
- Goal: verify real user experience works through the browser
- Tools: playwright
- File location: `src/test/e2e/`
- Naming convention: `[filename].e2e.test.js`
- Examples: importing recipes, editing recipes, sorting and filtering recipes

### Smoke tests

- Scope: a smaller subset of E2E tests which test the core user paths
- Goal: Run before every pull request. Catch any breaking changes quickly
- Tools: playwright
- File location: `src/test/e2e/smoke`
- Naming convention: `[filename].smoke.test.js`
- Examples: user login/logout, adding recipes

Additional notes for Smoke and E2E tests:
- `auth.setup.ts` runs before tests to save and persist a logged in session 
- `helpers.ts` contains small helper functions for testing (for example uniqueEmail)
- `playwright.config.ts` contains playwright config

## Commands

```bash
npm run test:unit              # Run all unit tests
npm run test:int               # Run all integration tests
npm run test:e2e               # Run all e2e tests
npm run test:smoke             # Run smoke tests (subset of e2e tests)
npx vitest run [file]          # Run a specific unit/integration test file
npx playwright test [test]     # Run a specific e2e/smoke test file  
```

## Version Control

We use Git and a remote Github repo for version control. The important branches are:

- `main` - Production: contains the live deployed system on the public internet, must be stable and secure
- `dev` - Development: contains new features ready to go to production. This branch should be stable and work, but not as vitally as `main`
- `feature/*` - Features: work in progress on new feautures, used as a remote backup so can contain broken code
- `design` - Design branch: not part of the app, its simple static pages to prototype designs and components and colors. broken code and never pushed to other branches

Write short, concise commit messages. If there are a lot of changed in a single commit use a more generic message like "improving ui on recipe page".

NEVER MENTION CLAUDE IN COMMIT MESSAGES

**Path alias:** use `@/` for imports from `src/` (e.g. `import { prisma } from '@/lib/prisma'`)
