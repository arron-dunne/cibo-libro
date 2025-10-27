# 🛣️ Product Roadmap

---

## **Phase 1: Prototype / MVP (Foundation + First Users)**

🎯 Goal: **Prove utility**. Let users save and cook recipes beautifully. Collect feedback.

**Core Features**

* **Recipe storage** (two types):

  * User-owned recipes (manual entry, basic form).
  * External link recipes (stored as cards with metadata + “View Original”).
* **Importer MVP**:

  * Paste URL → parse JSON-LD / Microdata if available.
  * Fallback = title + image + link only.
* **Library UI**:

  * Tag system (“Dinner,” “Vegan,” “Chicken”).
  * Search + basic filters.
  * Card-based design (beautiful images + minimal metadata).
* **Cook Mode**:

  * Step-by-step, large font, inline timers.
  * Wake-lock so screen doesn’t dim.
* **Accounts + Sync**:

  * Email/password login.
  * Data tied to user account.
* **Data export**:

  * JSON/CSV export (trust + ownership).

**Polish**

* Magazine-grade design.
* Mobile-first PWA (works offline in cook mode).

✅ Output: “The most beautiful personal cookbook app,” lean but lovable.

---

## **Phase 2: Release 1 (Wow Features / User Growth)**

🎯 Goal: **Make people fall in love**. Go from useful → indispensable.

**Major Features**

* **Importer V2**:

  * OCR image uploads (from books, screenshots).
  * More robust parsing for blogs.
* **Recipe Inbox flow**:

  * New imports land in Inbox for cleanup + tagging.
  * Auto-tagging suggestions (NLP).
* **Shopping Brain V1**:

  * Add recipes → one shopping list.
  * Ingredient dedupe & normalization.
  * Scale servings, US/metric conversion.
  * Group items by aisle (Produce, Dairy, Pantry).
* **Public Recipes (owned only)**:

  * Users can publish their own recipes.
  * Public card pages with shareable link.
  * Attribution / source badge.
  * “Save to My Cookbook” for others.
* **Creator Mode (opt-in)**:

  * Schema-based import for their sites.
  * Embeddable recipe cards that link back.
  * Canonical links respected.

* **Themes**

  * Choose from multiple beatutiful color themes
  * Dark theme toggleable

* **OAuth**
  * login with Google and Apple (reduce signup friction)

**Polish**

* Saved filter views (“15-min vegetarian dinners”).
* Smooth card transitions + playful animations.

✅ Output: *Not just a utility, but a product people show off to friends.*

---

## **Phase 3: Release 2 (Monetization + Premium Depth)**

🎯 Goal: **Start earning revenue**, add advanced power features.

**Pro Features (Subscription tier)**

* **Advanced shopping lists**:

  * Multiple lists.
  * Weekly planning view.
  * Export as PDF/CSV/Markdown.
* **Advanced import tools**:

  * OCR batch import.
  * Handle “difficult” sites.
* **Pantry & Leftovers Lite**:

  * Quick pantry list.
  * “Cook with what I have” filter.
  * Leftover tracker (“good until Friday”).
* **Print-to-Cookbook**:

  * Export recipes into a styled PDF.
  * Print-on-demand integration (Blurb/Lulu).
  * Only user-owned recipes (blog imports show as link cards in print).
* **Family sharing**:

  * Invite members to one cookbook.
  * Shared lists + recipes.

**Free Tier Improvements**

* Unlimited private saving.
* Core importer & Cook Mode remain free.

✅ Output: revenue + household utility. Users can “live in” your app.

---

## **Phase 4: Future Releases (Open Horizon)**

🎯 Goal: **Expand into lifestyle ecosystem / gamify cooking**.

**Exploratory Features**

* **Cooking Courses**:

  * Partner with creators for premium video/step-by-step guides.
  * Monetizable add-ons.
* **Gamification**:

  * Duolingo-style badges (e.g., “Cooked 5 veg dinners this week”).
  * Streaks + challenges.
* **AI features** (careful, value-driven):

  * Smart substitutions (“no butter → try olive oil”).
  * Recipe summarization.
  * Pantry → “3 recipes you can cook tonight.”
* **Meal planning calendar**:

  * Week view with drag-and-drop recipes.
* **Nutrition tracking**:

  * Auto-estimate macros + calories from recipe data.
  * Nutrient and vitamin estimates, alert for low / missing 
* **Integration ecosystem**:

  * Export lists to grocery delivery APIs.
  * Smart speaker integration (voice cook mode).

✅ Output: evolves from “digital cookbook” → **full cooking companion ecosystem**.

---

# 🔑 Summary Table

| Phase             | Focus                 | Features                                                                                              |
| ----------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Prototype/MVP** | Foundation + feedback | Manual & link recipes, basic importer, tags, search, Cook Mode, accounts, export                      |
| **Release 1**     | User delight          | Importer v2 (OCR), Recipe Inbox, Shopping Brain v1, Public recipes (owned), Creator mode, saved views |
| **Release 2**     | Monetization          | Pro tier, advanced lists, Pantry & leftovers, Print cookbook export, family sharing                   |
| **Future**        | Expansion             | Courses, gamification, AI, meal planning, nutrition, integrations                                     |