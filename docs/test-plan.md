# Test Plan
---------------------
### Purpose of Testing

* **Confidence**: ensure new changes don’t break existing piece of the app
* **Speed**: catch regressions locally and in CI before deploys.
* **User value**: the core “happy paths” always work

------------
## Test Types

### Unit tests
* Scope: pure functions, validation schemas, small utilities (slugging, tag parsing, filters).
* Goal: high signal, run locally and before every pull request in CI.
* Tooling: vitest
* Examples: isSafeUrl, uniqueSlug, parseIsoDurationMinutes

### Component tests
* Scope: React components with rendered output, state/props, form fields, no external systems (database, R2 buckets)
* Goal: high signal, run locally and before every pull request in CI.
* Tools: vitest
* Examples: LoginPage, SupportPage, HomePage
  
### Integration tests
* Scope: server actions / route handlers which use external libraries, multiple helper functions;
* Goal: verify larger programs with many pieces work together, run before every pull request
* Tools: vitest
* Examples: parseJsonLd, saveLinkCard, importRecipe

### **End‑to‑end (E2E) tests
* Scope: real browser with page rendering, user interactions corrected to a test database (R2 handling to be decided)
- Goal: verify real user experience works through the browser. Larger test suite run incrementally on key branches
- Tools: playwright
- Examples: user login/logout, importing recipes, submitting bug reports, filtering/searching recipe on all recipes pages

### Smoke tests
- Scope: a smaller subset of E2E tests which test the core user paths
- Goal: Run before every pull request. Catch any breaking changes quickly
- Tools: playwright
* Examples: user login/logout, manually adding recipe, importing recipes

### Snapshot tests
- Scope: check the UI appears correctly for mobile and desktop
- Goal: Run with E2E testing and catch any changes to UI layout
- Tools: playwright

### Non-functional checks
* **Accessibility**: axe checks on key pages (manual add, recipe view, grid).
* **Performance**: basic LCP-ish guard via Playwright trace + a Lighthouse snapshot on the recipe page (budget: images lazy-load, no layout shift).
* **Security**: authz checks (can’t view another user’s private recipe), basic CSP headers exist, forms reject invalid inputs.

--------------
