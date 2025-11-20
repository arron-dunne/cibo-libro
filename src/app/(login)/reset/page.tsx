import Link from "next/link";
import { ArrowLeft, RotateCcwKey } from "lucide-react";
import { updatePassword } from "./actions";

export default function ResetPasswordPage() {
  return (
    <div className="relative text-center">
      {/* Back button */}
      <Link
        href="/login"
        className="absolute text-center top-0 left-0 text-black flex gap-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to login</span>
      </Link>

      <h2 className="mt-4 text-xl font-bold text-gray-900">Reset Password</h2>
      <p className="mt-2 text-sm text-gray-500">
        Choose a new password
      </p>

      <form action={updatePassword} className="space-y-4 text-start">
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
          // disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-linear-to-br from-orange-500 to-rose-500 cursor-pointer px-4 py-3 font-bold text-lg text-white shadow hover:brightness-95 active:brightness-75 disabled:opacity-50"
        >
          {/* {isSubmitting ? "Updating..." : "Update Password"} */}
          Reset Password
        </button>
      </form>
    </div>
  )
}