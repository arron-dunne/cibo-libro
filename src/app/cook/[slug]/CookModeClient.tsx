'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  UtensilsCrossed,
  Lock,
  List,
  ListOrdered,
  Circle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

interface CookModeClientProps {
  slug: string;
  title: string;
  ingredients: string[];
  steps: string[];
  initialStep: string;
}

export default function CookModeClient({ 
  slug, title, ingredients, steps, initialStep 
}: CookModeClientProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0); // 0: forward, 1: backward
  const searchParams = useSearchParams();
  
  const totalSteps = steps.length;
  const isFinish = currentStep === "finish";
  const isIngredients = currentStep === "ings";

  // Update current step when URL changes
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const newStep = stepParam.toString().toLowerCase();
      
      // Determine animation direction
      if (getStepIndex(newStep) > getStepIndex(currentStep)) {
        setDirection(0); // Forward
      } else {
        setDirection(1); // Backward
      }
      
      setCurrentStep(newStep);
    } else {
      setCurrentStep("ings");
    }
  }, [searchParams, currentStep]);

  // Helper function to get step index for direction calculation
  const getStepIndex = (step: string): number => {
    if (step === "ings") return 0;
    if (step === "finish") return totalSteps + 1;
    const n = parseInt(step, 10);
    return isNaN(n) ? 0 : n;
  };

  // URL-driven Prev/Next (no client state)
  const base = `/cook/${slug}`;
  const hrefIngs = `${base}?step=ings`;
  const hrefFirst = `${base}?step=1`;
  const hrefLast = `${base}?step=${Math.max(totalSteps, 1)}`;
  const hrefFinish = `${base}?step=finish`;

  let prevHref: string | null = null;
  let nextHref: string | null = null;

  if (isIngredients) {
    prevHref = null;
    nextHref = totalSteps ? hrefFirst : hrefFinish;
  } else if (isFinish) {
    prevHref = totalSteps ? hrefLast : hrefIngs;
    nextHref = null;
  } else {
    const currentIdx = parseInt(currentStep, 10) - 1;
    prevHref = currentIdx > 0 ? `${base}?step=${currentIdx}` : hrefIngs;
    nextHref = currentIdx < totalSteps - 1 ? `${base}?step=${currentIdx + 2}` : hrefFinish;
  }

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction === 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction === 0 ? -300 : 300,
      opacity: 0
    })
  };

  return (
    <main className="min-h-dvh text-white flex flex-col">
      {/* Header - unchanged */}
      <header className="sticky top-4 z-20">
        <div className="mx-auto max-w-screen-sm">
          <div className="rounded-full border border-white/80 bg-white/60 backdrop-blur px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href={`/view/${slug}`}
                  aria-label="Back to recipe"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-1 ring-white/60 shadow-sm text-gray-700 hover:bg-white transition"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden />
                </Link>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed
                    className="h-5 w-5 text-orange-600 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    aria-hidden
                  />
                  <div className="leading-tight">
                    <p className="text-sm text-gray-700/90">Cook Mode</p>
                    <h1 className="text-base text-black font-semibold">{title}</h1>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/90 ring-1 ring-emerald-200 px-3 py-1">
                  <Lock className="h-4 w-4 text-emerald-700" aria-hidden />
                  <span className="text-sm text-emerald-800">Screen awake</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs - unchanged */}
      <section className="mx-auto max-w-screen-sm w-full px-4 pt-4 pb-28">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={hrefIngs}
            aria-current={isIngredients ? "page" : undefined}
            className={[
              "h-12 rounded-full ring-1 font-semibold text-[13px] flex items-center justify-center gap-2 transition",
              isIngredients
                ? "bg-[rgba(255,255,255,0.95)] text-orange-900 ring-black/5 shadow"
                : "bg-white/35 text-white ring-white/50 backdrop-blur shadow hover:bg-white/40",
            ].join(" ")}
          >
            <List className="h-4 w-4" />
            Ingredients
          </Link>
          <Link
            href={hrefFirst}
            aria-current={!isIngredients && !isFinish ? "page" : undefined}
            className={[
              "h-12 rounded-full ring-1 font-semibold text-[13px] flex items-center justify-center gap-2 transition",
              !isIngredients && !isFinish
                ? "bg-[rgba(255,255,255,0.95)] text-orange-900 ring-black/5 shadow"
                : "bg-white/35 text-white ring-white/50 backdrop-blur shadow hover:bg-white/40",
            ].join(" ")}
          >
            <ListOrdered className="h-4 w-4" />
            All Steps
          </Link>
        </div>

        {/* Animated content area */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* Ingredients panel */}
          {isIngredients && (
            <motion.div
              key="ings"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="
                mt-5 rounded-3xl p-5 md:p-6
                bg-[radial-gradient(120%_140%_at_50%_0%,rgba(255,253,250,0.98),rgba(255,244,230,0.98))]
                ring-1 ring-orange-200/80 shadow-[0_10px_28px_rgba(0,0,0,0.12)]
                text-stone-900
              "
            >
              {/* Header */}
              <div className="flex items-center justify-center pb-3 border-b border-orange-200/70">
                <p className="text-[13px] sm:text-sm font-semibold tracking-wide text-orange-800">
                  Gather &amp; Prepare Ingredients
                </p>
              </div>

              {ingredients.length ? (
                <ul className="mt-4 space-y-3.5">
                  {ingredients.map((line, i) => {
                    const id = `ing-${i}`;
                    return (
                      <li key={id}>
                        <label
                          htmlFor={id}
                          className="
                            group grid grid-cols-[auto_1fr] items-center gap-3
                            rounded-2xl px-4 py-3
                            bg-white/85 hover:bg-white/95
                            ring-1 ring-orange-100 shadow-sm
                            cursor-pointer focus-within:ring-2 focus-within:ring-orange-300
                          "
                        >
                          {/* Native checkbox for a11y; state is local to the session */}
                          <input id={id} type="checkbox" className="peer sr-only" />

                          {/* Unchecked */}
                          <span className="inline-flex h-6 w-6 items-center justify-center text-orange-400 peer-checked:hidden">
                            <Circle className="h-5 w-5" aria-hidden />
                          </span>
                          {/* Checked */}
                          <span className="hidden h-6 w-6 items-center justify-center text-emerald-600 peer-checked:inline-flex">
                            <CheckCircle2 className="h-5 w-5" aria-hidden />
                          </span>

                          {/* Text */}
                          <span className="text-[15px] leading-6 text-stone-800 peer-checked:text-stone-400 peer-checked:line-through">
                            {line}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-stone-700">
                  No ingredients found for this recipe yet.
                </p>
              )}
            </motion.div>
          )}

          {/* Step panel */}
          {!isIngredients && !isFinish && (
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="mt-5 rounded-3xl p-5 md:p-7 bg-[rgba(255,246,240,0.96)] text-orange-950 ring-1 ring-[rgba(253,216,180,0.9)] shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-center pb-4 border-b border-[rgba(253,216,180,0.7)]/60">
                <p className="text-xs font-medium text-orange-700/80">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-2xl md:text-3xl leading-snug text-orange-950/95">
                  {steps[parseInt(currentStep, 10) - 1]}
                </p>
              </div>
            </motion.div>
          )}

          {/* Finish panel */}
          {isFinish && (
            <motion.div
              key="finish"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="mt-5 rounded-3xl p-6 md:p-8 bg-[rgba(255,246,240,0.96)] text-orange-950 ring-1 ring-[rgba(253,216,180,0.9)] shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-center"
            >
              <div className="flex items-center justify-center gap-3 text-emerald-700">
                <BadgeCheck className="h-7 w-7" />
                <p className="text-sm font-semibold">Finished</p>
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-orange-900">Bon appétit!</h2>
              <p className="mt-2 text-orange-900/80">You've completed all the steps. Enjoy your meal.</p>
              <div className="mt-6">
                <Link
                  href={`/view/${slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-white/80 text-orange-900 ring-1 ring-black/5 shadow px-6 py-3 font-semibold hover:bg-white"
                >
                  Back to recipe
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Bottom nav - unchanged */}
      <nav className="fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-screen-sm w-full px-4 pb-4">
          <div className="rounded-full p-3 bg-white/14 backdrop-blur ring-1 ring-white/35 shadow-[0_8px_30px_rgba(0,0,0,0.12)] grid grid-cols-2 gap-4">
            {prevHref ? (
              <Link
                href={prevHref}
                role="button"
                className="h-14 rounded-full bg-white/70 text-orange-900 text-lg font-semibold ring-1 ring-orange-700/40 shadow flex items-center justify-center gap-2 hover:bg-white/80 transition"
              >
                <ChevronLeft className="h-5 w-5" /> Prev
              </Link>
            ) : (
              <button
                className="h-14 rounded-full bg-white/60 text-orange-900/70 text-lg font-semibold ring-1 ring-orange-700/20 shadow flex items-center justify-center gap-2 cursor-not-allowed"
                aria-disabled="true"
                disabled
              >
                <ChevronLeft className="h-5 w-5" /> Prev
              </button>
            )}

            {nextHref ? (
              <Link
                href={nextHref}
                role="button"
                className="h-14 rounded-full bg-orange-600 text-white text-lg font-semibold ring-1 ring-orange-700/40 shadow flex items-center justify-center gap-2 hover:bg-orange-700 active:bg-orange-800 active:translate-y-px transition"
              >
                Next <ChevronRight className="h-5 w-5" />
              </Link>
            ) : (
              <button
                className="h-14 rounded-full bg-orange-500/50 text-white/80 text-lg font-semibold ring-1 ring-orange-700/30 shadow flex items-center justify-center gap-2 cursor-not-allowed"
                aria-disabled="true"
                disabled
              >
                Next <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </main>
  );
}