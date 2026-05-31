"use client";

import {
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/buttons/Buttons";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import { startTransition, useState } from "react";
import { exportRecipes } from "./actions";

type Format = "json" | "markdown";

export function ExportRecipes() {
  const [format, setFormat] = useState<Format>("json");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  function handleExport() {
    setIsExporting(true);
    startTransition(async () => {
      console.log(format)
      const { content, filename } = await exportRecipes(format);
      const mimeType = format === "json" ? "application/json" : "text/markdown";
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
    });
  }

  return (
    <section className="rounded-3xl bg-white p-8">
      <div className="mb-4 flex gap-4 items-center">
        <ArrowUpFromLine size={28} className="shrink-0 text-rose-600" />
        <h2 className="text-2xl font-semibold text-slate-800">
          Export Recipes
        </h2>
      </div>
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
        Download all your recipes as a file you can keep, share, or import
        elsewhere.
      </p>

      <div className="mt-6 flex gap-8 items-start text-slate-800">
        <div>Format:</div>
        <div className="space-y-4">
          <div className="flex gap-4" onClick={() => setFormat("json")}>
            <input
              type="radio"
              id="json"
              name="format"
              value="json"
              defaultChecked
            />
            <label htmlFor="json">
              <b>JSON</b> (best for portability)
            </label>
          </div>
          <div className="flex gap-4" onClick={() => setFormat("markdown")}>
            <input
              type="radio"
              id="markdown"
              name="format"
              value="markdown"
            />
            <label htmlFor="markdown">
              <b>Markdown</b> (best for readability)
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <PrimaryButton type="button" width="w-full" onClick={handleExport}>
          {isExporting ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            "Export Recipes"
          )}
        </PrimaryButton>
        {/* <ExportRecipesModal /> */}
      </div>
    </section>
  );
}
