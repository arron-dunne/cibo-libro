"use client";

import { useState, FormEvent } from "react";
import { changePassword } from "./actions";
import { X } from "lucide-react";

export default function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (next !== confirm) {
      setError("New passwords don’t match.");
      return;
    }

    try {
      setLoading(true);
      await changePassword(current, next);   // CALL SERVER ACTION
      setLoading(false);

      setSuccess("Password updated. You will be logged out everywhere.");
      setTimeout(() => setOpen(false), 1500);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="mt-1 bg-linear-to-br from-orange-500 to-rose-500 rounded-full px-4 py-3 font-bold shadow text-white cursor-pointer hover:brightness-95 active:brightness-75"
      >
        Change Password
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* Panel */}
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Change Password
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your current password and choose a new one.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-orange-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-orange-400 focus:outline-none"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:border-orange-400 focus:outline-none"
                  required
                  minLength={8}
                />
              </div>

              {/* Error msg */}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {/* Success msg */}
              {success && (
                <p className="text-sm text-emerald-600">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-orange-500 px-4 py-3 font-semibold text-white shadow hover:brightness-95 active:brightness-75 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
