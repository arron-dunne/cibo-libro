// app/cook-mode/page.tsx
// Static wireframe mock of the provided layout (no interactivity)

import React from "react";

export default function Page() {
  return (
    <main className="min-h-dvh bg-neutral-100 text-neutral-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-neutral-200 border-b border-neutral-300">
        <div className="mx-auto max-w-screen-sm w-full px-4 py-2 flex items-center gap-3">
          <button
            aria-label="Back"
            className="px-2 py-2 rounded bg-neutral-300 border border-neutral-400 text-xs leading-none"
          >
            back<br />button
          </button>
          <h1 className="text-lg font-medium">Recipe Title</h1>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-screen-sm w-full px-4 pt-4 pb-28">
        {/* Top quick refs */}
        <div className="grid grid-cols-2 gap-4">
          <button className="h-10 rounded bg-neutral-300 border border-neutral-400 text-sm font-medium">
            Ingredients Dropdown
          </button>
          <button className="h-10 rounded bg-neutral-300 border border-neutral-400 text-sm font-medium">
            All Steps Dropdown
          </button>
        </div>

        {/* Step index */}
        <div className="mt-5 text-center text-xs text-neutral-600">
          Step 2 of 6
        </div>

        {/* Current step block */}
        <div className="mt-3 rounded bg-neutral-200 border border-neutral-300 p-5">
          <p className="text-2xl leading-snug">
            Step text, Whisk together eggs, egg yolks, and grated Pecorino
            Romano in a bowl until creamy.
          </p>
        </div>

        {/* Timer button */}
        <div className="mt-6">
          <button className="w-full h-14 rounded bg-neutral-400 border border-neutral-500 text-lg font-medium">
            Start Timer
          </button>
        </div>
      </section>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 bg-neutral-100/90 backdrop-blur">
        <div className="mx-auto max-w-screen-sm w-full px-4 py-3">
          <div className="grid grid-cols-2 gap-4">
            <button className="h-10 rounded bg-neutral-300 border border-neutral-400 text-sm font-medium">
              back button
            </button>
            <button className="h-10 rounded bg-neutral-300 border border-neutral-400 text-sm font-medium">
              next button
            </button>
          </div>
        </div>
      </nav>
    </main>
  );
}
