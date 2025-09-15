// Draft 5 — page.jsx
import React from "react";
import { ArrowLeft, Timer as TimerIcon, List, ListOrdered, Sun, ChevronLeft, ChevronRight } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-dvh bg-white text-zinc-900 flex flex-col">
      {/* Minimal Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center justify-between">
          <button className="p-3 rounded-xl bg-zinc-100 border border-zinc-200" aria-label="Back">
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-100 border border-zinc-200">Cook Mode</span>
            <div className="flex items-center gap-2 text-emerald-600" aria-label="Screen awake on">
              <span className="size-2 rounded-full bg-emerald-600" />
              <Sun className="size-5" />
            </div>
          </div>
        </div>
        <h1 className="mx-auto max-w-screen-sm px-4 text-lg font-semibold">Spaghetti Carbonara</h1>
      </header>


      {/* Giant Step Text */}
      <section className="mx-auto max-w-screen-sm w-full px-4 pt-6 pb-28 flex-1">
        <div className="text-xs text-zinc-500 mb-2">Step 2 of 8</div>
        <p className="text-[32px] leading-tight md:text-[40px]">Whisk together eggs, egg yolks, and grated Pecorino Romano in a bowl until creamy.</p>


        <div className="mt-6 flex flex-wrap gap-3">
          <button className="px-5 h-14 rounded-full border border-zinc-200 bg-zinc-100 text-base font-medium flex items-center gap-2">
            <List className="size-5" /> Ingredients
          </button>
          <button className="px-5 h-14 rounded-full border border-zinc-200 bg-zinc-100 text-base font-medium flex items-center gap-2">
            <ListOrdered className="size-5" /> Steps
          </button>
          <button className="px-5 h-14 rounded-full border border-amber-300 bg-amber-50 text-amber-700 font-semibold flex items-center gap-2">
            <TimerIcon className="size-5" /> Start 10:00
          </button>
        </div>
      </section>


      {/* Sticky Bottom CTA */}
      <nav className="fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-screen-sm px-4 pb-5">
          <div className="flex items-center gap-3">
            <button className="flex-1 h-16 rounded-2xl bg-zinc-200 text-zinc-900 text-lg font-semibold flex items-center justify-center gap-2">
              <ChevronLeft className="size-5" /> Prev
            </button>
            <button className="flex-[1.2] h-16 rounded-2xl bg-emerald-600 text-white text-lg font-semibold flex items-center justify-center gap-2">
              Next <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </nav>
    </main>
  );
}