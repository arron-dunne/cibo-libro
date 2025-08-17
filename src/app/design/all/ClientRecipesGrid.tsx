"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  X,
  Clock,
  Flame,
  Users,
  Maximize2,
  Minimize2,
  Share2,
  Bookmark,
  Palette,
  UtensilsCrossed,
} from "lucide-react";

/* ---------- Types ---------- */
type Step = { text: string };
type ServeWithItem = string | { label: string; href?: string };

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  ingredients: string[];
  steps: Step[] | string[];
  notes?: string;
  serveWith?: ServeWithItem[];
  sourceUrl?: string | null;
};

/* ---------- Themes (CSS Variables) ---------- */
type ThemeKey = "citrus" | "emerald" | "blueberry" | "raspberry" | "lavender" | "ocean";

const THEMES: Record<
  ThemeKey,
  {
    label: string;
    bgFrom: string;
    bgVia: string;
    bgTo: string;
    accent: string;
    chipBg: string;
    chipBorder: string;
    chipInk: string;
    buttonBg: string;
    buttonBorder: string;
    buttonInk: string;
    buttonHoverBg: string;
  }
> = {
  citrus: {
    label: "Citrus Sunset",
    bgFrom: "#FB923C",
    bgVia: "#F97316",
    bgTo: "#F43F5E",
    accent: "#EA580C",
    chipBg: "#FFF7ED",
    chipBorder: "#FED7AA",
    chipInk: "#7C2D12",
    buttonBg: "#FFFFFF",
    buttonBorder: "#FED7AA",
    buttonInk: "#9A3412",
    buttonHoverBg: "#FFF7ED",
  },
  emerald: {
    label: "Emerald Tide",
    bgFrom: "#34D399",
    bgVia: "#10B981",
    bgTo: "#06B6D4",
    accent: "#10B981",
    chipBg: "#ECFDF5",
    chipBorder: "#A7F3D0",
    chipInk: "#064E3B",
    buttonBg: "#FFFFFF",
    buttonBorder: "#A7F3D0",
    buttonInk: "#065F46",
    buttonHoverBg: "#ECFDF5",
  },
  blueberry: {
    label: "Blueberry Frost",
    bgFrom: "#60A5FA",
    bgVia: "#6366F1",
    bgTo: "#3B82F6",
    accent: "#6366F1",
    chipBg: "#EEF2FF",
    chipBorder: "#C7D2FE",
    chipInk: "#312E81",
    buttonBg: "#FFFFFF",
    buttonBorder: "#C7D2FE",
    buttonInk: "#3730A3",
    buttonHoverBg: "#EEF2FF",
  },
  raspberry: {
    label: "Raspberry Sorbet",
    bgFrom: "#FB7185",
    bgVia: "#F43F5E",
    bgTo: "#EC4899",
    accent: "#E11D48",
    chipBg: "#FFF1F2",
    chipBorder: "#FECDD3",
    chipInk: "#881337",
    buttonBg: "#FFFFFF",
    buttonBorder: "#FECDD3",
    buttonInk: "#9F1239",
    buttonHoverBg: "#FFF1F2",
  },
  lavender: {
    label: "Lavender Haze",
    bgFrom: "#A78BFA",
    bgVia: "#8B5CF6",
    bgTo: "#A855F7",
    accent: "#8B5CF6",
    chipBg: "#F5F3FF",
    chipBorder: "#DDD6FE",
    chipInk: "#4C1D95",
    buttonBg: "#FFFFFF",
    buttonBorder: "#DDD6FE",
    buttonInk: "#6D28D9",
    buttonHoverBg: "#F5F3FF",
  },
  ocean: {
    label: "Ocean Night",
    bgFrom: "#22D3EE",
    bgVia: "#06B6D4",
    bgTo: "#1E3A8A",
    accent: "#0EA5A4",
    chipBg: "#F0FDFA",
    chipBorder: "#99F6E4",
    chipInk: "#134E4A",
    buttonBg: "#FFFFFF",
    buttonBorder: "#99F6E4",
    buttonInk: "#115E59",
    buttonHoverBg: "#F0FDFA",
  },
};

/* ---------- Controls ---------- */
const SORTS = [
  { key: "recent", label: "Recent (default)" },
  { key: "title-asc", label: "Title A–Z" },
  { key: "title-desc", label: "Title Z–A" },
  { key: "time-asc", label: "Total time ↑" },
  { key: "time-desc", label: "Total time ↓" },
] as const;

