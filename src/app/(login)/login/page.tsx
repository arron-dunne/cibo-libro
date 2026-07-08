import { CircleAlert } from "lucide-react";
import { handleSignIn } from "./actions";
import { SubmitButton } from "../components/SubmitButton";
import { TertiaryButton } from "@/app/components/buttons/Buttons";
import { Header, SubHeader } from "@/app/components/text/Headers";
import { Input } from "@/app/components/forms/Inputs";

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
        <SubHeader className="justify-center">
          Sign in to to get cooking again.
        </SubHeader>
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
      {error === "invalid" && (
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
          <CircleAlert height={18} />
          Invalid email or password
        </p>
      )}

      {/* Form */}
      <form action={handleSignIn} className="mt-6">
        <Input
          label="Email"
          invalid={error === "invalid"}
          name="email"
          id="email"
          type="email"
          required
          autoComplete="email"
        />

        <div className="mt-6">
          <Input
            invalid={error === "invalid"}
            label="Password"
            name="password"
            id="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        <div className="mt-8">
          <SubmitButton text="Login" />
        </div>

        <div className="mt-6 flex px-2 items-center justify-between text-gray-600">
          <a href="/forgot">
            <TertiaryButton type="button">Forgot password</TertiaryButton>
          </a>
          <div className="flex gap-2 items-center">
            <span className="text-slate-600 font-semibold">Need help?</span>
            <a href="/support">
              <TertiaryButton type="button">Support</TertiaryButton>
            </a>
          </div>
        </div>
      </form>
    </>
  );
}
