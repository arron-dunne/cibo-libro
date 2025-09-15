// app/cook-mode/page.tsx
// Static, styled wireframe — same layout as your original mock, no interactivity.

import React from "react";

export default function Page() {
  return (
    // Let the gradient from layout.tsx show through
    <main className="min-h-dvh text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-screen-sm w-full px-4 pt-3">
          <div
            className="
              rounded-2xl px-3 py-2
              bg-white/15 backdrop-blur
              ring-1 ring-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)]
              flex items-center gap-3
            "
          >
            <button
              aria-label="Back"
              className="
                px-3 py-2 rounded-xl
                bg-white/70 text-orange-900
                ring-1 ring-black/5 shadow
                text-[11px] leading-tight
              "
            >
              back<br />button
            </button>
            <h1 className="text-[15px] font-semibold tracking-tight">
              Recipe Title
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-screen-sm w-full px-4 pt-4 pb-28">
        {/* Quick refs */}
        <div className="grid grid-cols-2 gap-4">
          <button
            className="
              h-11 rounded-xl
              bg-white/18 backdrop-blur
              ring-1 ring-white/30
              text-[13px] font-medium
              shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]
            "
          >
            Ingredients Dropdown
          </button>
          <button
            className="
              h-11 rounded-xl
              bg-white/18 backdrop-blur
              ring-1 ring-white/30
              text-[13px] font-medium
              shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]
            "
          >
            All Steps Dropdown
          </button>
        </div>

        {/* Step index */}
        <div className="mt-5 text-center text-xs text-white/80">
          Step 2 of 6
        </div>

        {/* Current step card */}
        <div
          className="
            mt-3 rounded-3xl p-5
            bg-[rgba(255,246,240,0.95)] text-orange-950
            ring-1 ring-[rgba(253,216,180,0.9)]
            shadow-[0_10px_30px_rgba(0,0,0,0.12)]
          "
        >
          <p className="text-[26px] leading-snug md:text-[28px]">
            Step text, Whisk together eggs, egg yolks, and grated Pecorino
            Romano in a bowl until creamy.
          </p>
        </div>

        {/* Timer */}
        <div className="mt-6">
          <button
            className="
              w-full h-14 rounded-2xl
              bg-gradient-to-b from-orange-500 to-orange-600
              text-white text-lg font-semibold
              ring-1 ring-orange-700/40
              shadow-[0_10px_24px_rgba(234,88,12,0.35)]
            "
          >
            Start Timer
          </button>
        </div>
      </section>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-screen-sm w-full px-4 pb-4">
          <div
            className="
              rounded-3xl p-3
              bg-white/18 backdrop-blur
              ring-1 ring-white/30
              shadow-[0_8px_30px_rgba(0,0,0,0.12)]
              grid grid-cols-2 gap-4
            "
          >
            <button
              className="
                h-12 rounded-xl
                bg-white/85 text-orange-900
                ring-1 ring-black/5 shadow
                text-sm font-semibold
              "
            >
              back button
            </button>
            <button
              className="
                h-12 rounded-xl
                bg-gradient-to-b from-orange-500 to-orange-600
                text-white text-sm font-semibold
                ring-1 ring-orange-700/40 shadow
              "
            >
              next button
            </button>
          </div>
        </div>
      </nav>
    </main>
  );
}
