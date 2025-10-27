'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { extractIngredientKeyword } from "@/lib/ingredients/extractKeywords"
import { IngredientText } from "./components/IngredientText";
import { StepText } from "./components/StepText";
import {
  ArrowLeft,
  UtensilsCrossed,
  Lock,
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

type ScreenType = "desktop" | "mobile";

// Bezier easings (type-safe for Framer Motion)
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.12, 0, 0.39, 0] as const;

export default function CookModeClient({
  slug, title, ingredients, steps, initialStep
}: CookModeClientProps) {

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepType>(parseStep(initialStep));
  const [direction, setDirection] = useState<number>(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [screen, setScreen] = useState<ScreenType>("mobile")

  const ingredientKeywords = ingredients
    .map(extractIngredientKeyword)
    .filter(Boolean) as string[];




  // // Check if a given ingredient appears in the current step
  // function ingredientUsedInStep(ingredient: string, stepText: string): boolean {
  //   const keyword = extractIngredientKeyword(ingredient)[0];
  //   if (!keyword) return false;
  //   const regex = new RegExp(`\\b${keyword}\\b`, "i");
  //   return regex.test(stepText);
  // }

  // Detect the screen size
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreen = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setScreen(isDesktop ? "desktop" : "mobile");
    };

    checkScreen(); // run once
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Skip ingredients step entirely for desktop users
  useEffect(() => {
    if (screen === "desktop" && currentStep === "ings") {
      navigateToStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);


  // Parse step from string to proper type
  function parseStep(step: string): StepType {
    if (step === "ings") return "ings";
    if (step === "finish") return "finish";
    const num = parseInt(step, 10);
    return isNaN(num) ? "ings" : Math.max(1, Math.min(num, steps.length));
  }

  function updateUrl(step: StepType) {
    const stepParam = step === "ings" ? "ings" : step === "finish" ? "finish" : step.toString();
    const newUrl = `/cook/${slug}?step=${stepParam}`;
    router.push(newUrl);
  }

  function navigateToStep(newStep: StepType) {
    const oldStepIndex = getStepIndex(currentStep);
    const newStepIndex = getStepIndex(newStep);

    setDirection(newStepIndex > oldStepIndex ? 1 : 0);
    setCurrentStep(newStep);
    updateUrl(newStep);
  }

  function goToNext() {
    if (currentStep === "ings") {
      navigateToStep(steps.length > 0 ? 1 : "finish");
    } else if (typeof currentStep === "number") {
      navigateToStep(currentStep < steps.length ? currentStep + 1 : "finish");
    }
  }

  function goToPrevious() {
    if (currentStep === "finish") {
      navigateToStep(steps.length > 0 ? steps.length : "ings");
    } else if (typeof currentStep === "number") {
      if (currentStep > 1) {
        navigateToStep(currentStep - 1);
      } else if (screen === "mobile") {
        // dont allow navigation to ings page on desktop
        navigateToStep("ings");
      }
    }
  }

  function getStepIndex(step: StepType): number {
    if (step === "ings") return 0;
    if (step === "finish") return steps.length + 1;
    return step;
  }

  const canGoPrevious = currentStep !== "ings";
  const canGoNext = currentStep !== "finish";

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir === 1 ? 200 : -200,
      opacity: 0,
      transition: { duration: 0.25, ease: EASE_IN }
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: EASE_OUT }
    },
    exit: (dir: number) => ({
      x: dir === 1 ? -200 : 200,
      opacity: 0,
      transition: { duration: 0.25, ease: EASE_IN }
    })
  };

  return (
    <main className="min-h-dvh text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-4 z-20">
        <motion.div
          className="mx-auto max-w-screen-xl px-4"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="rounded-full border border-white/70 bg-white/60 backdrop-blur-xl px-3 sm:px-4 py-2 sm:py-3 shadow-md">
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

              <motion.div
                className="hidden sm:flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/90 ring-1 ring-emerald-200 px-3 py-1">
                  <Lock className="h-4 w-4 text-emerald-700" aria-hidden />
                  <span className="text-sm text-emerald-800">Screen awake</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main content area */}
      <section className="mx-auto w-full max-w-screen-xl flex-1 px-4 pt-4 pb-28 flex flex-col md:flex-row md:gap-6">

        {/* Left panel: Ingredients (desktop-only) */}
        <div
          className="
            hidden md:block md:w-[42%]
            bg-white/90 rounded-3xl p-5
            border border-white/40 shadow-lg text-stone-900
          "
        >
          <h3 className="text-center text-[13px] font-semibold tracking-tight text-orange-800 border-b border-orange-200/70 pb-2">
            Ingredients
          </h3>

          {ingredients.length ? (
            <ul className="mt-3 space-y-0.5">
              {ingredients.map((line, i) => (
                <IngredientText key={i} text={line} stepText={typeof currentStep === "number" ? steps[currentStep - 1] : undefined} size="sidebar" />
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-stone-700">
              No ingredients found for this recipe.
            </p>
          )}
        </div>

        {/* Right panel: Steps */}
        <div className="w-full md:w-[58%]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {/* Ingredients panel (mobile only) */}
            {currentStep === "ings" && (
              <motion.div
                key="ings"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                className="mt-5 md:mt-0 rounded-3xl p-6 bg-white/90 border-white/40 shadow-xl text-stone-900 md:hidden"
              >
                <h3 className="text-center text-sm font-semibold text-orange-800 border-b border-orange-200/70 pb-3">
                  Prepare Ingredients
                </h3>

                {ingredients.length ? (
                  <ul className="mt-4 space-y-1">
                    {ingredients.map((line, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <label className="group flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl hover:bg-orange-50 transition">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={!!checked[i]}
                            onChange={() => setChecked({ ...checked, [i]: !checked[i] })}
                          />
                          {checked[i] ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-orange-400" />
                          )}
                          <span
                            className={`text-[15px] leading-6 ${checked[i]
                              ? "text-stone-400 line-through"
                              : "text-stone-800"
                              }`}
                          >
                            {line}
                          </span>
                        </label>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-stone-700">
                    No ingredients found for this recipe yet.
                  </p>
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
                custom={direction}
                className="mt-5 md:mt-0 rounded-3xl p-6 bg-white/90 shadow-xl border border-orange-100 text-stone-900"
              >
                <div className="text-center border-b border-orange-200/60 pb-4">
                  <p className="text-xs font-medium text-orange-700/80 mb-2">
                    Step {currentStep} of {steps.length}
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-orange-100 overflow-hidden">
                    <div
                      className="h-1.5 bg-orange-500"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <StepText text={steps[currentStep - 1]} keywords={ingredientKeywords} />

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
                custom={direction}
                className="mt-5 md:mt-0 rounded-3xl p-8 bg-white/95 text-orange-950 shadow-2xl border border-orange-100 text-center"
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="flex items-center justify-center gap-3 text-emerald-700"
                >
                  <BadgeCheck className="h-7 w-7" />
                  <p className="text-sm font-semibold">Finished</p>
                </motion.div>
                <h2 className="mt-3 text-3xl font-semibold text-orange-900">
                  Bon appétit!
                </h2>
                <p className="mt-2 text-orange-900/80">
                  You&apos;ve completed all the steps. Enjoy your meal.
                </p>
                <Link
                  href={`/view/${slug}`}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-600 text-white ring-1 ring-orange-700/40 shadow px-6 py-3 font-semibold hover:bg-orange-700 transition"
                >
                  Back to recipe
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bottom navigation */}
      <motion.nav
        className="fixed inset-x-0 bottom-0 z-30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-screen-xl w-full px-4 pb-4">
          <div className="rounded-full p-3 bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] grid grid-cols-2 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className="h-14 rounded-full bg-teal-400 text-orange-900 text-lg font-semibold ring-1 ring-orange-700/30 shadow flex items-center justify-center gap-2 hover:bg-white/90 disabled:bg-white/60 disabled:text-orange-900/60 transition"
            >
              <ChevronLeft className="h-5 w-5" /> Prev
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              disabled={!canGoNext}
              className="relative bg-rose-500 h-14 rounded-full text-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            // style={{
            //   background:
            //     "linear-gradient(135deg, #ff7a00 0%, #ff4500 100%)",
            //   color: "white",
            //   boxShadow:
            //     "0 4px 15px rgba(255, 120, 0, 0.4), 0 0 10px rgba(255, 80, 0, 0.2)",
            // }}
            >
              Next <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </main>
  );
}
