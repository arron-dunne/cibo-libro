import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ArrowLeft } from "lucide-react";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="relative flex flex-col gap-2">
      {/* Back button */}
      <Link
        href="/login"
        className="absolute -top-4 -left-4 flex items-center gap-4 text-lg font-semibold text-slate-800 cursor-pointer hover:brightness-90 active:brightness-75"
      >
        <div className="p-2 rounded-full border border-slate-300 bg-linear-to-br from-slate-100 to-slate-200">
          <ArrowLeft size={20} />
        </div>
        Back to login
      </Link>

      <header className="mt-10 text-center">
        <h1 className="text-4xl font-bold">Reset Password</h1>
        <p className="mt-2 text-gray-600">
          Choose a new password
        </p>
      </header>
      
      <ResetPasswordForm token={token ?? ""} />

    </div>
  );
}
