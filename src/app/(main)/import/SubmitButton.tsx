"use client";

import { ArrowRight } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-live="polite"
      className="m-1 inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-700 active:translate-y-px"
    >
      {pending ? "Importing…" : "Import"}
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
