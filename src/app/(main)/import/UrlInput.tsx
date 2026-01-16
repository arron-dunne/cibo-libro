"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, ClipboardPaste } from "lucide-react";
import { useRef } from "react";


export function UrlInput() {

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full flex gap-4 items-center">
      <div className="w-full flex gap-4 items-center justify-between px-5 py-3 rounded-full overflow-hidden
            border border-gray-200 bg-white text-lg text-gray-900 placeholder:text-gray-400
            focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-solid"
      >
        <button type="button" title="Paste from clipboard" className="cursor-pointer" 
          onClick={async () => {
            const text = await navigator.clipboard.readText();
            if (!inputRef.current) return;
            inputRef.current.value = text;
            inputRef.current.focus();
          }}
        >
          <ClipboardPaste size={24} />
        </button>
        <input
          ref={inputRef}
          id="url"
          name="url"
          type="url"
          required
          inputMode="url"
          placeholder="https://example.com/best-lasagne-ever"
          pattern="https?://.+"
          autoFocus
          maxLength={2000}
          className="w-full focus:outline-0"
        />
      </div>
      <SubmitButton />
    </div>
  )
}


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-live="polite"
      className="m-1 inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-700 active:translate-y-px"
    >
      {pending ? "Importing…" : "Import"}
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}