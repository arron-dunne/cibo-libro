// app/(main)/import/page.tsx
/* 
  Cibo Libro — Importer Page (Design-only, Draft 2)
  - Focus: the URL input as the hero element
  - Clear, friendly copy; playful brand accents
  - "How it works" cards simplified & tightened
  - Bottom "Discover sites" horizontal logo carousel (links only; static)
  - No functionality wired up — purely presentational
*/

export default function Page() {
  return (
    <main className="min-h-[100svh] bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-orange-500 text-white grid place-items-center shadow-lg shadow-orange-500/25">
            <ChefHatIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
              Import a Recipe
            </h1>
            <p className="text-stone-600">
              Paste a link. We’ll sort the rest — the friendly way.
            </p>
          </div>
        </div>
      </section>

      {/* Import Card */}
      <section className="mx-auto max-w-4xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-orange-200/60 bg-white shadow-xl shadow-orange-200/30">
          {/* soft glows */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-orange-100 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-tr from-amber-100 to-transparent blur-3xl" />

          <div className="p-6 sm:p-8">
            {/* Primary input zone */}
            <div className="mb-6 space-y-2">
              <label htmlFor="importUrl" className="block text-sm font-medium text-stone-700">
                Recipe URL
              </label>

              <div className="rounded-2xl border border-stone-200 bg-white/80 p-2 shadow-inner focus-within:ring-2 focus-within:ring-orange-300">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-3 py-2 text-stone-500 sm:w-44 sm:shrink-0">
                    <LinkIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Paste link</span>
                  </div>

                  <input
                    id="importUrl"
                    name="importUrl"
                    type="url"
                    placeholder="https://example.com/best-lasagne-ever"
                    className="w-full appearance-none rounded-xl border-0 bg-transparent px-3 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    aria-describedby="import-helptext"
                  />

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-white font-semibold shadow-sm shadow-orange-500/30 transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400 sm:w-auto"
                    aria-label="Start import"
                  >
                    Import
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p id="import-helptext" className="text-sm text-stone-500">
                If we can import it fully, you’ll get a new recipe instantly. If not, we’ll offer friendly options.
              </p>
            </div>

            {/* How it Works */}
            <div className="mt-8">
              <h2 className="sr-only">How importing works</h2>
              <ol className="grid gap-4 sm:grid-cols-3">
                <Step
                  badge="One-click import"
                  icon={<SparkleIcon className="h-5 w-5" />}
                  desc="When a page has recipe data, we pull title, ingredients, steps, time, and more in a snap."
                />
                <Step
                  badge="Respectful & safe"
                  icon={<ShieldIcon className="h-5 w-5" />}
                  desc="If a site is paywalled or blocks bots, we won't copy content — but we won’t leave you stuck."
                />
                <Step
                  badge="You’re in control"
                  icon={<CheckIcon className="h-5 w-5" />}
                  desc="Choose to save a link card, add manually, or discard. Simple, transparent, and quick."
                />
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Discover sites carousel */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">Discover great recipe sites</h3>
          <p className="text-xs text-stone-500">Tap a logo to explore</p>
        </div>

        <div className="relative">
          {/* gradient edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-orange-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-orange-50 to-transparent" />

          <div
            className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl border border-stone-200 bg-white p-3 shadow-sm"
            aria-label="Recipe sites carousel"
          >
            {SITES.map((site) => (
              <a
                key={site.name}
                href={site.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex snap-start items-center gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-2 shadow-sm hover:border-orange-300 hover:shadow-md"
                aria-label={`Open ${site.name} in a new tab`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700 ring-1 ring-orange-100">
                  {/* Simple monogram “logo” — keeps file self-contained */}
                  <span className="text-sm font-extrabold">{site.logo}</span>
                </span>
                <span className="text-sm font-medium text-stone-800">{site.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer microcopy */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <p className="text-center text-xs text-stone-500">
          Built with care by Cibo Libro — your playful, privacy-friendly cookbook.
        </p>
      </section>
    </main>
  );
}

/* ---------- Small UI bits (presentational only) ---------- */

function Step({
  badge,
  icon,
  desc,
}: {
  badge: string;
  icon: React.ReactNode;
  desc: string;
}) {
  return (
    <li className="group relative rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
        <span className="grid h-5 w-5 place-items-center">{icon}</span>
        {badge}
      </div>
      <p className="text-sm text-stone-600">{desc}</p>
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 mx-4 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-0 transition group-hover:opacity-100" />
    </li>
  );
}

/* ---------- Inline icons (portable) ---------- */

function ChefHatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M8 10c-2.8 0-3.5-3.8-.9-4.9A4 4 0 0 1 15 5c2.6.8 2.3 5-1 5h-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 10v6a2 2 0 0 0 2 2h6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 18h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M10 14a3 3 0 0 0 4 0l3-3a3 3 0 1 0-4-4l-.5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 10a3 3 0 0 0-4 0l-3 3a3 3 0 0 0 4 4l.5-.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} aria-hidden="true">
      <path d="M12 3l1.6 3.8L17 8.4l-3.4 1.6L12 14l-1.6-4-3.4-1.6 3.4-1.6L12 3Z" />
      <path d="M6 16l.8 1.8L8.6 19l-1.8.8L6 22l-.8-2.2L3 19l2.2-.8L6 16Z" />
      <path d="M18 15l.9 2 2.1.9-2.1.9L18 21l-.9-2.2L15 18l2.1-.9L18 15Z" />
    </svg>
  );
}
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M12 3l8 3v5c0 5-3.5 8.6-8 10-4.5-1.4-8-5-8-10V6l8-3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M20 7l-9 9-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Site data for the carousel (static) ---------- */

const SITES = [
  { name: "Allrecipes",       href: "https://www.allrecipes.com",        logo: "AR" },
  { name: "BBC Good Food",    href: "https://www.bbcgoodfood.com",       logo: "BB" },
  { name: "Bon Appétit",      href: "https://www.bonappetit.com",        logo: "BA" },
  { name: "Epicurious",       href: "https://www.epicurious.com",        logo: "E"  },
  { name: "Serious Eats",     href: "https://www.seriouseats.com",       logo: "SE" },
  { name: "Taste (AU)",       href: "https://www.taste.com.au",          logo: "T"  },
  { name: "Food52",           href: "https://food52.com",                logo: "F52"},
  { name: "Simply Recipes",   href: "https://www.simplyrecipes.com",     logo: "SR" },
  { name: "Sally’s Baking",   href: "https://sallysbakingaddiction.com", logo: "SB" },
  { name: "Feasting At Home", href: "https://www.feastingathome.com",    logo: "FAH"},
  { name: "Minimalist Baker", href: "https://minimalistbaker.com",       logo: "MB" },
  { name: "RecipeTin Eats",   href: "https://www.recipetineats.com",     logo: "RTE"},
  { name: "Delicious (AU)",   href: "https://www.delicious.com.au",      logo: "D"  },
  { name: "Cookie and Kate",  href: "https://cookieandkate.com",         logo: "C+K"},
];
