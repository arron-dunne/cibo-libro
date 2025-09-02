// app/(main)/import/page.tsx
/* 
  Cibo Libro — Importer Page (Design-only)
  - Purely presentational: no handlers, no backend calls
  - TailwindCSS for styling; lucide-react for icons (optional)
  - Friendly copy, subtle animations, and accessible markup
  - Drop this file into your route and adjust paths if needed
*/

import { ArrowRight, Link2, ShieldAlert, Cookie, Sparkles, CheckCircle2, BookOpenText } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-[100svh] bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Top banner */}
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-orange-500/90 text-white grid place-items-center shadow-lg shadow-orange-500/20">
            <ChefHatIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              Import a Recipe
            </h1>
            <p className="text-stone-600">
              Paste a link. We’ll do the heavy lifting. ✨
            </p>
          </div>
        </div>
      </section>

      {/* Import card */}
      <section className="mx-auto max-w-4xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-orange-200/60 bg-white shadow-xl shadow-orange-200/30">
          {/* Decorative corner */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-orange-100 to-transparent blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gradient-to-tr from-amber-100 to-transparent blur-2xl" />

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
            {/* Left: Form */}
            <div>
              <div className="mb-6 space-y-2">
                <label htmlFor="importUrl" className="block text-sm font-medium text-stone-700">
                  Recipe URL
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/70 p-2 pr-2 shadow-inner focus-within:ring-2 focus-within:ring-orange-300">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-stone-50 text-stone-500">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <input
                    id="importUrl"
                    name="importUrl"
                    type="url"
                    placeholder="e.g. https://example.com/your-favourite-lasagne"
                    className="w-full appearance-none rounded-xl border-0 bg-transparent px-1 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    aria-describedby="import-helptext"
                  />
                  <button
                    type="button"
                    className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-white font-semibold shadow-sm shadow-orange-500/30 transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400"
                    aria-label="Start import"
                  >
                    Import
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
                <p id="import-helptext" className="text-sm text-stone-500">
                  We’ll try to import the full recipe automatically. If we can’t, you’ll get friendly options.
                </p>
              </div>

              {/* How it works */}
              <ol className="mt-6 grid gap-4 sm:grid-cols-3">
                <Step
                  icon={<Sparkles className="h-5 w-5" />}
                  title="Auto-import"
                  desc="If the page has recipe schema, we’ll create it in a snap."
                />
                <Step
                  icon={<ShieldAlert className="h-5 w-5" />}
                  title="If blocked"
                  desc="Paywalls or robots? No stress — we’ll show a preview."
                />
                <Step
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  title="You choose"
                  desc="Import a link, add manually, or discard. Your call."
                />
              </ol>

              {/* Micro trust row */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1">
                  <Cookie className="h-3.5 w-3.5" />
                  No tracking on imported content
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1">
                  <BookOpenText className="h-3.5 w-3.5" />
                  Keep your recipes, your way
                </span>
              </div>
            </div>

            {/* Right: Illustration / Support panel */}
            <aside className="relative">
              <div className="rounded-2xl border border-stone-200/80 bg-gradient-to-b from-white to-stone-50 p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-100 text-orange-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-800">Tips for best results</h3>
                </div>
                <ul className="space-y-3 text-sm text-stone-600">
                  <li>Use the original recipe page, not a social media link.</li>
                  <li>Clean URLs work best (avoid “print” views or AMP versions).</li>
                  <li>If import is blocked, you’ll still get a quick preview screen.</li>
                </ul>

                {/* Supported sites badges (visual only) */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Often works great with:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Allrecipes", "BBC Good Food", "Bon Appétit", "Epicurious", "Serious Eats", "Sally’s Baking", "Feasting At Home"].map(
                      (name) => (
                        <span
                          key={name}
                          className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-700 shadow-sm"
                        >
                          {name}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Mascot */}
                <div className="mt-6">
                  <div className="mx-auto aspect-[4/3] w-full max-w-xs rounded-2xl border border-orange-200 bg-orange-50/60 p-4 shadow-inner">
                    <ChefMascot className="h-full w-full" />
                  </div>
                </div>
              </div>

              {/* Corner ribbon */}
              <div className="pointer-events-none absolute -right-2 -top-2 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 px-3 py-1 text-xs font-bold text-white shadow-md">
                New ✨
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ (native details/summary for no-JS accessibility) */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="mb-4 text-lg font-bold text-stone-900">Common questions</h2>
        <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
          <FAQ
            q="What happens if a site is paywalled or blocks importing?"
            a="We’ll show you a friendly preview screen with simple choices: import a link card (so you can find it later), add the recipe manually, or discard it."
          />
          <FAQ
            q="Will importing copy everything?"
            a="When possible, we pull the key bits: title, ingredients, steps, timings, yields, and images. Some sites limit what we can access, so results may vary."
          />
          <FAQ
            q="Can I edit the imported recipe?"
            a="Absolutely. After import, it’s yours to tweak—add notes, adjust steps, swap images, and save to collections."
          />
        </div>
      </section>
    </main>
  );
}

/* ---------- Small UI bits (presentational only) ---------- */

function Step({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li className="group relative rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
        <span className="grid h-5 w-5 place-items-center">{icon}</span>
        {title}
      </div>
      <p className="text-sm text-stone-600">{desc}</p>
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 mx-4 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-0 transition group-hover:opacity-100" />
    </li>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-medium text-stone-900">{q}</span>
        <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 p-1 text-stone-500 transition group-open:rotate-45">
          <PlusIcon className="h-4 w-4" />
        </span>
      </summary>
      <p className="mt-3 text-sm text-stone-600">{a}</p>
    </details>
  );
}

/* ---------- Icons (inline SVG for portability) ---------- */

function ChefHatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path
        d="M8 10c-2.8 0-3.5-3.8-.9-4.9A4 4 0 0 1 15 5c2.6.8 2.3 5-1 5h-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M7 10v6a2 2 0 0 0 2 2h6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 18h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChefMascot(props: React.SVGProps<SVGSVGElement>) {
  // Cute line-art chef with a spoon — friendly & brand-aligned; no external asset needed.
  return (
    <svg viewBox="0 0 160 120" fill="none" {...props} role="img" aria-label="Cibo Libro chef illustration">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#FDBA74" offset="0" />
          <stop stopColor="#FB923C" offset="1" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="140" height="100" rx="18" fill="url(#g)" opacity="0.12" />
      <circle cx="60" cy="56" r="20" stroke="#EA580C" strokeWidth="2.5" fill="white" />
      <path d="M42 90c5-10 31-10 36 0" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 54h4M64 54h4" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 63c4 4 12 4 16 0" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M48 40c0-8 24-8 24 0" stroke="#EA580C" strokeWidth="2.5" />
      {/* Hat */}
      <path d="M64 30c8 0 10-10 0-12-2-6-14-6-16 0-10 2-8 12 0 12h16Z" fill="white" stroke="#EA580C" strokeWidth="2.5" />
      {/* Spoon */}
      <path d="M110 36c8 0 12 6 12 12s-6 10-12 10-10-4-10-10 2-12 10-12Z" fill="white" stroke="#EA580C" strokeWidth="2.5" />
      <path d="M100 58l-6 26" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="93.5" cy="85" r="3" fill="#EA580C" />
      {/* Sparkles */}
      <path d="M132 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#FDBA74" opacity="0.7" />
      <path d="M22 28l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4L16 34l4-1.5 1.5-4Z" fill="#FDE68A" opacity="0.8" />
    </svg>
  );
}
