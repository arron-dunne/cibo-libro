'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

type StepType = "ings" | "finish" | number;

export default function CookModeClient({
  slug, title, ingredients, steps, initialStep
}: CookModeClientProps) {

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepType>(parseStep(initialStep));
  const [direction, setDirection] = useState<number>(0);

  // Parse step from string to proper type
  function parseStep(step: string): StepType {
    if (step === "ings") return "ings";
    if (step === "finish") return "finish";
    const num = parseInt(step, 10);
    return isNaN(num) ? "ings" : Math.max(1, Math.min(num, steps.length));
  }

  // Update URL without page reload (shallow routing)
  function updateUrl(step: StepType) {
    const stepParam = step === "ings" ? "ings" : step === "finish" ? "finish" : step.toString();
    const newUrl = `/cook/${slug}?step=${stepParam}`;
    router.push(newUrl);
  }

  // Navigate to specific step
  function navigateToStep(newStep: StepType) {
    const oldStepIndex = getStepIndex(currentStep);
    const newStepIndex = getStepIndex(newStep);

    setDirection(newStepIndex > oldStepIndex ? 1 : 0); // 1 = forward, 0 = backward
    setCurrentStep(newStep);
    updateUrl(newStep);
  }

  // Navigate to next step
  function goToNext() {
    if (currentStep === "ings") {
      navigateToStep(steps.length > 0 ? 1 : "finish");
    } else if (typeof currentStep === "number") {
      navigateToStep(currentStep < steps.length ? currentStep + 1 : "finish");
    }
    // "finish" has no next step
  }

  // Navigate to previous step
  function goToPrevious() {
    if (currentStep === "finish") {
      navigateToStep(steps.length > 0 ? steps.length : "ings");
    } else if (typeof currentStep === "number") {
      navigateToStep(currentStep > 1 ? currentStep - 1 : "ings");
    }
    // "ings" has no previous step
  }

  // Get numeric index for animation direction calculation
  function getStepIndex(step: StepType): number {
    if (step === "ings") return 0;
    if (step === "finish") return steps.length + 1;
    return step;
  }

  // Check if navigation is possible
  const canGoPrevious = currentStep !== "ings";
  const canGoNext = currentStep !== "finish";

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir === 1 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir === 1 ? -300 : 300,
      opacity: 0
    })
  };

  return (
    <main className="min-h-dvh text-white flex flex-col">
      {/* Header */}
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

      {/* Tabs */}
      <section className="mx-auto max-w-screen-sm w-full px-4 pt-4 pb-28">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigateToStep("ings")}
            aria-current={currentStep === "ings" ? "page" : undefined}
            className={[
              "h-12 rounded-full ring-1 font-semibold text-[13px] flex items-center justify-center gap-2 transition",
              currentStep === "ings"
                ? "bg-[rgba(255,255,255,0.95)] text-orange-900 ring-black/5 shadow"
                : "bg-white/35 text-white ring-white/50 backdrop-blur shadow hover:bg-white/40",
            ].join(" ")}
          >
            <List className="h-4 w-4" />
            Ingredients
          </button>
          <button
            onClick={() => navigateToStep(1)}
            aria-current={typeof currentStep === "number" ? "page" : undefined}
            className={[
              "h-12 rounded-full ring-1 font-semibold text-[13px] flex items-center justify-center gap-2 transition",
              typeof currentStep === "number"
                ? "bg-[rgba(255,255,255,0.95)] text-orange-900 ring-black/5 shadow"
                : "bg-white/35 text-white ring-white/50 backdrop-blur shadow hover:bg-white/40",
            ].join(" ")}
          >
            <ListOrdered className="h-4 w-4" />
            All Steps
          </button>
        </div>

        {/* Animated content area */}
        <AnimatePresence mode="wait" initial={false} custom={direction}>

          {/* Ingredients panel */}
          {currentStep === "ings" && (
            <motion.div
              key="ings"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              custom={direction}
              className="mt-5 rounded-3xl p-5 md:p-6 bg-orange-50 border-white shadow-lg text-stone-900"
            >
              <div className="flex items-center justify-center pb-3 border-b border-orange-200/70">
                <p className="text-[13px] sm:text-sm font-semibold tracking-wide text-orange-800">
                  Prepare Ingredients
                </p>
              </div>

              {ingredients.length ? (
                <ul className="mt-4 space-y-3.5">
                  {ingredients.map((line, i) => (
                    <li key={`ing-${i}`}>
                      <label className="group flex items-center gap-3 px-4 py-3 cursor-pointer">
                        <input type="checkbox" className="sr-only" />
                        <span className="inline-flex h-6 w-6 items-center justify-center text-orange-400 group-has-checked:hidden">
                          <Circle className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="hidden h-6 w-6 items-center justify-center text-emerald-600 group-has-checked:inline-flex">
                          <CheckCircle2 className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="text-[15px] leading-6 text-stone-800 group-has-checked:text-stone-400">
                          {line}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-stone-700">No ingredients found for this recipe yet.</p>
              )}
            </motion.div>
          )}

          {/* Step panel */}
          {typeof currentStep === "number" && (
            <motion.div
              key={`step-${currentStep}`}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              custom={direction}
              className="mt-5 rounded-3xl p-5 md:p-6 bg-orange-50 border-white shadow-lg text-stone-900"
            >
              {/* Step indicator and progress bar */}
              <div className="flex items-center justify-center pb-4 border-b border-[rgba(253,216,180,0.7)]/60">
                <div className="w-full text-center">
                  <p className="text-xs font-medium text-orange-700/80 mb-3">
                    Step {currentStep} of {steps.length}
                  </p>

                  {/* Progress bar with nodes */}
                  <svg height={30} width="100%" preserveAspectRatio="xMidYMid slice" role="img">
                    <line x1="0%" x2="100%" y1="50%" y2="50%" stroke="orange" strokeWidth={1}/>
                    { Array.from({ length: steps.length }).map((_, i) => { 
                      const xPercent = ((i * (90 / (steps.length - 1))) + 5).toString() + "%";

                      // current step
                      if (getStepIndex(currentStep) === i + 1 ) {
                        return  (
                          // <div key={i}>
                          //   <circle cx={xPercent} cy="50%" r={12} stroke="orange" strokeWidth={3} fill="white" />
                          //   <circle cx={xPercent} cy="50%" r={6} stroke="orange" strokeWidth={3} fill="orange" />
                          // </div>
                          <CheckCircle2/>
                        )
                      }
                      // completed steps
                      if (getStepIndex(currentStep) > i + 1) {
                        return <circle key={i} cx={xPercent} cy="50%" r={6} stroke="green" strokeWidth={3} fill="white" />
                      }
                      // still to do steps
                      return <circle key={i} cx={xPercent} cy="50%" r={6} stroke="orange" strokeWidth={3} fill="white" />
                    })}
                  </svg>
                </div>
              </div>

              {/* Step content */}
              <div className="mt-4">
                <p className="text-2xl md:text-3xl leading-snug text-orange-950/95">
                  {steps[currentStep - 1]}
                </p>
              </div>
            </motion.div>
          )}

          {/* Finish panel */}
          {currentStep === "finish" && (
            <motion.div
              key="finish"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              custom={direction}
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

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-screen-sm w-full px-4 pb-4">
          <div className="rounded-full p-3 bg-white/14 backdrop-blur ring-1 ring-white/35 shadow-[0_8px_30px_rgba(0,0,0,0.12)] grid grid-cols-2 gap-4">
            <button
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className="h-14 rounded-full bg-white/70 text-orange-900 text-lg font-semibold ring-1 ring-orange-700/40 shadow flex items-center justify-center gap-2 hover:bg-white/80 disabled:bg-white/60 disabled:text-orange-900/70 disabled:ring-orange-700/20 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-5 w-5" /> Prev
            </button>

            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className="h-14 rounded-full bg-orange-600 text-white text-lg font-semibold ring-1 ring-orange-700/40 shadow flex items-center justify-center gap-2 hover:bg-orange-700 active:bg-orange-800 disabled:bg-orange-500/50 disabled:text-white/80 disabled:ring-orange-700/30 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
    </main>
  );
}