// app/cook/page.tsx
// Cibo Libro — Cook Mode (wireframe, static) — Draft 2
// - Mobile-first, no interactivity (pure layout)
// - Timer pill redesigned with prominent "Start" button
// - Mobile Ingredients bar repositioned to avoid clipping
// - Tailwind + lucide-react

import {
  ArrowLeft,
  Timer,
  ListChecks,
  Lock,
  UtensilsCrossed,
  PlayCircle,
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
    <div className="min-h-dvh bg-gradient-to-b from-orange-50 to-white text-gray-900">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-orange-100">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-white">
              <ArrowLeft className="h-5 w-5 text-gray-700" aria-hidden />
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-orange-500" aria-hidden />
              <div className="leading-tight">
                <p className="text-sm text-gray-500">Cook Mode</p>
                <h1 className="text-base font-semibold text-gray-900">{recipeTitle}</h1>
              </div>
            </div>
          </div>

          {/* Right side: Step indicator + wake-lock hint (static) */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Step <strong className="font-semibold">{stepIndex}</strong> of {totalSteps}
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
              <Lock className="h-4 w-4 text-emerald-600" aria-hidden />
              <span className="text-sm text-emerald-700">Screen awake</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="mx-auto max-w-screen-lg px-4 sm:px-6 pb-[calc(92px+env(safe-area-inset-bottom))] pt-4 sm:pt-6 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Step card */}
        <section
          aria-label={`Step ${stepIndex} instructions`}
          className="rounded-2xl border border-orange-100 bg-white shadow-sm"
        >
          {/* Step meta */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-orange-100 text-orange-700 font-bold">
                {stepIndex}
              </span>
              <div className="text-sm text-gray-600">
                Step {stepIndex} of {totalSteps}
              </div>
            </div>

            {/* Timer pill with Start button (static) */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white ps-3 pe-1 py-1.5 shadow">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" aria-hidden />
                <span className="tabular-nums text-sm">{stepTimer}</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-gray-900 px-3 py-1.5 text-sm font-semibold shadow-sm"
                aria-label="Start timer"
              >
                <PlayCircle className="h-4 w-4" aria-hidden />
                Start
              </button>
            </div>
          </div>

          {/* Step body (large reading size) */}
          <div className="px-4 sm:px-6 py-5">
            <p className="text-xl leading-8 sm:text-2xl sm:leading-9">
              {stepBody}
            </p>

            {/* Tip callout */}
            <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-900">
              Tip: If the pan runs dry, add a splash of water and reduce heat slightly.
            </div>
          </div>
        </section>

        {/* Ingredients panel (desktop) */}
        <aside
          aria-label="Ingredients"
          className="hidden lg:block rounded-2xl border border-orange-100 bg-white p-5 h-fit sticky top-[86px]"
        >
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="h-5 w-5 text-orange-600" aria-hidden />
            <h2 className="text-lg font-semibold">Ingredients</h2>
          </div>
          <ul className="space-y-3">
            {ingredients.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[6px] h-2 w-2 rounded-full bg-orange-500/70" aria-hidden />
                <span className="text-base leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      {/* Mobile Ingredients bar — lifted further above bottom nav to prevent clipping */}
      <div className="lg:hidden fixed inset-x-0 z-10 px-4 sm:px-6"
           style={{ bottom: "calc(120px + env(safe-area-inset-bottom))" }}>
        <div className="mx-auto max-w-screen-sm rounded-2xl border border-orange-200 bg-white shadow-md">
          <button
            type="button"
            className="w-full px-4 py-3 flex items-center justify-between"
            aria-label="Open ingredients"
          >
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-orange-600" aria-hidden />
              <span className="font-medium">Ingredients</span>
              <span className="ml-1 text-sm text-gray-500">({ingredients.length})</span>
            </div>
            <div className="h-1.5 w-12 rounded-full bg-gray-200" aria-hidden />
          </button>
        </div>
      </div>

      {/* Sticky bottom nav */}
      <nav
        aria-label="Step navigation"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-orange-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70"
      >
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 py-3">
          <div className="grid grid-cols-3 gap-3 items-stretch">
            <button
              type="button"
              className="col-span-1 rounded-xl border border-gray-300 bg-white py-3 text-base font-medium"
            >
              Previous
            </button>
            <button
              type="button"
              className="col-span-1 rounded-xl bg-orange-600 text-white py-3 text-base font-semibold shadow"
            >
              Next
            </button>
            <button
              type="button"
              className="col-span-1 rounded-xl border border-gray-300 bg-white py-3 text-base font-medium"
            >
              All steps
            </button>
          </div>

          {/* Mobile-only wake-lock status */}
          <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
              <Lock className="h-4 w-4 text-emerald-600" aria-hidden />
              <span className="text-sm text-emerald-700">Screen awake</span>
            </div>
          </div>

          {/* Safe-area spacer */}
          <div className="pt-[env(safe-area-inset-bottom)]" />
        </div>
      </nav>
    </div>
  );
}
