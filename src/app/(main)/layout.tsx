import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Footer } from "@/app/components/footer/Footer";
import { CirclePlus, CookingPot, Home, Import, LogOut, LucideIcon, Settings } from "lucide-react";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <>
      {/* Floating navbar */}
      < nav className="sticky top-4 z-40" >
        <div className="mx-auto w-[min(1150px,95%)]">
          <div className="flex h-14 gap-2 rounded-full border border-white/80 bg-white/60 px-3 sm:px-4 py-2 shadow-sm backdrop-blur">
            
            {/* Logo */}
            <Link href="/" className="grow" aria-label="cibo libro home">
              <Image
                src="/images/logo.png"
                alt="cibo libro"
                width={150}
                height={36}
                className="h-9 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                priority
              />
            </Link>

            {/* Navigation */}
            <div className="hidden gap-6 sm:flex">
              <NavLink href="/" label="Home" icon={Home} highlight={true}/>
              <NavLink href="/all" label="Recipes" icon={CookingPot} />
              <NavLink href="/new" label="Add" icon={CirclePlus} />
              <NavLink href="/import" label="Import" icon={Import} />
              <NavLink href="/settings" label="Settings" icon={Settings} />
            </div>

            {/* Logout */}
            <div className="flex grow justify-end items-center gap-2 text-sm">
              {session?.user ? (
                <>
                  <span className="hidden sm:inline text-gray-700">{session.user.email}</span>
                  <form action={doSignOut}>
                    <button className="flex gap-2 place-items-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow transition hover:scale-105 hover:brightness-95">
                      <LogOut size={16}/>
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-700 shadow transition hover:-translate-y-0.5 hover:bg-orange-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-orange-600 px-3 py-1.5 font-semibold text-white shadow-[0_8px_18px_rgba(234,88,12,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-700"
                  >
                    Regsiter
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav >

      {/* Page container */}
      <main className="z-0 mx-auto w-[min(1150px,95%)] py-8" > {children}</main >

      <Footer />
    </>
  );
}

/* Reusable pill-like navbar link */
function NavLink({
  href,
  label,
  icon: Icon,
  highlight = false,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-1 font-medium rounded-full transition",
        highlight
          ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow"
          : "text-orange-700 hover:brightness-200",
      ].join(" ")}
    >
      <Icon size={16} />
      { label }
    </Link>
  );
}
