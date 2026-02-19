"use client";

import { useActionState } from "react";
import { updatePassword } from "./actions";
import { LoaderCircle } from "lucide-react";

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
      <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
        New Password
      </label>
      <input
        name="password"
        type="password"
        className="w-full rounded-2xl bg-white px-4 py-3 shadow-inner"
        required
      />

      <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
        Confirm New Password
      </label>
      <input
        name="confirm"
        type="password"
        className="w-full rounded-2xl bg-white/70 px-4 py-3 shadow-inner"
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex justify-center items-center mt-2 w-full h-12 rounded-full bg-linear-to-br from-orange-500 to-rose-500 cursor-pointer font-bold text-lg text-white shadow hover:brightness-95 active:brightness-75 disabled:opacity-50"
      >
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" size={24} />
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
}
