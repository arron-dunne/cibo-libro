import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ArrowUpFromLine, CircleUserRound } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";
import ExportRecipesModal from "./ExportRecipesModal";
import { signOutAllDevices } from "./actions";

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

        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-medium text-slate-600">Email</p>
          <p className="text-lg text-slate-800">{email}</p>
        </div>

        <div className="flex flex-col gap-4">
          <ChangePasswordModal />

          <form action={signOutAllDevices}>
            <button
              type="submit"
              className="w-full rounded-full bg-linear-to-br from-slate-100 to-slate-200 border border-slate-300 px-4 py-3 font-semibold text-slate-800 cursor-pointer hover:brightness-90 active:brightness-75"
            >
              Sign out of all devices
            </button>
          </form>

          <button
            className="w-full rounded-full bg-linear-to-br from-red-500 to-pink-600 border border-red-800/40 px-4 py-3 font-semibold text-white shadow-lg cursor-pointer hover:brightness-90 active:brightness-75"
          >
            Delete my account
          </button>
        </div>
      </section>

      {/* Export Recipes */}
      <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
          <ArrowUpFromLine size={28} className="hidden sm:block shrink-0 text-orange-500" />
          Export Recipes
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Download all your recipes as a file you can keep, share, or import
          elsewhere.
        </p>
        <div className="mt-6">
          <ExportRecipesModal />
        </div>
      </section>
    </div>
  );
}
