import { handleSignIn } from "./actions";
import { SubmitButton } from "../components/SubmitButton";
import { CircleAlert } from "lucide-react";

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const params = await searchParams;

  const created = params.created === "1";

  const error = params.error ?? null;

  return (
    <>
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-semibold">
          {created ? "Welcome" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Sign in to your cookbook to save and cook recipes.
        </p>
      </header>

      {/* Status banners */}
      { created && (
        <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">
          Account created. You can sign in now.
        </div>
      )}
      { error === "expired" && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-800">
          Your session has expired. Please login again.
        </div>
      )}

      {/* Form */}
      <form action={handleSignIn} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={`block w-full rounded-2xl border border-white bg-white px-4 py-3
              outline-none transition focus:scale-105
              focus:shadow-lg ${error === "invalid" ? "ring-2 ring-red-400" : ""}`}
          />
          {error === "invalid" && (
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
              <CircleAlert height={18} />
              Invalid email or password
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={`block w-full rounded-2xl border border-white bg-white px-4 py-3
              outline-none transition
              focus:scale-105 focus:shadow-lg ${error === "invalid" ? "ring-2 ring-red-400" : ""}`}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <a href="/forgot" className="text-gray-500 hover:underline transition hover:text-gray-700">
            Forgot password
          </a>
          <span className="text-gray-500">
            Need help?{" "}
            <a href="/support" className="text-orange-700 hover:underline">
              Support
            </a>
          </span>
        </div>

        <SubmitButton text="Login" pendingText="Signing in..." />

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          New here?
          <a href="/register" className="font-medium text-orange-700 underline">
            Create an account
          </a>
        </div>
      </form>
    </>
  );
}
