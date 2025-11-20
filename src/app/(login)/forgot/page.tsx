import Link from "next/link";
import { ArrowLeft, RotateCcwKey } from "lucide-react";
import { resetPassword } from "./actions";

export default function ForgotPasswordPage() {
  return (
    <div className="relative text-center">
      {/* Back button */}
      <Link
        href="/login"
        className="absolute text-center top-0 left-0 text-blac"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <h2 className="mt-4 text-xl font-bold text-gray-900">Reset Password</h2>
      <p className="mt-2 text-sm text-gray-500">
        Enter your email and we'll send you an email to reset your password.
      </p>

      <form action={resetPassword} className="space-y-4 text-start">
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          className="w-full rounded-2xl bg-white px-4 py-3 shadow-inner"
          required
        />

        <button
          type="submit"
          // disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-linear-to-br from-orange-500 to-rose-500 cursor-pointer px-4 py-3 font-bold text-lg text-white shadow hover:brightness-95 active:brightness-75 disabled:opacity-50"
        >
          {/* {isSubmitting ? "Updating..." : "Update Password"} */}
          Send Reset Email
        </button>
      </form>
    </div>
  )
}