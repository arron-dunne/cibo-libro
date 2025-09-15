// app/cook/page.tsx
// Cibo Libro — Cook Mode (static, gradient-friendly styling)
// - Positions unchanged from your current layout
// - Colors/borders/backgrounds tuned for the new gradient in layout.tsx
// - Timer = informational pill + Start button (no logic)

import {
  ArrowLeft,
  Timer as TimerIcon,
  ListChecks,
  Lock,
  UtensilsCrossed,
  Play,
} from "lucide-react";

export default function Page() {
  // --- Static mock data for layout preview ---
  const recipeTitle = "One-Pan Lemon Chicken & Greens";
  const stepIndex = 2;
  const totalSteps = 6;
  const stepBody =
    "Heat a large skillet over medium. Add 1 tbsp olive oil. Sear chicken skin-side down for 5–6 minutes until golden. Flip, add sliced garlic and lemon rounds, then cook 2 minutes more. Scatter green beans around the chicken and pour in 60 ml water to steam.";
  const stepTimer = "10:00";
  const ingredients = [
    "2 chicken thighs (bone-in, skin-on)",
    "1 tbsp olive oil",
    "2 cloves garlic, sliced",
    "1 lemon, sliced into rounds",
    "200 g green beans, trimmed",
    "Salt & pepper",
    "Splash of water",
  ];

  return (
    <div className="min-h-dvh text-gray-900">
      {/* Sticky header (glassy card over gradient) */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl ring-1 ring-white/50 shadow-sm">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 ring-1 ring-white/60 shadow-sm">
              <ArrowLeft className="h-5 w-5 text-gray-700" aria-hidden />
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-orange-600 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" aria-hidden />
              <div className="leading-tight">
                <p className="text-sm text-gray-600">Cook Mode</p>
                <h1 className="text-base font-semibold">{recipeTitle}</h1>
              </div>
            </div>
          </div>

          {/* Right side: Step indicator + wake-lock hint (static) */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Step <strong className="font-semibold">{stepIndex}</strong> of {totalSteps}
            </span>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/90 ring-1 ring-emerald-200 px-3 py-1">
              <Lock className="h-4 w-4 text-emerald-700" aria-hidden />
              <span className="text-sm text-emerald-800">Screen awake</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="mx-auto max-w-screen-lg px-4 sm:px-6 pt-4 sm:pt-6 pb-[calc(240px+env(safe-area-inset-bottom))] grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Step card (glassy surface) */}
        <section
          aria-label={`Step ${stepIndex} instructions`}
          className="rounded-2xl bg-white/85 backdrop-blur-xl ring-1 ring-white/60 shadow-lg shadow-orange-900/10"
        >
          {/* Step meta */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/60">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-orange-100 text-orange-700 font-bold ring-1 ring-orange-200">
                {stepIndex}
              </span>
              <div className="text-sm text-gray-700">
                Step {stepIndex} of {totalSteps}
              </div>
            </div>
            {/* (Timer moved to footer; nothing here) */}
          </div>

          {/* Step body (large, comfortable reading size) */}
          <div className="px-4 sm:px-6 py-5">
            <p className="text-xl leading-8 sm:text-2xl sm:leading-9">
              {stepBody}
            </p>

            {/* Tip callout */}
            <div className="mt-4 rounded-xl bg-orange-50/90 ring-1 ring-orange-200 px-4 py-3 text-sm text-orange-900">
              Tip: If the pan runs dry, add a splash of water and reduce heat slightly.
            </div>
          </div>
        </section>

        {/* Ingredients panel (desktop) */}
        <aside
          aria-label="Ingredients"
          className="hidden lg:block rounded-2xl bg-white/85 backdrop-blur-xl ring-1 ring-white/60 p-5 h-fit sticky top-[86px] shadow-md"
        >
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="h-5 w-5 text-orange-600" aria-hidden />
            <h2 className="text-lg font-semibold">Ingredients</h2>
          </div>
          <ul className="space-y-3">
            {ingredients.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[6px] h-2 w-2 rounded-full bg-orange-500/80" aria-hidden />
                <span className="text-base leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      {/* Mobile Ingredients bar (glassy) */}
      <div
        className="lg:hidden fixed inset-x-0 z-10 px-4 sm:px-6"
        style={{ bottom: "calc(220px + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-screen-sm rounded-2xl bg-white/85 backdrop-blur-xl ring-1 ring-white/60 shadow-md">
          <button
            type="button"
            className="w-full px-4 py-3 flex items-center justify-between"
            aria-label="Open ingredients"
          >
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-orange-600" aria-hidden />
              <span className="font-medium">Ingredients</span>
              <span className="ml-1 text-sm text-gray-600">({ingredients.length})</span>
            </div>
            <div className="h-1.5 w-12 rounded-full bg-gray-200" aria-hidden />
          </button>
        </div>
      </div>

      {/* Sticky bottom section with informational timer + nav (glassy footer) */}
      <nav
        aria-label="Step navigation"
        className="fixed inset-x-0 bottom-0 z-20 bg-white/75 backdrop-blur-xl ring-1 ring-white/60"
      >
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 py-3">
          {/* Timer row — informational pill + primary Start button */}
          <div className="flex items-stretch gap-3">
            {/* Informational time pill */}
            <div
              role="status"
              className="flex-1 rounded-2xl bg-white/85 backdrop-blur-xl ring-1 ring-orange-200 px-4 py-4 shadow-sm
                         flex items-center justify-center gap-2"
            >
              <TimerIcon className="h-5 w-5 text-orange-600" aria-hidden />
              <span className="tabular-nums text-lg sm:text-xl font-semibold text-gray-900">
                {stepTimer}
              </span>
            </div>

            {/* Primary Start button (matches Next) */}
            <button
              type="button"
              aria-label="Start timer"
              className="rounded-2xl bg-orange-600 text-white px-5 py-4 font-semibold shadow-md shadow-orange-900/10
                         hover:bg-orange-600/90 active:bg-orange-700
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2
                         inline-flex items-center justify-center gap-2 min-w-[9rem]"
            >
              <Play className="h-5 w-5" aria-hidden />
              <span className="text-base">Start</span>
            </button>
          </div>

          {/* Prev / Next / All steps */}
          <div className="mt-3 grid grid-cols-3 gap-3 items-stretch">
            <button
              type="button"
              className="col-span-1 rounded-xl bg-white/85 backdrop-blur-xl ring-1 ring-white/60 text-gray-900 py-3 font-medium shadow-sm"
            >
              Previous
            </button>
            <button
              type="button"
              className="col-span-1 rounded-xl bg-orange-600 text-white py-3 font-semibold shadow-md shadow-orange-900/10"
            >
              Next
            </button>
            <button
              type="button"
              className="col-span-1 rounded-xl bg-white/85 backdrop-blur-xl ring-1 ring-white/60 text-gray-900 py-3 font-medium shadow-sm"
            >
              All steps
            </button>
          </div>

          {/* Mobile-only wake-lock status */}
          <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/90 ring-1 ring-emerald-200 px-3 py-1">
              <Lock className="h-4 w-4 text-emerald-700" aria-hidden />
              <span className="text-sm text-emerald-800">Screen awake</span>
            </div>
          </div>

          {/* Safe-area spacer */}
          <div className="pt-[env(safe-area-inset-bottom)]" />
        </div>
      </nav>
    </div>
  );
}