const TIME_FILTERS = [
  { key: "any", label: "Any time", test: (_: number) => true },
  { key: "t15", label: "≤ 15m", test: (t: number) => t <= 15 },
  { key: "t30", label: "≤ 30m", test: (t: number) => t <= 30 },
  { key: "t45", label: "≤ 45m", test: (t: number) => t <= 45 },
  { key: "t60", label: "≤ 60m", test: (t: number) => t <= 60 },
  { key: "gt60", label: "> 60m", test: (t: number) => t > 60 },
] as const;

/* ---------- Component ---------- */
export default function ClientRecipesGrid({ recipes }: { recipes: Recipe[] }) {
  const [theme, setTheme] = useState<ThemeKey>("citrus");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("recent");
  const [timeKey, setTimeKey] = useState<(typeof TIME_FILTERS)[number]["key"]>("any");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const allTags = useMemo(() => {
    const s = new Set<string>();
    recipes?.forEach((r) => r.tags?.forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [recipes]);

  const styleVars = useMemo((): CSSProperties => {
    const t = THEMES[theme];
    return {
      ["--bg-from" as any]: t.bgFrom,
      ["--bg-via" as any]: t.bgVia,
      ["--bg-to" as any]: t.bgTo,
      ["--accent" as any]: t.accent,
      ["--chip-bg" as any]: t.chipBg,
      ["--chip-border" as any]: t.chipBorder,
      ["--chip-ink" as any]: t.chipInk,
      ["--button-bg" as any]: t.buttonBg,
      ["--button-border" as any]: t.buttonBorder,
      ["--button-ink" as any]: t.buttonInk,
      ["--button-hover-bg" as any]: t.buttonHoverBg,
    };
  }, [theme]);

  const filtered = useMemo(() => {
    const timeTest = TIME_FILTERS.find((t) => t.key === timeKey)?.test ?? (() => true);
    let list = (recipes || []).filter((r) => {
      const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase());
      const matchesTime = timeTest(r.totalMinutes);
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => r.tags?.includes(t));
      return matchesQuery && matchesTime && matchesTags;
    });
    switch (sort) {
      case "title-asc":
        list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        list = list.slice().sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "time-asc":
        list = list.slice().sort((a, b) => a.totalMinutes - b.totalMinutes);
        break;
      case "time-desc":
        list = list.slice().sort((a, b) => b.totalMinutes - a.totalMinutes);
        break;
      case "recent":
      default:
        break;
    }
    return list;
  }, [recipes, query, sort, timeKey, activeTags]);

  const clearFilters = () => {
    setActiveTags([]);
    setTimeKey("any");
    setSort("recent");
    setQuery("");
  };

  return (
    <div style={styleVars} className="relative min-h-dvh text-slate-900">
      {/* FIXED, NON-SCROLLING BACKGROUND */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-[var(--bg-from)] via-[var(--bg-via)] to-[var(--bg-to)]"
      />

      {/* Sticky toolbar */}
      <div className="sticky top-4 z-40">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-3 rounded-full border border-white/30 bg-white/80 px-3 py-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/70">
            {/* Brand dot */}
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-white shadow">
              🍊
            </div>

            {/* Search */}
            <div className="mx-1 flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-[var(--chip-border)] bg-white px-3 py-1.5">
              <Search className="h-4 w-4 text-[var(--accent)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes by title…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 rounded-full border border-[var(--chip-border)] bg-white px-3 py-1.5 text-sm">
              <span className="font-semibold">Sort</span>
              <ChevronDown className="h-4 w-4 opacity-60" />
              <select
                className="bg-transparent outline-none"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time filter */}
            <div className="flex items-center gap-2 rounded-full border border-[var(--chip-border)] bg-white px-3 py-1.5 text-sm">
              <Filter className="h-4 w-4 opacity-60" />
              <select
                className="bg-transparent outline-none"
                value={timeKey}
                onChange={(e) => setTimeKey(e.target.value as any)}
              >
                {TIME_FILTERS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag chips */}
            <div className="flex flex-wrap items-center gap-2 px-1">
              {allTags.map((tag) => {
                const on = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      )
                    }
                    className={
                      "rounded-full border px-3 py-1 text-xs font-semibold transition " +
                      (on
                        ? "border-[var(--accent)] bg-[var(--chip-bg)] text-[var(--button-ink)]"
                        : "border-[var(--chip-border)] bg-white text-slate-700 hover:border-[var(--accent)]")
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Theme selector */}
            <div className="ml-auto flex items-center gap-2 rounded-full border border-[var(--chip-border)] bg-white px-3 py-1.5 text-sm">
              <Palette className="h-4 w-4 text-[var(--accent)]" />
              <select
                className="bg-transparent outline-none"
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeKey)}
                title="Theme"
              >
                {Object.entries(THEMES).map(([key, v]) => (
                  <option key={key} value={key}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear */}
            {(activeTags.length || timeKey !== "any" || query || sort !== "recent") && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--chip-border)] bg-[var(--button-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--button-ink)] hover:bg-[var(--button-hover-bg)]"
                title="Clear filters"
              >
                <X className="h-4 w-4" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <section
          className="
            grid grid-cols-1 gap-4
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            auto-rows-[1fr]
          "
        >
          {filtered.map((r) => {
            const isOpen = !!expanded[r.id];
            return (
              <article
                key={r.id}
                className={
                  "group relative overflow-hidden rounded-3xl border border-white/40 bg-white shadow-xl transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-2xl " +
                  (isOpen ? "sm:col-span-2 sm:row-span-2" : "")
                }
              >
                {/* Image */}
                <div className={"relative w-full " + (isOpen ? "h-64" : "h-40")}>
                  <Image
                    src={
                      r.imageUrl ||
                      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=1471&auto=format&fit=crop"
                    }
                    alt={r.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/0" />
                </div>

                {/* Content */}
                <div className="space-y-3 p-4">
                  <h3 className="text-lg font-extrabold leading-tight">
                    <Link
                      href={`/recipes/${r.id}`}
                      className="outline-none transition hover:opacity-90 focus:opacity-90"
                    >
                      {r.title}
                    </Link>
                  </h3>

                  {/* Tags */}
                  {!!r.tags?.length && (
                    <div className="flex flex-wrap gap-2">
                      {r.tags!.slice(0, isOpen ? 6 : 3).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-border)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--chip-ink)]"
                        >
                          {emojiFor(t)} {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p className={"text-sm text-slate-600 " + (isOpen ? "" : "line-clamp-2")}>
                    {r.description}
                  </p>

                  {/* Extra meta (only when expanded) */}
                  {isOpen && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Chip icon={<Clock className="h-4 w-4" />} label="Prep" value={`${r.prepMinutes}m`} />
                      <Chip icon={<Flame className="h-4 w-4" />} label="Cook" value={`${r.cookMinutes}m`} />
                      <Chip icon={<Clock className="h-4 w-4" />} label="Total" value={`${r.totalMinutes}m`} />
                      <Chip icon={<Users className="h-4 w-4" />} label="Serves" value={`${r.servings}`} />
                      <Chip icon={<Bookmark className="h-4 w-4" />} label="Saved" value="—" />
                      <Chip icon={<Share2 className="h-4 w-4" />} label="Share" value="link" />
                    </div>
                  )}
                </div>

                {/* Bottom-right expand button */}
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={() => setExpanded((m) => ({ ...m, [r.id]: !m[r.id] }))}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--button-border)] bg-[var(--button-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--button-ink)] shadow hover:bg-[var(--button-hover-bg)]"
                    title={isOpen ? "Collapse" : "Expand"}
                  >
                    {isOpen ? (
                      <Minimize2 className="h-4 w-4 text-[var(--accent)]" />
                    ) : (
                      <Maximize2 className="h-4 w-4 text-[var(--accent)]" />
                    )}
                    {isOpen ? "Collapse" : "Expand"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/30 bg-white/10 py-8 text-white backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-[var(--accent)]">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div className="font-fun text-lg font-extrabold text-white">Cookbook Hub</div>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link className="hover:underline" href="/legal/content-policy">
              Content Policy
            </Link>
            <Link className="hover:underline" href="/legal/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:underline" href="/support">
              Support
            </Link>
            <Link className="hover:underline" href="/contact">
              Contact
            </Link>
          </nav>
          <div className="text-xs/6 opacity-80">
            © {new Date().getFullYear()} Cookbook Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- UI Bits ---------- */
function Chip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-full border border-[var(--chip-border)] bg-[var(--chip-bg)] px-2.5 py-1 text-[11px] font-semibold">
      <span className="text-[var(--accent)]">{icon}</span>
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}

function emojiFor(tag: string) {
  const t = tag?.toLowerCase?.() ?? "";
  if (t.includes("pasta")) return "🍝";
  if (t.includes("italian")) return "🇮🇹";
  if (t.includes("quick")) return "⚡";
  if (t.includes("comfort")) return "🥣";
  if (t.includes("chicken")) return "🍗";
  if (t.includes("salad")) return "🥗";
  if (t.includes("soup")) return "🥣";
  if (t.includes("dessert")) return "🍰";
  return "🏷️";
}
