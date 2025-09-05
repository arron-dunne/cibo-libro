"use client";

import { ArrowRight } from "lucide-react";
import { useFormStatus } from "react-dom";

/**
 * Primary submit button used on the Import form.
 * Visuals match the large, rounded orange CTA in the mock.
 */
export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-live="polite"
      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 px-6 text-base font-semibold text-white shadow-[0_10px_24px_rgba(234,88,12,0.25)] transition active:translate-y-px disabled:opacity-60"
    >
      {pending ? "Importing…" : "Import"}
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
