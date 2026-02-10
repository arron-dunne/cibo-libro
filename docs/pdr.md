**Product Name:** Cibo Libro
**Version:** MVP (Prototype)

---

## 1. Purpose

Create a beautiful, mobile-first digital cookbook that lets users save recipes from anywhere (manual, links, imports), view them in a clean “cook mode,” and organize with tags. MVP focuses on **private utility** and sets the foundation for future public/creator features.

---

## 2. Target Users

- **Home cooks** who want all their recipes in one place.
- **Blog readers** who want clean versions of recipes without fluff.
- **Early adopters** who care about design and simplicity.

---

## 3. Goals

- Provide frictionless recipe capture (manual + URL import).
- Ensure recipes look beautiful in card/grid and cook mode.
- Establish trust with users (export, data ownership, privacy).
- Lay legal groundwork (copyright compliance, takedown policy).

---

## 4. Non-Goals

- No shopping lists or pantry management in MVP.
- No public/community/social feed.
- No monetization in MVP.

---

## 5. Success Metrics

- ≥70% of new users add ≥3 recipes in week 1.
- ≥40% weekly active return (measured via Cook Mode or recipe views).
- 90%+ importer success on top 50 food blogs (with fallback to link card).

---

## 6. Features (MVP Scope)

- **Accounts/Auth**: secure login (email/password).
- **Recipe Management**: manual add form, link import, fallback to link card.
- **Library**: card-based grid, tag system, search/filter.
- **Cook Mode**: step-by-step with large text, inline timers, wake lock.
- **Export**: JSON/CSV export.
- **Public Recipes (owned only)**: optional public card page + shareable URL.
- **Compliance & Guardrails**: report abuse button, DMCA/takedown workflow, terms/privacy, copyright notice.

---

## 7. Technical Requirements

- **Stack**: Next.js (App Router, TS), Tailwind + shadcn, Postgres (Prisma), Auth.js, S3/R2 for images.
- **Importer**: JSON-LD / Microdata parser, fallback to OpenGraph metadata.
- **Performance**: <2.5s LCP on 4G.
- **Accessibility**: keyboard navigation, AA contrast, reduced motion support.

---

## 8. Risks

- Importer accuracy (blogs may change markup).
- Scope creep (shopping lists, OCR too early).
- Legal exposure (mitigated with copyright guardrails).

---

## 9. Launch Plan

- Beta test with 20–50 cooks (friends, forums).
- Collect feedback on import reliability + cook mode.
- Iterate before Release 1 (shopping brain, creator tools).
