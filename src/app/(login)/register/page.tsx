import { handleRegister } from "./actions";
import { SubmitButton } from "../components/SubmitButton";
import { CircleAlert } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold">Create your account</h1>
        <p className="mt-1 text-gray-600">
          Get started with your new digital cookbook.
        </p>
      </header>

      {/* Form */}
      <form action={handleRegister} className="mt-6 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            className={`mt-1 px-4 py-3 w-full rounded-2xl border bg-white
              outline-none focus:ring-2 
              ${error === "existing" ? "border-2 ring-blue-400 border-red-400" : "border-zinc-300 focus:ring-blue-500"}`}
          />
          {error === "existing" && (
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
              <CircleAlert height={18} />
              An account with that email already exists
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-semibold">
            Password (at least 8 characters)
          </label>
          <input
            name="password"
            id="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            placeholder="••••••••"
            className={`mt-1 px-4 py-3 w-full rounded-2xl border bg-white
              outline-none focus:ring-2 
              ${error === "mismatch" ? "border-2 ring-blue-400 border-red-400" : "border-zinc-300 focus:ring-blue-500"}`}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="confirm-password" className="text-sm font-semibold">
            Confirm Password
          </label>
          <input
            name="confirm"
            id="confirm-password"
            type="password"
            required
            autoComplete="off"
            minLength={8}
            placeholder="••••••••"
            className={`mt-1 px-4 py-3 w-full rounded-2xl border bg-white
              outline-none focus:ring-2 
              ${error === "mismatch" ? "border-2 ring-blue-400 border-red-400" : "border-zinc-300 focus:ring-blue-500"}`}
          />
          {error === "mismatch" && (
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
              <CircleAlert height={18} />
              Passwords did not match
            </p>
          )}
        </div>

        <SubmitButton text="Sign up" pendingText="Signing up" />

        <div className="flex items-center justify-center gap-2 text-gray-600">
          Already have an account?
          <a href="/login" className="font-medium text-orange-700 hover:underline">
            Login
          </a>
        </div>
      </form>
    </>
  );
}
