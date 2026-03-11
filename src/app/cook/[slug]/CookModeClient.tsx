"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { extractIngredientKeyword } from "@/lib/ingredients/extractKeywords";
import { IngredientText } from "./components/IngredientText";
import { StepText } from "./components/StepText";
import {
  ArrowLeft,
  UtensilsCrossed,
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
}

type StepType = "ings" | "finish" | number;

type ScreenType = "desktop" | "mobile";

export default function CookModeClient({
  slug,
  title,
  ingredients,
  steps,
}: CookModeClientProps) {
  const [currentStep, setCurrentStep] = useState<StepType>("ings");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [screen, setScreen] = useState<ScreenType>("mobile");

  const ingredientKeywords = ingredients
    .map(extractIngredientKeyword)
    .filter(Boolean) as string[];

  // Detect the screen size
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreen = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setScreen(isDesktop ? "desktop" : "mobile");
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Skip ingredients step entirely for desktop users
  useEffect(() => {
    if (screen === "desktop" && currentStep === "ings") {
      setCurrentStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  function goToNext() {
    if (currentStep === "ings") {
      setCurrentStep(steps.length > 0 ? 1 : "finish");
    } else if (typeof currentStep === "number") {
      setCurrentStep(currentStep < steps.length ? currentStep + 1 : "finish");
    }
  }

  function goToPrevious() {
    if (currentStep === "finish") {
      setCurrentStep(steps.length > 0 ? steps.length : "ings");
    } else if (typeof currentStep === "number") {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      } else if (screen === "mobile") {
        setCurrentStep("ings");
      }
    }
  }

  const canGoPrevious = currentStep !== "ings";
  const canGoNext = currentStep !== "finish";

  return (
    <main className="min-h-dvh mx-auto max-w-screen-xl py-4 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-4 z-10">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="rounded-full w-full h-14 flex gap-2 justify-between items-center border border-white/80 bg-white/60 backdrop-blur px-3 sm:px-4 py-2 shadow">
            {/* Back button */}
            <Link
              href={`/view/${slug}`}
              aria-label="Back to recipe"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white bg-linear-to-r from-slate-200 to-slate-300 shadow text-slate-700 hover:brightness-90 active:brightness-75"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Link>

            {/* Title */}
            <h1 className="text-2xl text-black font-semibold">{title}</h1>

            {/* Cook mode icon */}
            <div className="inline-flex items-center gap-2 rounded-full bg-linear-to-br from-orange-300 to-rose-300 text-rose-600 shadow px-3 py-1">
              <UtensilsCrossed size={18} aria-hidden />
              <span className="font-semibold">Cook Mode</span>
            </div>
          </div>
        </div>
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
                <IngredientText
                  key={i}
                  text={line}
                  stepText={
                    typeof currentStep === "number"
                      ? steps[currentStep - 1]
                      : undefined
                  }
                  size="sidebar"
                />
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
          {/* Ingredients panel (mobile only) */}
          {currentStep === "ings" && (
            <div className="mt-5 md:mt-0 rounded-3xl p-6 bg-white/90 border-white/40 shadow-xl text-stone-900 md:hidden">
              <h3 className="text-center text-sm font-semibold text-orange-800 border-b border-orange-200/70 pb-3">
                Prepare Ingredients
              </h3>

              {ingredients.length ? (
                <ul className="mt-4 space-y-1">
                  {ingredients.map((line, i) => (
                    <li key={i}>
                      <label className="group flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl hover:bg-orange-50 transition">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!checked[i]}
                          onChange={() =>
                            setChecked({ ...checked, [i]: !checked[i] })
                          }
                        />
                        {checked[i] ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-orange-400" />
                        )}
                        <span
                          className={`text-[15px] leading-6 ${
                            checked[i]
                              ? "text-stone-400 line-through"
                              : "text-stone-800"
                          }`}
                        >
                          {line}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-stone-700">
                  No ingredients found for this recipe yet.
                </p>
              )}
            </div>
          )}

          {/* Step panel */}
          {typeof currentStep === "number" && (
            <div className="mt-5 md:mt-0 rounded-3xl p-6 bg-white/90 shadow-xl border border-orange-100 text-stone-900">
              <div className="text-center border-b border-orange-200/60 pb-4">
                <p className="text-xs font-medium text-orange-700/80 mb-2">
                  Step {currentStep} of {steps.length}
                </p>
                <div className="h-1.5 w-full rounded-full bg-orange-100 overflow-hidden">
                  <div
                    className="h-1.5 bg-orange-500"
                    style={{
                      width: `${(currentStep / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <StepText
                text={steps[currentStep - 1]}
                keywords={ingredientKeywords}
              />
            </div>
          )}

          {/* Finish panel */}
          {currentStep === "finish" && (
            <div className="mt-5 md:mt-0 rounded-3xl p-8 bg-white/95 text-orange-950 shadow-2xl border border-orange-100 text-center">
              <div className="flex items-center justify-center gap-3 text-emerald-700">
                <BadgeCheck className="h-7 w-7" />
                <p className="text-sm font-semibold">Finished</p>
              </div>
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
            </div>
          )}
        </div>
      </section>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-screen-xl px-4 pb-4">
        <div className="rounded-full h-20 flex gap-2 justify-between items-center border border-white/80 bg-white/60 backdrop-blur px-3 sm:px-4 py-2 shadow">
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className="h-14 w-1/2 rounded-full text-lg font-semibold flex items-center justify-center gap-2 disabled:bg-white/60 disabled:text-orange-900/60 transition border border-white bg-linear-to-r from-slate-200 to-slate-300 shadow text-slate-700 hover:brightness-90 active:brightness-75"
          >
            <ChevronLeft className="h-5 w-5" /> Prev
          </button>

          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className="w-1/2 bg-linear-to-r from-orange-500 border border-white/70 to-rose-500 h-14 rounded-full text-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </main>
  );
}
