// Draft 2 — page.jsx
import React from "react";
import { ArrowLeft, Timer as TimerIcon, List, ListOrdered, Sun, ChevronLeft, ChevronRight } from "lucide-react";


export default function Page() {
    return (
        <main className="min-h-dvh bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-50 flex flex-col">
            {/* Slim Header */}
            <header className="sticky top-0 z-20 px-4 py-3">
                <div className="mx-auto max-w-screen-sm flex items-center justify-between">
                    <button className="p-3 rounded-xl bg-zinc-800/70 border border-zinc-700" aria-label="Back">
                        <ArrowLeft className="size-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-800/80 border border-zinc-700">Cook Mode</span>
                        <div className="flex items-center gap-2 text-emerald-400"><span className="size-2 rounded-full bg-emerald-400" /><Sun className="size-5" /></div>
                    </div>
                </div>
                <h1 className="mx-auto max-w-screen-sm px-4 text-lg font-semibold mt-2">Spaghetti Carbonara</h1>
            </header>


            {/* Central Step */}
            <section className="relative mx-auto max-w-screen-sm w-full px-6 pt-6 pb-32 flex-1 flex items-center">
                <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
                    <div className="text-xs text-zinc-400 mb-2">Step 2 of 8</div>
                    <p className="text-[28px] leading-tight md:text-[34px]">Whisk together eggs, egg yolks, and grated Pecorino Romano in a bowl until creamy.</p>
                </div>


                {/* Floating Prev/Next */}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-between px-2 pb-40">
                    <div className="pointer-events-auto">
                        <button className="size-16 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center">
                            <ChevronLeft className="size-6" />
                        </button>
                    </div>
                    <div className="pointer-events-auto">
                        <button className="size-16 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <ChevronRight className="size-6" />
                        </button>
                    </div>
                </div>
            </section>


            {/* Footer Actions */}
            <footer className="fixed inset-x-0 bottom-0 z-30">
                <div className="mx-auto max-w-screen-sm px-4 pb-5">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur p-3 grid grid-cols-3 gap-3">
                        <button className="h-14 rounded-xl bg-zinc-800/80 border border-zinc-700 text-base font-medium flex items-center justify-center gap-2">
                            <List className="size-5" /> Ingredients
                        </button>
                        <button className="h-14 rounded-xl bg-zinc-800/80 border border-zinc-700 text-base font-medium flex items-center justify-center gap-2">
                            <ListOrdered className="size-5" /> Steps
                        </button>
                        <button className="h-14 rounded-xl bg-amber-500/15 border border-amber-700 text-amber-400 font-semibold flex items-center justify-center gap-2">
                            <TimerIcon className="size-5" /> Start 10:00
                        </button>
                    </div>
                </div>
            </footer>
        </main>
    );
}