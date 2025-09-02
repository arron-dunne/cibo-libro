// app/(main)/import/page.tsx
// Cibo Libro — Importer Page (Design-only, Draft 3)
// - Uses lucide-react icons
// - Logo carousel with next/image; fill SITES[].logoSrc when ready
// - No functionality wired up; purely UI/UX
// - TailwindCSS assumed

"use client";

import Image from "next/image";
import {
    ArrowRight,
    Link2,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    ChefHat,
} from "lucide-react";
import * as React from "react";

export default function Page() {
    return (
        <main className="min-h-[100svh] bg-gradient-to-br from-orange-50 via-white to-amber-50">
            {/* Header */}
            <section className="mx-auto max-w-4xl px-4 pt-12 pb-6">
                <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
                        <ChefHat className="h-6 w-6" />
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

            {/* Import Card (hero input focus) */}
            <section className="mx-auto max-w-4xl px-4">
                <div className="relative overflow-hidden rounded-3xl border border-orange-200/60 bg-white shadow-xl shadow-orange-200/30">
                    {/* soft glows */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-orange-100 to-transparent blur-3xl" />
                    <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-tr from-amber-100 to-transparent blur-3xl" />

                    <div className="p-6 sm:p-8">
                        {/* Primary input zone */}
                        <div className="mb-6 space-y-2">
                            <label
                                htmlFor="importUrl"
                                className="block text-sm font-medium text-stone-700"
                            >
                                Recipe URL
                            </label>

                            <div className="rounded-2xl border border-stone-200 bg-white/80 p-2 shadow-inner focus-within:ring-2 focus-within:ring-orange-300">
                                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                    <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-3 py-2 text-stone-500 sm:w-44 sm:shrink-0">
                                        <Link2 className="h-5 w-5" />
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
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <p id="import-helptext" className="text-sm text-stone-500">
                                If we can import it fully, you’ll get a new recipe instantly. If
                                not, we’ll offer friendly options.
                            </p>
                        </div>

                        {/* How it works — concise + value-forward */}
                        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
                            <Step
                                icon={<Sparkles className="h-5 w-5" />}
                                badge="One-click import"
                                desc="When a page includes recipe data, we pull the essentials — title, ingredients, steps, and timings — in a snap."
                            />
                            <Step
                                icon={<ShieldCheck className="h-5 w-5" />}
                                badge="Respectful & safe"
                                desc="If a site blocks bots or is paywalled, we won’t copy content. You’ll still get a clean preview."
                            />
                            <Step
                                icon={<CheckCircle2 className="h-5 w-5" />}
                                badge="You’re in control"
                                desc="Choose to save a link card, add manually, or discard. Simple, transparent, and quick."
                            />
                        </ol>
                    </div>
                </div>
            </section>

            {/* Discover Sites Carousel */}
            <section className="mx-auto max-w-5xl px-4 py-10">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-bold text-stone-900">
                        Discover great recipe sites
                    </h2>
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
                                className="group inline-flex snap-start items-center gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-2 shadow-sm transition hover:border-orange-300 hover:shadow-md"
                                aria-label={`Open ${site.name} in a new tab`}
                            >
                                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-orange-50 ring-1 ring-orange-100">
                                    {site.logoSrc ? (
                                        <img
                                            src={site.logoSrc}
                                            alt={`${site.name} logo`}
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <span className="text-xs font-extrabold text-orange-700">
                                            {monogram(site.name)}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-stone-800">
                                    {site.name}
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* Subtle disclaimer */}
                    <p className="mt-2 px-1 text-center text-[11px] text-stone-500">
                        Cibo Libro is not affiliated with or endorsed by these sites.
                    </p>
                </div>
            </section>

            {/* Footer microcopy */}
            <section className="mx-auto max-w-4xl px-4 pb-16">
                <p className="text-center text-xs text-stone-500">
                    Built with care by Cibo Libro — your playful, privacy-friendly
                    cookbook.
                </p>
            </section>
        </main>
    );
}

/* ---------- Small presentational bits ---------- */

function Step({
    icon,
    badge,
    desc,
}: {
    icon: React.ReactNode;
    badge: string;
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

/* ---------- Data & helpers ---------- */

type Site = { name: string; href: string; logoSrc: string };
const SITES: Site[] = [
    { name: "Allrecipes", href: "https://www.allrecipes.com", logoSrc: "https://seekvectorlogo.com/wp-content/uploads/2021/12/allrecipes-vector-logo-2021.png" },
    { name: "BBC Good Food", href: "https://www.bbcgoodfood.com", logoSrc: "https://images.immediate.co.uk/production/volatile/sites/30/2024/03/cropped-GF-new-teal-1-7004649-a80b70d.png" },
    { name: "Bon Appétit", href: "https://www.bonappetit.com", logoSrc: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Bon_App%C3%A9tit_logo.svg" },
    { name: "Epicurious", href: "https://www.epicurious.com", logoSrc: "https://www.epicurious.com/verso/static/epicurious-us/assets/logo.svg" },
    { name: "Serious Eats", href: "https://www.seriouseats.com", logoSrc: "https://images.seeklogo.com/logo-png/40/2/serious-eats-logo-png_seeklogo-408125.png" },
    { name: "Taste (AU)", href: "https://www.taste.com.au", logoSrc: "" },
    { name: "Food52", href: "https://food52.com", logoSrc: "" },
    { name: "Simply Recipes", href: "https://www.simplyrecipes.com", logoSrc: "" },
    {
        name: "Sally’s Baking Addiction",
        href: "https://sallysbakingaddiction.com",
        logoSrc: "",
    },
    {
        name: "Feasting At Home",
        href: "https://www.feastingathome.com",
        logoSrc: "",
    },
    {
        name: "Minimalist Baker",
        href: "https://minimalistbaker.com",
        logoSrc: "",
    },
    {
        name: "RecipeTin Eats",
        href: "https://www.recipetineats.com",
        logoSrc: "",
    },
    { name: "Delicious (AU)", href: "https://www.delicious.com.au", logoSrc: "" },
    { name: "Cookie and Kate", href: "https://cookieandkate.com", logoSrc: "" },
];

// simple monogram if no logo provided
function monogram(name: string) {
    const words = name
        .replace(/[()]/g, "")
        .split(/\s+/)
        .filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}
