import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ArrowUpFromLine, CircleUserRound, ShieldAlert } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const email = session.user.email ?? "Unknown";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1
        className="mt-8 mb-6 text-5xl text-white font-black"
        style={{ WebkitTextStroke: "5px black", paintOrder: "stroke fill" }}
      >
        Settings
      </h1>

      {/* Account Details */}
      <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-semibold text-black mb-6 flex items-center gap-4">
          <CircleUserRound size={28} className="hidden sm:block shrink-0 text-orange-500" />
          Account Details
        </h2>

        <label className="block text-sm font-medium text-slate-600 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          readOnly
          disabled
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-slate-700"
        />
        <p className="mt-2 text-xs text-slate-500">
          To change your email, contact support so we can verify ownership.
        </p>

        <label className="block text-sm font-medium text-slate-600 mt-6 mb-1">
          Password
        </label>
        <ChangePasswordModal />
      </section>

      {/* Export Recipes */}
      <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
          <ArrowUpFromLine size={28} className="hidden sm:block shrink-0 text-orange-500" />
          Export Recipes
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Soon you&apos;ll be able to export all your recipes as a shareable file.
          Until then, we can prep an export manually — just ping support.
        </p>
        <button
          disabled
          className="mt-6 w-full rounded-full bg-zinc-100 px-4 py-3 font-semibold text-zinc-400 cursor-not-allowed"
        >
          Export all recipes (coming soon)
        </button>
      </section>

      {/* Danger Zone */}
      <section className="rounded-3xl border border-red-200/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
          <ShieldAlert size={28} className="hidden sm:block shrink-0 text-red-500" />
          Danger Zone
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Need to delete your account or remove your data? We&apos;ll add a
          one-click option soon. In the meantime, send us a message and
          we&apos;ll take care of it.
        </p>
        <button
          disabled
          className="mt-6 w-full rounded-full bg-red-50 px-4 py-3 font-semibold text-red-400 cursor-not-allowed"
        >
          Delete my account (contact us)
        </button>
      </section>
    </div>
  );
}
