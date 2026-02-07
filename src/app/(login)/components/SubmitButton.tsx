"use client";

import { useFormStatus } from "react-dom";
import { Loader2, ChevronRight } from "lucide-react";

export function SubmitButton({ text, pendingText }: { text?: string; pendingText?: string }) {

  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-2xl bg-orange-600 px-4 py-3
        text-white text-lg font-bold flex items-center justify-center gap-4
        shadow-lg cursor-pointer
        transition hover:scale-105 hover:brightness-90 active:translate-y-0"
      aria-label={text}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          { pendingText }
        </>
      ) : (
        <>
          { text }
          <ChevronRight className="h-5 w-5" />
        </>
      )}
    </button>
  )
}