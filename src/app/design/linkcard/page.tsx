"use client";
import {
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const TITLE = "Crispy Chicken With Lime Butter";
const SITE = "New York Times";
const HREF = "#"; // replace with original URL

function PhotoPlaceholder({ className = "", label = "No photo available" }: { className?: string; label?: string }) {
  return (
    <div className={`relative ${className}`} aria-label="Image placeholder">
      {/* playful orange blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,237,213,0.9),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(254,215,170,0.9),transparent_42%),radial-gradient(circle_at_30%_80%,rgba(253,186,116,0.75),transparent_45%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-200 shadow-sm">
          <ImageIcon className="h-4 w-4" aria-hidden />
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}

function SitePill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-medium text-orange-700 ring-1 ring-orange-200">
      <Globe className="h-3.5 w-3.5" aria-hidden />
      {SITE}
    </span>
  );
}

function OpenButton({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href={HREF}
      aria-label={`Open original recipe on ${SITE}`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white font-medium text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
        compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      Open
      <ExternalLink className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
    </a>
  );
}

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
      <div aria-hidden className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl -z-10" />

      <div className="relative mx-auto grid max-w-3xl gap-8 px-6 py-10">
        {/* Heading */}
        <header className="text-center text-white">
          <h1 className="inline-flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-5 w-5" /> Link Card Variations
          </h1>
          <p className="mt-1 text-white/85 text-sm">Five small, playful treatments for the importer fallback preview.</p>
        </header>

        {/* ── Variant A: Original (image on top) ─────────────────────────────── */}
        <article
          data-testid="link-card-variant-a"
          role="group"
          aria-label="Recipe link preview variant A"
          className="w-full max-w-md justify-self-center rounded-2xl bg-white/85 shadow-xl ring-1 ring-black/5 backdrop-blur-md transition hover:shadow-2xl"
        >
          {/* Picture section (placeholder) */}
          <div className="relative h-40 overflow-hidden rounded-t-2xl">
            <PhotoPlaceholder className="h-full w-full" />
            {/* top-left chip */}
            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-600/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              <LinkIcon className="h-3.5 w-3.5" aria-hidden />
              Link Card
            </div>
          </div>
          {/* Body */}
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <SitePill />
            </div>
            <h2 className="text-xl font-semibold leading-snug text-neutral-900">{TITLE}</h2>
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-neutral-600">Saved as a link preview. You can edit later.</p>
              <OpenButton />
            </div>
          </div>
        </article>

        {/* ── Variant B: Side-by-side (image left, text right) ──────────────── */}
        <article
          data-testid="link-card-variant-b"
          role="group"
          aria-label="Recipe link preview variant B"
          className="w-full max-w-2xl justify-self-center overflow-hidden rounded-2xl bg-white/85 shadow-xl ring-1 ring-black/5 backdrop-blur-md transition hover:shadow-2xl"
        >
          <div className="flex">
            <div className="relative hidden h-36 w-44 shrink-0 overflow-hidden rounded-l-2xl sm:block">
              <PhotoPlaceholder className="h-full w-full" />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-4 p-4">
              <div className="flex-1">
                <div className="mb-1"><SitePill /></div>
                <h2 className="truncate text-lg font-semibold text-neutral-900">{TITLE}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">Quick link preview. Clean and compact for lists.</p>
              </div>
              <OpenButton />
            </div>
          </div>
        </article>

        {/* ── Variant C: Compact Row (thumbnail + text inline) ─────────────── */}
        <article
          data-testid="link-card-variant-c"
          role="group"
          aria-label="Recipe link preview variant C"
          className="w-full max-w-2xl justify-self-center rounded-xl border border-white/50 bg-white/75 shadow-md backdrop-blur-md transition hover:shadow-lg"
        >
          <div className="flex items-center gap-3 p-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-lg ring-1 ring-orange-200">
              <PhotoPlaceholder className="h-full w-full" label="No image" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <SitePill />
              </div>
              <h2 className="truncate text-base font-semibold text-neutral-900">{TITLE}</h2>
            </div>
            <OpenButton compact />
          </div>
        </article>

        {/* ── Variant D: Image-forward with overlay text ───────────────────── */}
        <article
          data-testid="link-card-variant-d"
          role="group"
          aria-label="Recipe link preview variant D"
          className="w-full max-w-md justify-self-center overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 transition hover:shadow-2xl"
        >
          <div className="relative h-44 overflow-hidden">
            <PhotoPlaceholder className="h-full w-full" />
            {/* gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
              <div>
                <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-orange-700 ring-1 ring-orange-200">
                  <Globe className="h-3 w-3" aria-hidden /> {SITE}
                </div>
                <h2 className="max-w-[16rem] text-lg font-semibold leading-tight text-white drop-shadow">{TITLE}</h2>
              </div>
              <a
                href={HREF}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow-md ring-1 ring-neutral-200 hover:bg-white"
                aria-label={`Open ${SITE}`}
              >
                Open <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </article>

        {/* ── Variant E: Accent stripe + badge (distinct layout) ───────────── */}
        <article
          data-testid="link-card-variant-e"
          role="group"
          aria-label="Recipe link preview variant E"
          className="w-full max-w-md justify-self-center overflow-hidden rounded-2xl bg-white/85 shadow-xl ring-1 ring-black/5 backdrop-blur-md transition hover:shadow-2xl"
        >
          {/* Accent stripe */}
          <div className="h-1.5 w-full bg-[linear-gradient(90deg,theme(colors.orange.500),theme(colors.rose.500))]" />
          <div className="flex items-start gap-3 p-4">
            <div className="relative hidden h-16 w-20 overflow-hidden rounded-lg sm:block">
              <PhotoPlaceholder className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2"><SitePill /></div>
              <h2 className="line-clamp-2 text-lg font-semibold text-neutral-900">{TITLE}</h2>
              <div className="mt-2">
                <a
                  href={HREF}
                  className="inline-flex items-center gap-1 text-sm font-medium text-orange-700 underline decoration-orange-300 underline-offset-4 hover:text-orange-800"
                >
                  View original <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Footnote */}
        <p className="pt-2 text-center text-xs text-white/85">
          These are static samples for the importer fallback preview. Swap the placeholder with a real image via <code>object-cover</code> thumbnail when available.
        </p>
      </div>
    </div>
  );
}
