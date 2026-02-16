import { handleSignIn } from "./actions";
import { SubmitButton } from "../components/SubmitButton";
import { CircleAlert } from "lucide-react";

export default async function LoginPage({
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
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p className="mt-1 text text-gray-600">
          Sign in to your cookbook to save and cook recipes.
        </p>
      </header>

      {/* Status banners */}
      {created && (
        <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">
          Account created. You can sign in now.
        </div>
      )}
      {error === "expired" && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-800">
          Your session has expired. Please login again.
        </div>
      )}

      {/* Form */}
      <form action={handleSignIn} className="mt-6 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={`mt-1 px-4 py-3 w-full rounded-2xl border bg-white
              outline-none focus:ring-2 
              ${error === "invalid" ? "border-2 ring-blue-400 border-red-400" : "border-zinc-300 focus:ring-blue-500"}`}
          />
          {error === "invalid" && (
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
              <CircleAlert height={18} />
              Invalid email or password
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <input
            name="password"
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={`mt-1 px-4 py-3 w-full rounded-2xl border bg-white
              outline-none focus:ring-2 
              ${error === "invalid" ? "border-2 ring-blue-400 border-red-400" : "border-zinc-300 focus:ring-blue-500"}`}
          />
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <a
            href="/forgot"
            className=" hover:underline transition hover:text-gray-700"
          >
            Forgot password
          </a>
          <span className="text-gray-600">
            Need help?{" "}
            <a href="/support" className="text-orange-700 hover:underline">
              Support
            </a>
          </span>
        </div>

        <SubmitButton text="Login" pendingText="Logging in" />

        <div className="flex items-center justify-center gap-2 text-gray-600">
          New here?
          <a href="/register" className="font-medium text-orange-700 hover:underline">
            Create an account
          </a>
        </div>
      </form>
    </>
  );
}
