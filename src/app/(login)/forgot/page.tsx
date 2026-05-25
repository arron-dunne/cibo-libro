import Link from "next/link";
import { ArrowLeft, MailCheck, Send } from "lucide-react";
import { resetPassword } from "./actions";
import { SubmitButton } from "../components/SubmitButton";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";

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
      </header>

      {sent ? (
        <>
          <div className="mt-4 rounded-2xl bg-green-200/90 border border-green-800 px-4 py-4 text-green-800">
            <div className="flex items-center gap-4">
              <MailCheck size={26} className="shrink-0" />
              <h3 className="text-lg font-bold">Email requested</h3>
            </div>
            <p className="mt-2">
              Check your inbox (and spam folder) for instructions to reset your
              password.
            </p>
          </div>

          <Link
            href="/forgot"
            className="mt-6 w-full rounded-full bg-linear-to-br from-orange-500 to-rose-500 py-3
            text-white text-xl font-bold flex items-center justify-center gap-2 shadow-lg
            hover:brightness-90 active:brightness-75 cursor-pointer"
          >
            Send Another Email
          </Link>
        </>
      ) : (
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
          {/* <SubmitButton text="Send Email" pendingText="Sending" icon={<Send size={22} />}/> */}
        </form>
      )}
    </div>
  );
}
