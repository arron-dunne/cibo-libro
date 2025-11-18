"use client";

import { useState, FormEvent, useActionState } from "react";
import { changePassword } from "./actions";
import { KeyRound, X } from "lucide-react";

export default function ChangePasswordModal() {
  
  const [dialog, setDialog] = useState<boolean>(false);

  const [formState, formAction, isSubmitting] = useActionState(changePassword, { error: null })

  // async function handleSubmit(e: FormEvent) {
  //   e.preventDefault();
  //   setError("");
  //   setSuccess("");

  //   if (next !== confirm) {
  //     setError("New passwords don’t match.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await changePassword(current, next);   // CALL SERVER ACTION
  //     setLoading(false);

  //     setSuccess("Password updated. You will be logged out everywhere.");
  //     setTimeout(() => setDialog(false), 1500);
  //   } catch (err: any) {
  //     setLoading(false);
  //     setError(err.message || "Something went wrong");
  //   }
  // }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setDialog(true)}
        className="mt-1 bg-linear-to-br from-orange-500 to-rose-500 rounded-full px-4 py-3 font-bold shadow text-white cursor-pointer hover:brightness-95 active:brightness-75"
      >
        Change Password
      </button>

      {/* Modal */}
      {dialog && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Panel */}
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-xl"
            role="dialog"
            aria-modal="true"
          >

            {/* Close button */}
            <button
              onClick={() => setDialog(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-rose-100 text-rose-500">
              <KeyRound size={28} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">Change Password</h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your current password and choose a new one.
            </p>

            <form action={formAction} className="space-y-4 text-start">
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Current Password
              </label>
              <input
                name="currentPassword"
                type="password"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-orange-400 focus:outline-none"
                required
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                name="newPassword"
                type="password"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-orange-400 focus:outline-none"
                required
                minLength={8}
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-orange-400 focus:outline-none"
                required
                minLength={8}
              />


              {/* Error msg */}
              {formState.error && (
                <p className="text-sm text-red-600">{formState.error}</p>
              )}

              {/* Success msg */}
              {/* {success && (
                <p className="text-sm text-emerald-600">{success}</p>
              )} */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-linear-to-br from-orange-500 to-rose-500 cursor-pointer px-4 py-3 font-semibold text-white shadow hover:brightness-95 active:brightness-75 disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
