import { handleSignIn } from "./actions";
import { SubmitButton } from "../components/SubmitButton";
import { CircleAlert } from "lucide-react";
import { sansita } from "@/app/fonts";
import { PrimaryButton, TeriaryButton } from "@/app/components/buttons/Buttons";
import { Header, SubHeader } from "@/app/components/text/Headers";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; error?: string }>;
}) {
  const params = await searchParams;

  const created = params.created === "1";
  const updated = params.updated === "1";

  const error = params.error ?? null;

  return (
    <>
      {/* Header */}
      <header className="text-center">
        <Header className="mb-2">Welcome back</Header>
        <SubHeader>Sign in to to get cooking again.</SubHeader>
      </header>

      {/* Status banners */}
      {created && (
        <div className="mt-4 rounded-2xl bg-green-200/90 border border-green-800 p-8 text-green-800 px-4 py-3">
          Account created. You can login now.
        </div>
      )}
      {updated && (
        <div className="mt-4 rounded-2xl bg-green-200/90 border border-green-800 p-8 text-green-800 px-4 py-3">
          Password changed
        </div>
      )}
      {error === "expired" && (
        <div className="mt-4 rounded-xl border bg-red-200/90 border-red-800 px-4 py-3 text-red-800">
          Your session has expired. Please login again.
        </div>
      )}

      {/* Form */}
      <form action={handleSignIn} className="mt-6">
        <div>
          <label htmlFor="email" className="ml-2 font-semibold">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            required
            autoComplete="email"
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

        <div className="mt-6">
          <label htmlFor="password" className="ml-2 font-semibold">
            Password
          </label>
          <input
            name="password"
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className={`mt-1 px-4 py-3 w-full rounded-2xl border bg-white
              outline-none focus:ring-2
              ${error === "invalid" ? "border-2 ring-blue-400 border-red-400" : "border-zinc-300 focus:ring-blue-500"}`}
          />
        </div>

        <div className="mt-8">
          <SubmitButton text="Login"/>
        </div>

        {/* <SubmitButton text="Login" pendingText="Logging in" /> */}

        <div className="mt-6 flex px-2 items-center justify-between text-gray-600">
          <a href="/forgot">
            <TeriaryButton>Forgot password</TeriaryButton>
          </a>
          <div className="flex gap-2 items-center">
            <span className="text-slate-600 font-semibold">Need help?</span>
            <a href="/support">
              <TeriaryButton>Support</TeriaryButton>
            </a>
          </div>
        </div>
      </form>
    </>
  );
}
