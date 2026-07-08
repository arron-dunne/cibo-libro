"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { PrimaryButton } from "@/app/components/buttons/Buttons";

export function SubmitButton({
  text,
  pendingText,
}: {
  text?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <PrimaryButton type="submit" width="w-full" size="lg" disabled={pending}>
      {pending ? (
        <>
          {pendingText}
          <Loader2 size={28} className="animate-spin" />
        </>
      ) : (
        <>{text}</>
      )}
    </PrimaryButton>
  );
}
