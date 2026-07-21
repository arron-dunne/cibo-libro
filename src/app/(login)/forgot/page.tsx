import Link from "next/link";
import { resetPassword } from "./actions";
import { SubmitButton } from "../components/SubmitButton";
import { PrimaryButton, SecondaryButton } from "@/app/components/buttons/Buttons";
import { Header } from "@/app/components/text/Headers";
import { Input } from "@/app/components/forms/Inputs";
import { SuccessBanner } from "@/app/(main)/support/components/Banners";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";

  return (
    <div className="flex flex-col gap-8">
      <div className="mt-8 text-center space-y-4">
        <Header>Reset Password</Header>
        <p className="text-stone-800">Enter your email address below and we&apos;ll send you instructions with how to reset your password.</p>
      </div>

      {sent ? (
        <>
          <SuccessBanner text="Email requested. Check your inbox and spam folder." />
          
          <Link href="/forgot">
            <PrimaryButton type="button" size="lg" width="w-full">
              Send Another Email
            </PrimaryButton>
          </Link>
          <Link href="/login">
            <SecondaryButton type="button" size="lg" width="w-full">
              Back to Login
            </SecondaryButton>
          </Link>
        </>
      ) : (
        <form action={resetPassword} className="space-y-8">
          <Input
            name="email"
            placeholder="you@email.com"
            required
          />
          <SubmitButton text="Send Email" pendingText="Sending..."/>
          {/* <SubmitButton text="Send Email" pendingText="Sending" icon={<Send size={22} />}/> */}
        </form>
      )}
    </div>
  );
}
