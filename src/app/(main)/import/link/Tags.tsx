"use client";

import { useState } from "react";
import { Tag as TagIcon, X } from "lucide-react";


export function Tags() {

  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");

  function addTag(v: string) {
    const clean = v.trim();
    if (!clean) return;
    setTags((t) => (t.includes(clean) ? t : [...t, clean]));
    setInputTag("");
  }

  function removeTag(v: string) {
    setTags((t) => t.filter((x) => x !== v));
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <label className="text-sm font-semibold shrink-0">Tags</label>

      <div className="mt-1 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <div key={t} className="group flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-700 texts-sm">
              <span className="ml-1">{t}</span>
              <button
                type="button"
                onClick={() => removeTag(t)}
                aria-label={`Remove tag ${t}`}
                className="rounded-full p-0.5 cursor-pointer"
              >
                <X size={14} className="text-orange-700" />
              </button>
              <input type="hidden" name="tags" value={t} readOnly />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 shrink-0">
        <input
          type="text"
          className="w-full rounded-2xl border border-zinc-300 bg-white/95 p-2"
          placeholder='Add custom tags...'
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(inputTag);
            }
          }}
          aria-label="Add tag"
        />
        <button
          type="button"
          onClick={() => addTag(inputTag)}
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-slate-200 to-slate-300 border border-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-lg cursor-pointer hover:brightness-90 active:brightness-75"
        >
          <TagIcon size={12} />
          Add
        </button>
      </div>
    </div>
  );
}
