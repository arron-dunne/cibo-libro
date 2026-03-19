"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { extractIngredientKeyword } from "@/lib/ingredients/extractKeywords";

interface IngredientTextProps {
  text: string;
  size?: "full" | "sidebar";
  stepText?: string;
}

export function IngredientText({
  text,
  size = "full",
  stepText,
}: IngredientTextProps) {
  const [checked, setChecked] = useState<boolean>(false);

  function ingredientUsedInStep(ingredient: string, stepText: string): boolean {
    const keyword = extractIngredientKeyword(ingredient);
    if (!keyword) return false;
    const regex = new RegExp(keyword, "i");
    return regex.test(stepText);
  }

  const active = stepText ? ingredientUsedInStep(text, stepText) : false;

  const baseSize =
    size === "full" ? "text-base leading-6" : "text-[15px] leading-6";

  let textClass = "text-stone-800";
  if (checked) textClass = "text-stone-400 line-through";
  else if (active) textClass = "text-orange-900 font-bold";

  return (
    <li>
      <label
        className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 transition ${active ? "bg-orange-200" : ""}`}
      >


        {/* text */}
        <span
          className={`${baseSize} ${textClass} transition-colors duration-300`}
        >
          {text}
        </span>
      </label>
    </li>
  );
}
