import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ArrowUpFromLine, CircleUserRound, LockKeyhole, Mail, ShieldAlert } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordPopup";

export default async function SettingsPage() {

  const session = await auth();
  if (!session?.user) { redirect("/login"); }

  const email = session.user.email ?? "Unknown";

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white/70 p-8 shadow-md ring-1 ring-black/5">
        <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-orange-900">Your account</h1>
        <p className="mt-2 text-gray-600">
          Manage the essentials for your Cibo Libro profile. Some features are on
          the way, so we&apos;ve included placeholders for now.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        {/* Account details */}
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <CircleUserRound />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Account Details</h2>
              {/* <p className="text-sm text-gray-500">Used for login and notifications</p> */}
            </div>
          </div>
          <label className="ml-1 mt-4 block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            readOnly
            disabled
            className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-900 focus:border-orange-400 focus:outline-none"
          />
          <p className="mt-2 text-xs text-gray-500">
            To change your email, contact support so we can verify ownership.
          </p>
          <label className="ml-1 mt-4 block text-sm font-medium text-gray-600">Password</label>
          <ChangePasswordModal />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <LockKeyhole />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Password</h2>
              <p className="text-sm text-gray-500">Keep your cookbook secure</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            We&apos;re finishing up the password change flow. For now, reach out to
            support and we&apos;ll help you reset your password.
          </p>
          <button
            disabled
            className="mt-4 w-full rounded-full bg-gray-100 px-4 py-3 font-semibold text-gray-500 disabled:opacity-70"
          >
            Update password (coming soon)
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <ArrowUpFromLine />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Export recipes</h2>
              <p className="text-sm text-gray-500">Download all your delicious work</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Soon you&apos;ll be able to export every recipe as a shareable file. Until
            then, we can prep an export manually—just ping support.
          </p>
          <button
            disabled
            className="mt-4 w-full rounded-full border border-emerald-100 bg-white px-4 py-3 font-semibold text-emerald-500 disabled:opacity-70"
          >
            Export all recipes (queued)
          </button>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <ShieldAlert />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Danger zone</h2>
              <p className="text-sm text-gray-500">Account deletion &amp; privacy</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Need to delete your account or remove data? We&apos;ll add a one-click option
            soon. In the meantime, send us a message and we&apos;ll take care of it.
          </p>
          <button
            disabled
            className="mt-4 w-full rounded-full bg-red-100/70 px-4 py-3 font-semibold text-red-600 disabled:opacity-60"
          >
            Delete my account (contact us)
          </button>
        </div>
      </section>
    </div>
  );
}
