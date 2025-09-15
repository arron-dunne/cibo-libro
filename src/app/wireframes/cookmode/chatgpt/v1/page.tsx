// Draft 1 — page.jsx

import React from "react";
import {
    ArrowLeft,
    Timer as TimerIcon,
    List,
    ListOrdered,
    Sun,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function Page() {
    return (
        <main className="min-h-dvh bg-zinc-950 text-zinc-50 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 bg-zinc-900/90 border-b border-zinc-800">
                <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center justify-between gap-3">
                    <button className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700" aria-label="Back">
                        <ArrowLeft className="size-5" />
                    </button>
                    <div className="flex flex-col items-center">
                        <div className="text-sm uppercase tracking-wide text-zinc-300">Cook Mode</div>
                        <h1 className="text-base font-semibold leading-none">Spaghetti Carbonara</h1>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400" aria-label="Screen awake on">
                        <span className="size-2 rounded-full bg-emerald-400" />
                        <Sun className="size-5" />
                    </div>
                </div>
            </header>


            {/* Content */}
            <section className="mx-auto max-w-screen-sm w-full px-4 pt-6 pb-28 flex-1">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                    <div className="text-xs text-zinc-400 mb-2">Step 2 of 8</div>
                    <p className="text-2xl leading-snug md:text-3xl">Whisk together eggs, egg yolks, and grated Pecorino Romano in a bowl until creamy.</p>
                </div>


                <div className="mt-4 grid grid-cols-3 gap-3">
                    <button className="col-span-1 h-14 rounded-2xl border border-zinc-800 bg-zinc-900/70 text-base font-medium flex items-center justify-center gap-2">
                        <List className="size-5" /> Ingredients
                    </button>
                    <button className="col-span-1 h-14 rounded-2xl border border-zinc-800 bg-zinc-900/70 text-base font-medium flex items-center justify-center gap-2">
                        <ListOrdered className="size-5" /> Steps
                    </button>
                    <button className="col-span-1 h-14 rounded-2xl border border-amber-700 bg-amber-500/10 text-base font-semibold text-amber-400 flex items-center justify-center gap-2">
                        <TimerIcon className="size-5" /> Start 10:00
                    </button>
                </div>
            </section>


            {/* Bottom Dock */}
            <nav className="fixed inset-x-0 bottom-0 z-30">
                <div className="mx-auto max-w-screen-sm px-4 pb-5">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur grid grid-cols-2 gap-2 p-2">
                        <button className="h-14 rounded-xl bg-zinc-800/80 border border-zinc-700 text-lg font-semibold flex items-center justify-center gap-2">
                            <ChevronLeft className="size-5" /> Prev
                        </button>
                        <button className="h-14 rounded-xl bg-emerald-600 text-white text-lg font-semibold flex items-center justify-center gap-2">
                            Next <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
            </nav>
        </main>
    );
}