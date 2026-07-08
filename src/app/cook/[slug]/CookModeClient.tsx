"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { extractIngredientKeyword } from "@/lib/ingredients/extractKeywords";
import { StepText } from "./components/StepText";
import { HighlightToggle } from "./components/HighlightToggle";
import {
  ArrowLeft,
  Circle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CookingPot,
  Pencil,
} from "lucide-react";
import {
  SecondaryButton,
  TertiaryButton,
} from "@/app/components/buttons/Buttons";
import { sansita } from "@/app/fonts";
import { Header } from "@/app/components/text/Headers";

interface CookModeClientProps {
  slug: string;
  title: string;
  ingredients: string[];
  steps: string[];
}

type StepType = "prepare" | "finish" | number;

export default function CookModeClient({
  slug,
  title,
  ingredients,
  steps,
}: CookModeClientProps) {
  const [currentStep, setCurrentStep] = useState<StepType>("prepare");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  let progress: number;
  if (currentStep === "prepare") progress = 0;
  else if (currentStep === "finish") progress = 1;
  else progress = currentStep / (steps.length + 1);

  useEffect(() => {
    if (!("wakeLock" in navigator)) return;

    async function requestWakeLock() {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        setWakeLockActive(true);
        wakeLockRef.current.addEventListener("release", () =>
          setWakeLockActive(false),
        );
      } catch {
        setWakeLockActive(false);
      }
    }

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release();
    };
  }, []);

  const ingredientKeywords = ingredients
    .map(extractIngredientKeyword)
    .filter(Boolean) as string[];

  const currentStepText =
    typeof currentStep === "number" ? steps[currentStep - 1] : null;

  const activeIngredients = new Set(
    ingredients.flatMap((ing, i) => {
      const kw = extractIngredientKeyword(ing);
      if (!kw || !currentStepText) return [];
      return new RegExp(kw, "i").test(currentStepText) ? [i] : [];
    }),
  );

  function goToNext() {
    if (currentStep === "prepare") {
      setCurrentStep(steps.length > 0 ? 1 : "finish");
    } else if (typeof currentStep === "number") {
      setCurrentStep(currentStep < steps.length ? currentStep + 1 : "finish");
    }
  }

  function goToPrevious() {
    if (currentStep === "finish") {
      setCurrentStep(steps.length > 0 ? steps.length : "prepare");
    } else if (typeof currentStep === "number") {
      setCurrentStep(currentStep > 1 ? currentStep - 1 : "prepare");
    }
  }

  const canGoPrevious = currentStep !== "prepare";
  const canGoNext = currentStep !== "finish";

  return (
    <main className="h-dvh overflow-hidden mx-auto max-w-7xl px-4 py-4 sm:py-8 text-white flex flex-col gap-8 justify-between">
      {/* Header */}
      <header className="flex flex-col gap-3">
        {/* Desktop header */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          <Link href={`/view/${slug}`} aria-label="Back to recipe">
            <TertiaryButton type="button">
              <ArrowLeft size={20} />
              Back
            </TertiaryButton>
          </Link>
          <Header className="truncate">{title}</Header>
          <div className="flex gap-2.5 shrink-0 items-center rounded-full bg-white/60 border border-white/80 text-black shadow px-4 py-2">
            {wakeLockActive ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            ) : (
              <span className="inline-flex rounded-full h-2.5 w-2.5 bg-zinc-300" />
            )}
            <span className="text-base font-semibold">Screen Awake</span>
          </div>
        </div>

        {/* Mobile header */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/view/${slug}`}
              aria-label="Back to recipe"
              className="shrink-0 w-max flex items-center gap-2 text-base font-semibold text-slate-900 cursor-pointer hover:brightness-90 active:brightness-75"
            >
              <div className="p-2 rounded-full border border-white/80 bg-linear-to-br from-slate-200 to-slate-300 shadow-lg">
                <ArrowLeft size={18} />
              </div>
              Back
            </Link>
            <div className="flex gap-2 shrink-0 items-center rounded-full bg-white/60 border border-white/80 text-black shadow px-3 py-1.5">
              {wakeLockActive ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              ) : (
                <span className="inline-flex rounded-full h-2.5 w-2.5 bg-zinc-300" />
              )}
              <span className="text-sm font-semibold">Screen Awake</span>
            </div>
          </div>
          <h1
            className="mt-4 text-4xl font-black text-white text-center"
            style={{ WebkitTextStroke: "4px black", paintOrder: "stroke fill" }}
          >
            {title}
          </h1>
        </div>
      </header>

      {/* Main content area */}
      <section className="w-full max-w-5xl mx-auto overflow-scroll flex-1">
        {/* Prepare Ingredients step */}
        {currentStep === "prepare" && (
          <div className="w-full max-w-2xl mx-auto">
            {ingredients.length ? (
              <ul className="space-y-1">
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
                          checked[i] ? "text-gray-400" : "text-black"
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
          <div className="h-full flex items-center">
            {/* Mobile ingredients dropdown */}
            {/* <div className="sm:hidden">
              <button
                onClick={() => setIngredientsOpen((o) => !o)}
                className="relative z-10 w-full flex items-center justify-between px-6 py-3 rounded-full border border-white/70 font-semibold text-slate-700 bg-linear-to-r from-slate-200 to-slate-300 cursor-pointer transition hover:brightness-90 active:brightness-75"
              >
                <span>Ingredients</span>
                <ChevronDown
                  size={16}
                  className={`text-zinc-500 transition-transform ${ingredientsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {ingredientsOpen && ingredients.length > 0 && (
                <div className="relative -top-6 mx-2 -mb-4 pt-10 pb-8 px-6 rounded-bl-3xl rounded-br-3xl bg-white shadow">
                  <ul className="space-y-1">
                    {ingredients.map((line, i) => (
                      <li
                        key={i}
                        className={`text-black flex gap-2 items-center rounded-lg px-3 py-1 ${highlightEnabled && activeIngredients.has(i) ? "bg-linear-to-r from-orange-100 to-rose-100 font-bold" : ""}`}
                      >
                        <div className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <HighlightToggle
                    enabled={highlightEnabled}
                    onToggle={() => setHighlightEnabled((h) => !h)}
                    className="z-10 mt-4"
                  />
                </div>
              )}
            </div> */}

            {/* Desktop ingredients sidebar */}
            {/* <div className="hidden sm:block h-max sm:w-[33%] rounded-4xl border border-white/60 bg-white shadow-xl text-gray-900 overflow-hidden">
              <h3 className="px-6 pt-8 pb-5 text-2xl font-semibold text-black text-center">
                Ingredients
              </h3>
              {ingredients.length ? (
                <>
                  <ul className="px-3 space-y-1">
                    {ingredients.map((line, i) => (
                      <li
                        key={i}
                        className={`flex gap-2 items-center rounded-lg px-3 py-1 ${highlightEnabled && activeIngredients.has(i) ? "bg-linear-to-r from-orange-100 to-rose-100 font-bold" : ""}`}
                      >
                        <div className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <HighlightToggle
                    enabled={highlightEnabled}
                    onToggle={() => setHighlightEnabled((h) => !h)}
                    className="px-6 py-4"
                  />
                </>
              ) : (
                <p className="px-6 pb-8 text-sm text-gray-500 text-center">
                  No ingredients found.
                </p>
              )}
            </div> */}

            {/* Step panel */}
            <StepText
              text={steps[currentStep - 1]}
              keywords={ingredientKeywords}
            />
          </div>
        )}

        {/* Finish panel */}
        {currentStep === "finish" && (
          <div className="max-w-2xl mx-auto rounded-4xl border border-white/60 bg-white shadow-xl text-gray-900 text-center px-10 pt-10 pb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-100 to-rose-100 text-rose-500">
              <CookingPot size={28} />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Enjoy your meal!
            </h2>
            <p className="mt-2 text-gray-500">
              All steps done — now comes the best part.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/all"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500 px-4 py-3 text-base font-semibold text-white hover:brightness-95 active:brightness-75"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to cookbook
              </Link>
              <Link
                href={`/edit/${slug}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-br from-slate-100 to-slate-200 border border-slate-300 px-4 py-3 text-base font-semibold text-slate-800 hover:brightness-90 active:brightness-75"
              >
                <Pencil className="h-4 w-4" />
                Edit this recipe
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Bottom navigation */}
      <nav className="pb-8 h-18 z-10">
        <div className="mb-4 h-1.5 w-full max-w-lg mx-auto rounded-full bg-white overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-linear-to-r from-orange-500 to-rose-500"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </div>
        <div className="w-72 mx-auto flex gap-4 items-center justify-between">
          <SecondaryButton
            type="button"
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            size="custom"
            height="h-12"
            width="w-12"
          >
            <ChevronLeft size={20} />
          </SecondaryButton>
          <div className="text-lg sm:text-2xl font-semibold text-black">
            {currentStep === "prepare" ? (
              <>Ingredients</>
            ) : currentStep === "finish" ? (
              <>Finished</>
            ) : (
              <div className="flex items-end justify-center gap-2">
                <span>Step {currentStep}</span>
                <span className="text-base font-medium mb-0.5">
                  of {steps.length}
                </span>
              </div>
            )}
          </div>
          <SecondaryButton
            type="button"
            onClick={goToNext}
            disabled={!canGoNext}
            size="custom"
            height="h-12"
            width="w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </SecondaryButton>
        </div>
      </nav>
    </main>
  );
}
