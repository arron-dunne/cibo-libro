import { handleRegister } from "./actions";
import { SubmitButton } from "../components/SubmitButton";
import { CircleAlert } from "lucide-react";
import { Header, SubHeader } from "@/app/components/text/Headers";
import { TertiaryButton } from "@/app/components/buttons/Buttons";

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
        <Header className="mb-2">Get Started</Header>
        <SubHeader className="justify-center">
          Open your new cookbook for free
        </SubHeader>
      </header>

      {/* Form */}
      <form action={handleRegister} className="mt-6">
        <div>
          <label htmlFor="email" className="ml-2 font-semibold">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            required
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

        <div className="mt-6">
          <label htmlFor="password" className="ml-2 font-semibold">
            Password (at least 8 characters)
          </label>
          <input
            name="password"
            id="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            className={`mt-1 px-4 py-3 w-full rounded-2xl border bg-white
              outline-none focus:ring-2
              ${error === "mismatch" ? "border-2 ring-blue-400 border-red-400" : "border-zinc-300 focus:ring-blue-500"}`}
          />
        </div>

        <div className="mt-6">
          <label htmlFor="confirm-password" className="ml-2 font-semibold">
            Confirm Password
          </label>
          <input
            name="confirm"
            id="confirm-password"
            type="password"
            required
            autoComplete="off"
            minLength={8}
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

        <div className="mt-8">
          <SubmitButton text="Sign up" pendingText="Signing up" />
        </div>

        <div className="mt-6 flex px-2 items-center justify-start text-slate-500">
          <div className="flex gap-2 items-center">
            <span className="text-slate-600 font-semibold">Need help?</span>
            <a href="/support">
              <TertiaryButton>Support</TertiaryButton>
            </a>
          </div>
        </div>
      </form>
    </>
  );
}
