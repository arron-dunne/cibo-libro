# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cibo Libro is a full-stack Next.js recipe management web application. It uses prisma for database, tailwind for css, playwright for system testing and vitest for integration and unit testing. The main features are user accounts which are created and logged in to. Users can save recipes manually with manual form, import from URLs (via JSON-LD parsing), or save handy link cards when importing fails (fetch errors, paywalled, domain on deny list etc). Recipes can be organized with tags. All a users recipes can be viewed in a grid of recipe cards. Users can and view recipes in a distraction-free cook mode which takes the users through the recipe step by step. The website theme is a playful but not cringey vibe, utilising a colored background with floating (shadowed) white panels containing page content. The user interface is best in class, and the user experience is perfect. It is optimised to work on both mobile and desktop (mobile first if a compromise is needed). Other recipe managing apps exists but the aim of Cibo Libro is to be the best of the lot. Currently we are working on the MVP. 

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test:unit    # Vitest unit tests
npm run test:int     # Vitest integration tests
```

**Database:**
```bash
npx prisma migrate dev     # Create/apply migrations (dev)
npx prisma migrate deploy  # Apply migrations (prod)
npx prisma generate        # Regenerate Prisma client
npx prisma studio          # Database GUI
```

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

Tests use Vitest with jsdom environment. Integration tests override to node environment.

```bash
# Run specific test file
npx vitest run src/test/unit/isSafeUrl.unit.test.ts

# Run tests matching pattern
npx vitest run -t "parseIsoDuration"

# Watch mode
npx vitest
```

## Path Aliases

Use `@/` for imports from `src/`:
```typescript
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';
```

## Branching

- `main` - Production
- `dev` - Staging/development
- `feature/*` - Work branches, PR to `dev`
