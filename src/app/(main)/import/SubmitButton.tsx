// app/(main)/import/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

/**
 * Reusable submit button that reflects server-action pending state.
 * Keeps UI simple and accessible.
 */
export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-live="polite"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(234,88,12,0.22)] disabled:opacity-60"
    >
      {pending && <Spinner className="h-4 w-4" />}
      {pending ? "Importing…" : "Import"}
    </button>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
      <path d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" fill="currentColor" className="opacity-90" />
    </svg>
  );
}
