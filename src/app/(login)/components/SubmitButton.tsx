"use client";

import { useFormStatus } from "react-dom";
import { Loader2, ChevronRight } from "lucide-react";

export function SubmitButton({
  text,
  pendingText,
}: {
  text?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  // const pending = true;

  return (
    <button
      className={`w-full rounded-full bg-linear-to-br from-orange-500 to-rose-500 py-3
        text-white text-xl font-bold flex items-center justify-center gap-2 shadow-lg
                ${
          pending
            ? "cursor-wait brightness-90"
            : "hover:brightness-90 active:brightness-75 cursor-pointer"
        }`}
      aria-label={text}
      disabled={pending}
    >
      {pending ? (
        <>
          {pendingText}
          <Loader2 size={20} className="animate-spin" />
        </>
      ) : (
        <>
          {text}
          <ChevronRight size={24} />
        </>
      )}
    </button>
  );
}
