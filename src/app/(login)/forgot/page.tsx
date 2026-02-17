import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { resetPassword } from "./actions";
import { SubmitButton } from "../components/SubmitButton";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex flex-col gap-2">
      {/* Back button */}
      <Link
        href="/login"
        className="absolute -top-4 -left-4 flex items-center gap-4 text-lg font-semibold text-slate-800 cursor-pointer hover:brightness-90 active:brightness-75"
      >
        <div className="p-2 rounded-full border border-slate-300 bg-linear-to-br from-slate-100 to-slate-200">
          <ArrowLeft size={20} />
        </div>
        Back
      </Link>

      <header className="mt-10 text-center">
        <h1 className="text-4xl font-bold">Reset Password</h1>
        <p className="mt-1 text-gray-600">
          Enter your email address and we&apos;ll send you an email to reset your
          password.
        </p>
      </header>

      <form action={resetPassword} className="space-y-8">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          name="email"
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          className="mt-1 px-4 py-3 w-full rounded-2xl border bg-white
              outline-none focus:ring-2 border-zinc-300 focus:ring-blue-500"
        />

        <SubmitButton text="Send Email" pendingText="Sending"/>
      </form>
    </div>
  );
}
