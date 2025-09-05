import { importRecipe } from "./actions";
import { SubmitButton } from "./SubmitButton";
import Link from "next/link";
import { Download, Link2, ShieldCheck, Zap, StickyNote } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * Import page — UI with floating panel, pill input, feature cards.
 * Header icon now uses Download with orange background.
 */
export default function ImportPage() {
  return (
    <div className="relative">
      {/* Spotlight glow behind the panel for premium depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-72 w-[min(1150px,96%)] rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45),rgba(255,255,255,0)_60%)]"
      />

      {/* Floating panel under navbar */}
      <div className="relative mx-auto w-[min(1100px,96%)] rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.16)] backdrop-blur supports-[backdrop-filter]:bg-white/90 md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start gap-4 md:mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
            <Download className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              Import a Recipe
            </h1>
            <p className="mt-2 text-[15px] text-gray-700">
              Paste a link. We’ll do the rest.
            </p>
          </div>
        </div>

        {/* Form */}
        <form action={importRecipe} className="space-y-5">
          {/* Honeypot (bot trap) */}
          <div aria-hidden="true" className="hidden">
            <label className="block">
              Leave this empty:
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {/* URL field with pill layout */}
          <div className="w-full">
            <div className="flex w-full items-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-orange-400">
              <input
                id="url"
                name="url"
                type="url"
                required
                inputMode="url"
                placeholder="Paste a recipe link"
                pattern="https?://.+"
                autoFocus
                maxLength={2000}
                className="flex-1 border-0 bg-transparent px-5 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="m-1 inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-700 active:translate-y-px"
              >
                Import
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Example: <code>https://example.com/best-lasagne-ever</code>
            </p>
          </div>

          {/* Helper sentence */}
          <p className="text-sm text-gray-600">
            If import works, your recipe is created instantly. If not, we’ll offer simple options.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoCard
              icon={<Zap className="h-5 w-5" />}
              title="Import in one click"
              desc="Paste a recipe link and we’ll grab the essentials—title, ingredients, steps, and timings—straight into your cookbook."
            />
            <InfoCard
              icon={<StickyNote className="h-5 w-5" />}
              title="No recipe? No problem"
              desc="If a site won’t share, we’ll save a handy card with the title and link so you can always find it again."
            />
            <InfoCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="We play nice"
              desc="We follow the rules—no paywall dodging or sneaky scraping. Everything stays tidy, safe, and fair."
            />
          </div>

          {/* Small back link */}
          <div className="pt-1">
            <Link
              href="/recipes"
              className="text-sm font-medium text-orange-800 underline-offset-4 hover:underline"
            >
              Back to recipes
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Reusable little card under the field */
function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-orange-100/60 bg-white p-4 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-700 ring-1 ring-orange-200">
          {icon}
        </span>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
      </div>
      <p className="text-sm leading-6 text-gray-700">{desc}</p>
    </div>
  );
}
