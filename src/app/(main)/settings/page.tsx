import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ArrowUpFromLine, CircleUserRound } from "lucide-react";
import ChangePassword from "./ChangePassword";
import ExportRecipesModal from "./ExportRecipesModal";
import { signOutAllDevices } from "./actions";
import { Header } from "@/app/components/text/Headers";
import { SecondaryButton } from "@/app/components/buttons/Buttons";
import { logout } from "@/app/actions/logout";
import LogoutButton from "./LogoutButton";

export default async function SettingsPage() {
  
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const email = session.user.email ?? "Unknown";

  return (
    <div className="mt-12 max-w-lg w-full mx-auto space-y-8">
      <Header>Settings</Header>

      {/* Account Details */}
      <section className="rounded-3xl bg-white p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-4">
          <CircleUserRound
            size={28}
            className="shrink-0 text-rose-500"
          />
          Account Details
        </h2>

        <div className="flex items-center justify-between mb-8">
          <p className="text-lg font-medium text-slate-500">Email</p>
          <p className="text-lg text-slate-800">{email}</p>
        </div>

        <div className="flex flex-col gap-6">

          <form action={logout}> 
            <LogoutButton/>
          </form>

          <ChangePassword />

          <form action={signOutAllDevices}>
            <SecondaryButton
              type="submit"
              width="w-full"
            >
              Sign out of all devices
            </SecondaryButton>
          </form>

          {/* <button
            className="w-full rounded-full bg-linear-to-br from-red-500 to-pink-600 border border-red-800/40 px-4 py-3 font-semibold text-white shadow-lg cursor-pointer hover:brightness-90 active:brightness-75"
          >
            Delete my account
          </button> */}
        </div>
      </section>

      {/* Export Recipes */}
      <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
          <ArrowUpFromLine
            size={28}
            className="hidden sm:block shrink-0 text-orange-500"
          />
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
