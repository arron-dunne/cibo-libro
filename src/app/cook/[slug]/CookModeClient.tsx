"use client";

import Link from "next/link";
import { useState } from "react";
import { extractIngredientKeyword } from "@/lib/ingredients/extractKeywords";
import { StepText } from "./components/StepText";
import {
  ArrowLeft,
  Circle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ChevronDown,
  CookingPot,
} from "lucide-react";

interface CookModeClientProps {
  slug: string;
  title: string;
  ingredients: string[];
  steps: string[];
}

type StepType = "ings" | "finish" | number;

export default function CookModeClient({
  slug,
  title,
  ingredients,
  steps,
}: CookModeClientProps) {
  const [currentStep, setCurrentStep] = useState<StepType>("ings");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [ingredientsOpen, setIngredientsOpen] = useState(false);

  const ingredientKeywords = ingredients
    .map(extractIngredientKeyword)
    .filter(Boolean) as string[];

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
      setCurrentStep(currentStep > 1 ? currentStep - 1 : "ings");
    }
  }

  const canGoPrevious = currentStep !== "ings";
  const canGoNext = currentStep !== "finish";

  return (
    <main className="min-h-dvh mx-auto max-w-7xl px-4 py-8 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-4 z-10 flex items-center justify-between gap-3">
        <Link
          href={`/view/${slug}`}
          aria-label="Back to recipe"
          className="shrink-0 w-max flex items-center gap-3 text-xl font-semibold text-slate-900 cursor-pointer hover:brightness-90 active:brightness-75"
        >
          <div className="p-2 rounded-full border border-white/80 bg-linear-to-br from-slate-200 to-slate-300 shadow-lg">
            <ArrowLeft size={20} />
          </div>
          Back
        </Link>

        <h1
          className="text-5xl font-black text-white truncate"
          style={{ WebkitTextStroke: "6px black", paintOrder: "stroke fill" }}
        >
          {title}
        </h1>

        <div className="hidden sm:flex gap-2 shrink-0 items-center rounded-full bg-white/60 border border-white/80 text-black shadow px-4 py-2">
          <CookingPot size={24} className="text-rose-500" aria-hidden />
          <span className="text-lg font-semibold">Cook Mode</span>
        </div>
      </header>

      {/* Main content area */}
      <section className="w-full max-w-4xl mx-auto flex-1 pt-8">
        {/* Prepare Ingredients step */}
        {currentStep === "ings" && (
          <div className="w-full max-w-2xl mx-auto rounded-4xl border border-white/60 bg-white shadow-xl text-gray-900 overflow-hidden">
            <h2 className="pt-6 pb-4 text-2xl font-bold text-black text-center">
              Prepare Ingredients
            </h2>

            {ingredients.length ? (
              <ul className="px-4 pb-4 space-y-0.5">
                {ingredients.map((line, i) => (
                  <li key={i}>
                    <label className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-2xl hover:bg-orange-50 transition-colors">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={!!checked[i]}
                        onChange={() =>
                          setChecked({ ...checked, [i]: !checked[i] })
                        }
                      />
                      {checked[i] ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-orange-300" />
                      )}
                      <span
                        className={`text-base leading-6 ${
                          checked[i]
                            ? "text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {line}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-8 pb-8 text-sm text-gray-500 text-center">
                No ingredients found for this recipe.
              </p>
            )}
          </div>
        )}

        {/* Step view — sidebar + step panel */}
        {typeof currentStep === "number" && (
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Mobile ingredients dropdown */}
            <div className="sm:hidden">
              <button
                onClick={() => setIngredientsOpen((o) => !o)}
                className="w-full flex items-center justify-between px-6 py-3 rounded-full border border-white/70 font-semibold text-slate-700 bg-linear-to-r from-slate-200 to-slate-300 cursor-pointer transition hover:brightness-90 active:brightness-75"
              >
                <span>Ingredients</span>
                <ChevronDown
                  size={16}
                  className={`text-zinc-500 transition-transform ${ingredientsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {ingredientsOpen && ingredients.length > 0 && (
                <div className="relative -z-10 -top-6 mx-2 -mb-4 pt-10 pb-8 px-6 rounded-bl-3xl rounded-br-3xl bg-white shadow">
                  <ul className="space-y-4">
                    {ingredients.map((line, i) => (
                      <li key={i} className="flex gap-2 text-stone-800">
                        <div className="h-2 w-2 mt-2 shrink-0 rounded-full bg-orange-400" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Desktop ingredients sidebar */}
            <div className="hidden sm:block h-max sm:w-[38%] rounded-4xl border border-white/60 bg-white shadow-xl text-gray-900 overflow-hidden">
              <h3 className="px-6 pt-8 pb-5 text-2xl font-semibold text-black text-center">
                Ingredients
              </h3>
              {ingredients.length ? (
                <ul className="px-6 pb-6 space-y-1 list-disc list-inside">
                  {ingredients.map((line, i) => (
                    <li key={i} className="text-[15px] leading-6 text-stone-800">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-6 pb-8 text-sm text-gray-500 text-center">
                  No ingredients found.
                </p>
              )}
            </div>

            {/* Step panel */}
            <div className="h-max mx-2 sm:mx-0 sm:w-[62%] rounded-4xl border border-white/60 bg-white shadow-xl text-gray-900 overflow-hidden">
              <div className="px-8 pt-8 pb-5">
                <div className="flex items-end justify-center gap-2">
                  <h3 className="text-2xl font-semibold text-black">
                    Step {currentStep}
                  </h3>
                  <span className="text-sm font-medium text-gray-400 mb-0.5">
                    of {steps.length}
                  </span>
                </div>
                <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-linear-to-r from-orange-500 to-rose-500"
                    style={{
                      width: `${(currentStep / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="px-8 pb-8">
                <StepText
                  text={steps[currentStep - 1]}
                  keywords={ingredientKeywords}
                />
              </div>
            </div>
          </div>
        )}

        {/* Finish panel */}
        {currentStep === "finish" && (
          <div className="max-w-2xl mx-auto rounded-4xl border border-white/60 bg-white shadow-xl text-gray-900 text-center p-10">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg mx-auto">
              <BadgeCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              Bon appétit!
            </h2>
            <p className="mt-2 text-gray-500">
              You&apos;ve completed all the steps. Enjoy your meal.
            </p>
            <Link
              href={`/view/${slug}`}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-br from-orange-500 to-rose-500 text-white border border-white/40 shadow px-6 py-3 font-bold hover:brightness-90 active:brightness-75"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to recipe
            </Link>
          </div>
        )}
      </section>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 max-w-7xl mx-auto">
        <div className="rounded-full h-18 flex gap-2 items-center border border-white/60 bg-white/70 backdrop-blur-md px-2 shadow-lg">
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className="h-12 w-1/2 rounded-full font-bold flex items-center justify-center gap-1.5 bg-linear-to-br from-slate-100 to-slate-200 border border-white/60 shadow text-slate-700 hover:brightness-90 active:brightness-75 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" /> Prev
          </button>

          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className="h-12 w-1/2 rounded-full font-bold flex items-center justify-center gap-1.5 bg-linear-to-br from-orange-500 to-rose-500 border border-white/40 shadow text-white hover:brightness-90 active:brightness-75 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </main>
  );
}
