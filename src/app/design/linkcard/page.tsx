"use client";
import { ExternalLink, Globe, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background (kept from your original) */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl -z-10"
      />

      {/* Page container */}
      <div className="relative grid min-h-screen place-items-center p-6">
        {/* Card */}
        <article
          role="group"
          aria-label="Recipe link preview"
          className="w-full max-w-md rounded-2xl bg-white/85 shadow-xl ring-1 ring-black/5 backdrop-blur-md transition hover:shadow-2xl"
        >
          {/* Picture section (placeholder variant) */}
          <div className="relative h-40 overflow-hidden rounded-t-2xl">
            {/* playful placeholder background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,237,213,0.9),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(254,215,170,0.9),transparent_42%),radial-gradient(circle_at_30%_80%,rgba(253,186,116,0.75),transparent_45%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-200">
                <ImageIcon className="h-4 w-4" aria-hidden />
                <span>No photo available</span>
              </div>
            </div>
            {/* subtle top badge */}
            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-600/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              <LinkIcon className="h-3.5 w-3.5" aria-hidden />
              Link Card
            </div>
          </div>

          {/* Body */}
          <div className="space-y-3 p-4">
            {/* Site line */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 ring-1 ring-orange-200">
                <Globe className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="font-medium">New York Times</span>
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold leading-snug text-neutral-900">
              Crispy Chicken With Lime Butter
            </h1>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-neutral-600">
                Saved as a link preview. You can edit later.
              </p>
              <a
                href="#"
                aria-label="Open original recipe on New York Times"
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                Open
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </article>

        {/* Tiny foot hint */}
        <p className="mt-6 text-center text-xs text-white/80">
          This is the preview shown when an import falls back to a link card.
        </p>
      </div>
    </div>
  );
}
