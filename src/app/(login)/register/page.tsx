import { handleRegister } from "./actions"
import { SubmitButton } from "../components/SubmitButton";

export default function SignupPage({
  searchParams
}: {
  searchParams: { error?: string }
}) {

  const params = searchParams;

  return (
    <>
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-semibold">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Get started with your new digital cookbook.
        </p>
      </header>

      {/* Status banners */}
      {params?.error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {params.error === "invalid" ? "Invalid email or password" : "Sign-up failed"}
        </div>
      )}

      {/* Form */}
      <form action={handleRegister} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            // autoComplete="email"
            placeholder="you@example.com"
            className="block w-full rounded-2xl border border-white bg-white px-4 py-3
                    outline-none transition
                    focus:border-orange-500 focus:shadow-lg"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Password (at least 8 characters)
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            // autoComplete="current-password"
            placeholder="••••••••"
            className="block w-full rounded-2xl border border-white bg-white px-4 py-3
                    outline-none transition
                    focus:border-orange-500 focus:shadow-lg"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Confirm Password
          </label>
          <input
            name="confirm"
            type="password"
            required
            minLength={8}
            // autoComplete="current-password"
            placeholder="••••••••"
            className="block w-full rounded-2xl border border-white bg-white px-4 py-3
                    outline-none transition
                    focus:border-orange-500 focus:shadow-lg"
          />
        </div>

        <div className="flex items-start justify-between text-sm">
          <span className="text-gray-500">
            Need help?{" "}
            <a href="/support" className="text-orange-700 hover:underline">
              Support
            </a>
          </span>
        </div>

        <SubmitButton text="Register" pendingText="Signing up..." />

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          Already have an account?
          <a href="/login" className="font-medium text-orange-700 underline">
            Login
          </a>
        </div>
      </form >
    </>
  );
}
