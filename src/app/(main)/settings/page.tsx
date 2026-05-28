import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ArrowUpFromLine, CircleUserRound } from "lucide-react";
import ChangePassword from "./ChangePassword";
import { signOutAllDevices } from "./actions";
import { Header } from "@/app/components/text/Headers";
import { SecondaryButton } from "@/app/components/buttons/Buttons";
import { logout } from "@/app/actions/logout";
import LogoutButton from "./LogoutButton";
import { ExportRecipes } from "./ExportRecipes";

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
          <CircleUserRound size={28} className="shrink-0 text-rose-500" />
          Account Details
        </h2>

        <div className="flex items-center justify-between mb-8">
          <p className="text-lg font-medium text-slate-500">Email</p>
          <p className="text-lg text-slate-800">{email}</p>
        </div>

        <div className="flex flex-col gap-6">
          <form action={logout}>
            <LogoutButton />
          </form>

          <ChangePassword />

          <form action={signOutAllDevices}>
            <SecondaryButton type="submit" width="w-full">
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
      <ExportRecipes />
      
    </div>
  );
}
