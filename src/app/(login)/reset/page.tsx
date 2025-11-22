import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ArrowLeft } from "lucide-react";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {

  const token = await searchParams.then(sp => sp.token || "");

  return (
    <div className="relative text-center">
      {/* Back button */}
      <Link
        href="/login"
        className="absolute text-center top-0 left-0 text-black flex gap-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to login</span>
      </Link>

      <h2 className="mt-4 text-xl font-bold text-gray-900">Reset Password</h2>
      <p className="mt-2 text-sm text-gray-500">
        Choose a new password
      </p>

      <ResetPasswordForm token={token} />

      <Link
        href="/forgot"
        className="flex justify-center items-center mt-2 w-full h-12 rounded-full bg-linear-to-br from-slate-300 to-slate-400 cursor-pointer font-bold text-lg text-black shadow hover:brightness-95 active:brightness-75 disabled:opacity-50"
      >
        Request another reset email
      </Link>
    </div>
  )
}