"use client";

import { useState, useMemo } from "react";
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
    <div>
      <label className="text-sm font-semibold">Tags</label>
      <div className="mt-2 flex flex-wrap gap-2">
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

      <div className={`${tags.length > 0 ? "mt-3" : "" } flex items-center gap-2`}>
        <input
          type="text"
          className="w-full rounded-2xl border border-slate-200 p-2 shadow-inner"
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
          className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-3 py-2 text-sm font-medium text-white cursor-pointer hover:brightness-90 active:brightness-75"
        >
          <TagIcon size={12} />
          Add
        </button>
      </div>
    </div>
  );
}