"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { exportRecipes } from "./actions";
import { ArrowUpFromLine, Loader2, X } from "lucide-react";

type Format = "json" | "markdown";

export default function ExportRecipesModal() {
  const [dialog, setDialog] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [format, setFormat] = useState<Format>("json");
  const [isPending, startTransition] = useTransition();

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (!dialog) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setDialog(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog]);

  function handleExport() {
    startTransition(async () => {
      const { content, filename } = await exportRecipes(format);
      const mimeType = format === "json" ? "application/json" : "text/markdown";
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setDialog(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setDialog(true)}
        className="w-full rounded-full bg-linear-to-br from-slate-100 to-slate-200 border border-slate-300 px-4 py-3 font-semibold text-slate-800 cursor-pointer hover:brightness-90 active:brightness-75"
      >
        Export Recipes
      </button>

      {hasMounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition duration-200 ${dialog ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            aria-hidden={!dialog}
          >
            <div
              className="relative w-full max-w-md rounded-3xl bg-orange-50 p-6 text-center shadow-xl"
              role="dialog"
              aria-modal="true"
            >
              <button
                onClick={() => setDialog(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                disabled={isPending}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-100 to-rose-100 text-rose-500">
                <ArrowUpFromLine size={28} />
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                Export Recipes
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Download all your recipes in your preferred format.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setFormat("json")}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 font-semibold transition-colors cursor-pointer ${
                    format === "json"
                      ? "border-orange-400 bg-orange-100 text-orange-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="text-base font-bold">JSON</div>
                  <div className="text-xs mt-0.5 font-normal opacity-70">
                    Structured data
                  </div>
                </button>
                <button
                  onClick={() => setFormat("markdown")}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 font-semibold transition-colors cursor-pointer ${
                    format === "markdown"
                      ? "border-orange-400 bg-orange-100 text-orange-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="text-base font-bold">Markdown</div>
                  <div className="text-xs mt-0.5 font-normal opacity-70">
                    Human-readable
                  </div>
                </button>
              </div>

              <button
                onClick={handleExport}
                disabled={isPending}
                className="mt-4 w-full rounded-full bg-linear-to-br from-orange-500 to-rose-500 cursor-pointer px-4 py-3 font-bold text-lg text-white shadow hover:brightness-95 active:brightness-75 disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    Preparing export...
                    <Loader2 size={20} className="animate-spin" />
                  </span>
                ) : (
                  "Download"
                )}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
