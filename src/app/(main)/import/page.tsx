import { importRecipe } from "./actions";
import { UrlInput } from "./UrlInput";
import { Download, ShieldCheck, Zap, StickyNote, ClipboardPaste } from "lucide-react";

export default function ImportPage() {
  return (
    <div className="max-w-4xl w-full mx-auto mt-8 p-6 sm:p-8 rounded-3xl border border-white/70 bg-white/95 backdrop-blur shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-start gap-6 md:mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-500">
          <Download size={36} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            Import a recipe
          </h1>
          <p className="mt-2 text-[15px] text-gray-700">
            Paste a link to add it to your personal cookbook
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
        <UrlInput />
        

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
      </form>
    </div>
  )
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
