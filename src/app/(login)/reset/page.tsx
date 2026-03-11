import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updatePassword } from "./actions";
import { SubmitButton } from "../components/SubmitButton";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";
  const error = params.error ?? null;

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
        Back to login
      </Link>

      <header className="mt-10 text-center">
        <h1 className="text-4xl font-bold">Reset Password</h1>
        <p className="mt-2 text-gray-600">Choose a new password</p>
      </header>

      {/* Error banners */}
      {error && (
        <div className="mt-4 rounded-xl border bg-red-200/90 border-red-800 px-4 py-3 text-red-800">
          {error === "password" && <>Passwords do not match</>}
          {error === "invalid" && <>Something went wrong, please try again</>}
          {error === "token" && <>This reset link is invalid or has expired</>}
        </div>
      )}

      {error === "token" ? (
        <Link
          href="/forgot"
          className="mt-6 w-full rounded-full bg-linear-to-br from-orange-500 to-rose-500 py-3
            text-white text-xl font-bold flex items-center justify-center gap-2 shadow-lg
            hover:brightness-90 active:brightness-75 cursor-pointer"
        >
          Send Another Email
        </Link>
      ) : (
        <form action={updatePassword} className="mt-4 space-y-4 text-start">
          <input name="token" hidden readOnly value={token} />

          <label htmlFor="password" className="text-sm font-semibold">
            New Password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            required
            minLength={8}
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
            minLength={8}
            className="mt-1 px-4 py-3 w-full rounded-2xl border bg-white
                outline-none focus:ring-2 border-zinc-300 focus:ring-blue-500"
          />

          <SubmitButton text="Reset Password" pendingText="Resetting" />
        </form>
      )}
    </div>
  );
}
