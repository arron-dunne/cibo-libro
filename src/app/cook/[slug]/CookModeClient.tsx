"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Circle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Pencil,
  X,
  Settings,
} from "lucide-react";
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from "@/app/components/buttons/Buttons";
import { Header } from "@/app/components/text/Headers";
import { Modal } from "@/app/components/Modal";
import Toggle from "@/app/components/Toggle";

interface CookModeClientProps {
  slug: string;
  title: string;
  ingredients: string[];
  steps: string[];
}

type StepType = "prepare" | "finish" | number;
type WakeLockState = "on" | "off" | "unavailable";

export default function CookModeClient({
  slug,
  title,
  ingredients,
  steps,
}: CookModeClientProps) {
  const [currentStep, setCurrentStep] = useState<StepType>("prepare");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [wakeLock, setWakeLock] = useState<WakeLockState>("on");
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const [showSettings, setShowSettings] = useState(false);

  const [showIngredientsSidebar, setShowIngredientsSidebar] =
    useState<boolean>(false);

  useEffect(() => {
    if (wakeLock === "unavailable") return;

    if (!("wakeLock" in navigator)) {
      setWakeLock("unavailable");
      return;
    }

    if (wakeLock === "off") {
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
      return;
    }

    let cancelled = false;
    let requesting = false;

    async function requestWakeLock() {
      if (
        requesting ||
        document.visibilityState !== "visible" ||
        (wakeLockRef.current && !wakeLockRef.current.released)
      ) {
        return;
      }

      requesting = true;

      try {
        const sentinel = await navigator.wakeLock.request("screen");

        if (cancelled) {
          await sentinel.release();
          return;
        }

        wakeLockRef.current = sentinel;
        sentinel.addEventListener("release", () => {
          if (wakeLockRef.current === sentinel) wakeLockRef.current = null;
        });
      } catch {
        if (!cancelled) setWakeLock("unavailable");
      } finally {
        requesting = false;
      }
    }

    if (document.visibilityState === "visible") requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, [wakeLock]);

  function toggleWakeLock() {
    setWakeLock((current) =>
      current === "on" ? "off" : current === "off" ? "on" : current,
    );
  }

  const currentStepText =
    typeof currentStep === "number" ? steps[currentStep - 1] : null;

  // Navigation handlers
  const canGoPrevious = currentStep !== "prepare";
  const canGoNext = currentStep !== "finish";

  function goToPrevious() {
    if (currentStep === "finish") {
      setCurrentStep(steps.length > 0 ? steps.length : "prepare");
    } else if (typeof currentStep === "number") {
      setCurrentStep(currentStep > 1 ? currentStep - 1 : "prepare");
    }
  }

  function goToNext() {
    if (currentStep === "prepare") {
      setCurrentStep(steps.length > 0 ? 1 : "finish");
    } else if (typeof currentStep === "number") {
      setCurrentStep(currentStep < steps.length ? currentStep + 1 : "finish");
    }
  }

  // Keyboard handlers
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSidebar();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Settings handler
  function openSettings() {
    setShowSettings(true);
  }

  function closeSettings() {
    setShowSettings(false);
  }

  // Ingredients sidebar handlers
  function closeSidebar() {
    setShowIngredientsSidebar(false);
  }

  function toggleShowIngredientsSidebar() {
    setShowIngredientsSidebar(!showIngredientsSidebar);
  }

  return (
    <main className="relative w-full h-dvh overflow-hidden">
      {showIngredientsSidebar && (
        <IngredientsSidebar
          ingredients={ingredients}
          closeSidebar={closeSidebar}
        />
      )}

      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          closeModal={closeSettings}
          wakeLock={wakeLock}
          toggleWakeLock={toggleWakeLock}
        />
      )}

      <div className="w-full h-full mx-auto max-w-7xl px-4 py-4 sm:py-8 flex flex-col gap-8 md:gap-12 justify-between">
        {/* Header */}
        <header className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_auto_1fr_auto] gap-4">
          <BackButton slug={slug} />

          <SettingsButton openSettings={openSettings} />

          <Header
            textSize="text-3xl sm:text-5xl"
            className="row-start-1 col-start-1 col-span-3 sm:col-start-3 sm:col-span-1 text-center truncate"
          >
            {title}
          </Header>

          <IngredientsButton toggleSidebar={toggleShowIngredientsSidebar} />
        </header>

        {/* Main content area */}
        <section className="relative w-full max-w-3xl mx-auto px-4 overflow-auto flex-1 flex justify-center items-center">
          {/* Prepare Ingredients step */}
          {currentStep === "prepare" && (
            <div className="w-max h-max">
              {ingredients.length ? (
                <ul className="space-y-6">
                  {ingredients.map((line, i) => (
                    <li key={i}>
                      <label className="flex items-center gap-4 cursor-pointer hover:text-stone-400">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!checked[i]}
                          onChange={() =>
                            setChecked({ ...checked, [i]: !checked[i] })
                          }
                        />
                        {checked[i] ? (
                          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-orange-600" />
                        )}
                        <span
                          className={`text-lg sm:text-xl ${
                            checked[i] ? "text-stone-400" : ""
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
              {/* Step panel */}
              <p className="text-center text-3xl/12 tracking-normal text-black">
                {currentStepText}
              </p>
            </div>
          )}

          {/* Finish panel */}
          {currentStep === "finish" && (
            <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
              <Image
                src="/icons/food.png"
                alt="serving plate"
                width={512}
                height={512}
                className="w-32"
              />

              <h2 className="text-3xl">Bon Appétit!</h2>

              <div className="w-full flex flex-col gap-4 md:flex-row md:max-w-xl">
                <Link href="/all" className="w-full">
                  <PrimaryButton type="button" size="lg" width="w-full">
                    <ArrowLeft className="h-6 w-6" />
                    Back to cookbook
                  </PrimaryButton>
                </Link>
                <Link href={`/edit/${slug}`} className="w-full">
                  <SecondaryButton type="button" size="lg" width="w-full">
                    <Pencil className="h-6 w-6" />
                    Edit this recipe
                  </SecondaryButton>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Bottom navigation */}
        <nav className="max-w-72 w-full mx-auto pb-4 flex gap-4 items-center justify-between">
          {currentStep === "prepare" ? (
            <div className="size-12 opacity-0 shrink-0" />
          ) : (
            <PrimaryButton
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              size="custom"
              height="h-12"
              width="w-12"
              className="shrink-0"
            >
              <ChevronLeft size={20} />
            </PrimaryButton>
          )}

          <div className="text-2xl font-semibold text-black">
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

          {currentStep === "finish" ? (
            <div className="size-12 opacity-0 shrink-0" />
          ) : (
            <PrimaryButton
              onClick={goToNext}
              disabled={!canGoNext}
              size="custom"
              height="h-12"
              width="w-12"
              className="shrink-0"
            >
              <ChevronRight className="h-5 w-5" />
            </PrimaryButton>
          )}
        </nav>
      </div>
    </main>
  );
}

function IngredientsSidebar({
  ingredients,
  closeSidebar,
}: {
  ingredients: string[];
  closeSidebar: () => void;
}) {
  return (
    <div className="absolute right-0 top-0 max-w-sm w-full h-full z-10 bg-white p-8">
      <div className="w-full flex justify-end">
        <TertiaryButton underline={false} onClick={closeSidebar}>
          <X size={32} />
        </TertiaryButton>
      </div>
      <h2 className="mt-4 text-2xl font-bold">Ingredients</h2>
      <ul className="mt-4 space-y-2">
        {ingredients.map((ing, i) => (
          <li key={`ing-${i}`} className="flex gap-4 text-md">
            <div className="z-10 h-2 w-2 mt-2 shrink-0 rounded-full bg-linear-to-r from-orange-500 to-rose-500" />
            {ing}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BackButton({ slug }: { slug: string }) {
  return (
    <Link
      href={`/view/${slug}`}
      aria-label="Back to recipe"
      className="col-start-1 row-start-2 sm:row-start-1"
    >
      <SecondaryButton width="w-10.5 sm:w-max" height="h-10.5">
        <ArrowLeft size={20} />
        <span className="hidden sm:block">Back</span>
      </SecondaryButton>
    </Link>
  );
}

function SettingsButton({
  openSettings,
}: {
  openSettings: () => void;
}) {
  return (
    <SecondaryButton
      width="w-10.5"
      height="h-10.5"
      size="custom"
      className="col-start-3 row-start-2 sm:row-start-1 sm:col-start-2"
      onClick={openSettings}
    >
      <Settings size={22} />
    </SecondaryButton>
  );
}

function IngredientsButton({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <SecondaryButton
      width="w-full sm:w-max"
      className="row-start-2 col-start-2 sm:row-start-1 sm:col-start-4"
      onClick={toggleSidebar}
    >
      Ingredients
    </SecondaryButton>
  );
}

function SettingsModal({
  isOpen,
  closeModal,
  wakeLock,
  toggleWakeLock,
}: {
  isOpen: boolean;
  closeModal: () => void;
  wakeLock: WakeLockState;
  toggleWakeLock: () => void;
}) {
  return (
    <Modal isOpen={isOpen} closeModal={closeModal} header="Settings">
      <div className="flex justify-between">
        Screen Lock
        <div className="flex flex-col items-end gap-1">
          <Toggle
            isOn={wakeLock === "on"}
            toggle={toggleWakeLock}
            disabled={wakeLock === "unavailable"}
          />
          {wakeLock === "unavailable" && (
            <span className="text-sm text-neutral-500">
              Wake lock unavailable
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}
