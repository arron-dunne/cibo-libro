"use client";

import { useActionState } from "react";
import { updatePassword } from "./actions";
import { LoaderCircle } from "lucide-react";
import { SubmitButton } from "../components/SubmitButton";

export function ResetPasswordForm({ token }: { token: string }) {
  const [formState, formAction, isSubmitting] = useActionState(updatePassword, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-4 text-start">
      {/* Status */}
      {formState.error && <div>{formState.error}</div>}
      {/* Hidden token input */}
      <input name="token" hidden readOnly value={token} />

      <label htmlFor="password" className="text-sm font-semibold">
        New Password
      </label>
      <input
        name="password"
        type="password"
        id="password"
        required
        className="mt-1 px-4 py-3 w-full rounded-2xl border bg-white
                outline-none focus:ring-2 border-zinc-300 focus:ring-blue-500"
      />

      <label htmlFor="confirm" className="text-sm font-semibold">
        Confirm New Password
      </label>
      <input
        name="confirm"
        type="password"
        id="confirm"
        required
        className="mt-1 px-4 py-3 w-full rounded-2xl border bg-white
                outline-none focus:ring-2 border-zinc-300 focus:ring-blue-500"
      />

      <SubmitButton text="Reset Password" pendingText="Resetting" />
      
    </form>
  );
}
