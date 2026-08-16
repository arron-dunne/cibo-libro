import { handleRegister } from "./actions";
import { SubmitButton } from "../components/SubmitButton";
import { CircleAlert } from "lucide-react";
import { Header, SubHeader } from "@/app/components/text/Headers";
import { Input } from "@/app/components/forms/Inputs";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ?? null;

  return (
    <>
      {/* Header */}
      <header className="text-center">
        <Header className="mb-2">Get Started</Header>
        <SubHeader className="justify-center">
          Open your new cookbook for free
        </SubHeader>
      </header>

      {error === "invalid" && (
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
          <CircleAlert height={18} />
          Enter a valid email and passwords of at least 8 characters
        </p>
      )}

      {/* Form */}
      <form action={handleRegister} className="mt-6">
        <Input
          label="Email"
          invalid={error === "existing" || error === "invalid"}
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        {error === "existing" && (
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600">
            <CircleAlert height={18} />
            An account with that email already exists
          </p>
        )}

        <div className="mt-6">
          <Input
            label="Password (at least 8 characters)"
            invalid={error === "mismatch" || error === "invalid"}
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        <div className="mt-6">
          <Input
            label="Confirm Password"
            invalid={error === "mismatch" || error === "invalid"}
            name="confirm"
            type="password"
            required
            autoComplete="off"
            minLength={8}
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
      </form>
    </>
  );
}
