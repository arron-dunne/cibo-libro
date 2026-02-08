import { handleRegister } from "./actions"
import { SubmitButton } from "../components/SubmitButton";
import { CircleAlert } from "lucide-react";

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<{ error: string }>
}) {

  const error = await searchParams.then(params => params.error) ?? null;

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
      {/* {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {
            error === "existing" ? "An account with that email already exists" :
              error === "mismatch" ? "Passwords do not match" :
                "Invalid email or password"
          }
        </div>
      )} */}

      {/* Form */}
      <form action={handleRegister} className="mt-6 space-y-5">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-800">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            className={`block w-full rounded-2xl border  bg-white px-4 py-3
                    outline-none transition border-white 
                     focus:shadow-lg focus:scale-105
                    ${error === "existing" ? "ring-2 ring-red-400" : ""}`}
          />
          {error === "existing" && (
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
              <CircleAlert height={18} />
              An account with that email already exists
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-800">
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
            className={`block w-full rounded-2xl border  bg-white px-4 py-3
                    outline-none transition border-white 
                     focus:shadow-lg focus:scale-105
                    ${error === "mismatch" ? "ring-2 ring-red-400" : ""}`}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gray-800">
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
            className={`block w-full rounded-2xl border  bg-white px-4 py-3
                    outline-none transition border-white 
                     focus:shadow-lg focus:scale-105
                    ${error === "mismatch" ? "ring-2 ring-red-400" : ""}`}
          />
          {error === "mismatch" && (
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
              <CircleAlert height={18} />
              Passwords did not match
            </p>
          )}
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
