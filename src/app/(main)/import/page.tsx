import { importRecipe } from "./actions";
import { SubmitButton } from "./SubmitButton";
import Link from "next/link";
import {
  ChefHat,
  Link2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * Import page — UI-only rework to match the provided layout:
 * - Header row with icon + title/subtitle
 * - Large floating panel under the navbar
 * - Single-line URL field with left icon and a big orange "Import" button
 * - Three feature cards underneath
 *
 * Back-end & action wiring unchanged.
 */
export default function ImportPage() {
  return (
    <div className="relative">
      {/* Floating panel under your navbar, on orange gradient background */}
      <div className="mx-auto w-[min(1100px,96%)] rounded-3xl bg-white/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur supports-[backdrop-filter]:bg-white/90 md:p-8">

        {/* Header */}
        <div className="mb-6 flex items-start gap-4 md:mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 shadow-sm">
            <ChefHat className="h-6 w-6" aria-hidden="true" />
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
          {/* Honeypot (bot trap) — keep name the same */}
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


          {/* Helper sentence below the field */}
          <p className="text-sm text-gray-600">
            If import works, your recipe is created instantly. If not, we’ll offer simple options.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoCard
              icon={<SparkIcon />}
              title="One-click import"
              desc="We grab the essentials fast — title, ingredients, steps, timings."
            />
            <InfoCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Respectful & safe"
              desc="Paywalls or robots? We won’t copy content — you’ll see a clean preview."
            />
            <InfoCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="You’re in control"
              desc="Save a link card, add manually, or discard. Simple and transparent."
            />
          </div>

          {/* Small back link (optional) */}
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

/** Small star/spark glyph that echoes your playful orange branding */
function SparkIcon() {
  return (
    <div className="relative">
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l1.9 4.7L18 8.6l-4.1 1.9L12 15l-1.9-4.5L6 8.6l4.1-1.9L12 2z" />
      </svg>
    </div>
  );
}

/** Reusable little card used for the three “pillars” under the field */
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
