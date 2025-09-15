// app/cook-mode/page.tsx
// Static, styled wireframe upgrade (no interactivity).
// - Keeps your original layout
// - Uses lucide icons
// - Moves “Step 2 of 6” + Timer inside the step panel
// - Ingredients/All Steps buttons look more solid than the glassy header

import React from "react";
import {
    ArrowLeft,
    UtensilsCrossed,
    List,
    ListOrdered,
    Timer as TimerIcon,
    Lock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function Page() {
    return (
        // Let your gradient from layout.tsx show through
        <main className="min-h-dvh text-white flex flex-col">
            {/* Header */}
            {/* <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-screen-sm w-full px-4 pt-3">
          <div className="rounded-2xl px-3 py-2 bg-white/14 backdrop-blur ring-1 ring-white/35 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3">
            <button
              aria-label="Back"
              className="size-9 grid place-items-center rounded-xl bg-white/80 text-orange-900 ring-1 ring-black/5 shadow"
            >
              <ArrowLeft className="size-4" />
            </button>
            <h1 className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="size-4 opacity-90" />
              Spaghetti Carbonara
            </h1>
          </div>
        </div>
      </header> */}
            <header className="sticky top-0 z-20">
                <div className="mx-auto max-w-screen-sm px-4 sm:px-6 py-2">
                    {/* Glassy pill navbar */}
                    <div className="rounded-full bg-white/35 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_6px_24px_rgba(0,0,0,0.08)] px-3 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-1 ring-white/60 shadow-sm">
                                    <ArrowLeft className="h-5 w-5 text-gray-700" aria-hidden />
                                </div>
                                <div className="flex items-center gap-2">
                                    <UtensilsCrossed className="h-5 w-5 text-orange-600 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" aria-hidden />
                                    <div className="leading-tight">
                                        <p className="text-sm text-gray-700/90">Cook Mode</p>
                                        <h1 className="text-base text-black font-semibold">Spaghetti Carbonara</h1>
                                    </div>
                                </div>
                            </div>

                            {/* Right side: unchanged content, softened styling */}
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/90 ring-1 ring-emerald-200 px-3 py-1">
                                    <Lock className="h-4 w-4 text-emerald-700" aria-hidden />
                                    <span className="text-sm text-emerald-800">Screen awake</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="mx-auto max-w-screen-sm w-full px-4 pt-4 pb-28">
                {/* Quick refs (more solid than header) */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="h-12 rounded-full bg-[rgba(255,255,255,0.9)] text-orange-900 ring-1 ring-black/5 shadow text-[13px] font-semibold flex items-center justify-center gap-2">
                        <List className="size-4" />
                        Ingredients
                    </button>
                    <button className="h-12 rounded-full bg-[rgba(255,255,255,0.9)] text-orange-900 ring-1 ring-black/5 shadow text-[13px] font-semibold flex items-center justify-center gap-2">
                        <ListOrdered className="size-4" />
                        All Steps
                    </button>
                </div>

                {/* Step panel (now includes step index + timer) */}
                <div className="mt-5 rounded-3xl p-5 md:p-6 bg-[rgba(255,246,240,0.96)] text-orange-950 ring-1 ring-[rgba(253,216,180,0.9)] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                    {/* Meta row */}
                    <div className="flex justify-center items-center gap-3 pb-3 border-b border-[rgba(253,216,180,0.7)]/60">
                        <div className="text-xs font-medium text-orange-700/80">
                            Step 2 of 6
                        </div>
                    </div>

                    {/* Step copy */}
                    <p className="mt-4 text-[26px] leading-snug md:text-[28px]">
                        Step text, Whisk together eggs, egg yolks, and grated Pecorino
                        Romano in a bowl until creamy.
                    </p>

                    {/* Timer inside card */}
                    <div className="mt-5">
                        <button className="w-full h-14 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 text-white text-[16px] font-semibold ring-1 ring-orange-700/35 shadow-[0_10px_24px_rgba(234,88,12,0.35)] flex items-center justify-center gap-2">
                            <TimerIcon className="size-5" />
                            Start 10:00
                        </button>
                    </div>
                </div>
            </section>

            {/* Bottom navigation */}
            <nav className="fixed inset-x-0 bottom-0 z-30">
                <div className="mx-auto max-w-screen-sm w-full px-4 pb-4">
                    <div className="rounded-full p-3 bg-white/14 backdrop-blur ring-1 ring-white/35 shadow-[0_8px_30px_rgba(0,0,0,0.12)] grid grid-cols-2 gap-4">
                        <button className="h-14 rounded-full bg-white text-orange-900 text-lg font-semibold ring-1 ring-orange-700/40 shadow flex items-center justify-center gap-2">
                            <ChevronLeft className="size-5" /> Prev
                        </button>
                        <button className="h-14 rounded-full bg-orange-600 text-white text-lg font-semibold ring-1 ring-orange-700/40 shadow flex items-center justify-center gap-2">
                            Next <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
            </nav>
        </main>
    );
}
