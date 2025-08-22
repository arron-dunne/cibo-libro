import Image from "next/image";
import Link from "next/link";
import { Nunito } from "next/font/google";
import { auth, signOut } from "@/lib/auth";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/signin" });
  }

  return (
    <div className={`min-h-screen text-gray-900 antialiased ${nunito.variable}`}>
      {/* Brand gradient background + soft glow */}
      <div className="fixed inset-0 -z-50">
        <div className="h-full w-full bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(700px 320px at 20% 10%, rgba(255,255,255,0.28), transparent 60%), radial-gradient(560px 260px at 82% 0%, rgba(255,255,255,0.18), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(140%_80%_at_50%_0%,rgba(0,0,0,0.12),transparent_60%)]" />
      </div>

      {/* Floating navbar */}
      <nav className="sticky top-4 z-40">
        <div className="mx-auto w-[min(1150px,95%)]">
          <div className="flex h-14 items-center gap-3 rounded-full border border-white/60 bg-white/85 px-3 sm:px-4 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur supports-[backdrop-filter]:bg-white/65">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2" aria-label="cibo libro home">
              <Image
                src="/images/logo.png"
                alt="cibo libro"
                width={150}
                height={36}
                className="h-9 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                priority
              />
            </Link>

            {/* Main shortcuts */}
            <div className="mx-auto hidden gap-1 sm:flex">
              <NavLink href="/" label="Home" icon="M3.75 12h16.5M4.5 12l7.5-7.5L19.5 12" />
              <NavLink href="/recipes" label="All recipes" icon="M4 6h16M4 12h16M4 18h16" />
              <NavLink href="/new" label="Add" icon="M12 4v16M4 12h16" highlight />
              <NavLink href="/settings" label="Settings" icon="M10.325 4.317L9.257 6.5M19 12a7 7 0 11-14 0 7 7 0 0114 0z" />
            </div>

            {/* Auth */}
            <div className="ml-auto flex items-center gap-2 text-sm">
              {session?.user ? (
                <>
                  <span className="hidden sm:inline text-gray-700">{session.user.email}</span>
                  <form action={doSignOut}>
                    <button className="rounded-full border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-700 shadow transition hover:-translate-y-0.5 hover:bg-orange-50">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="rounded-full border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-700 shadow transition hover:-translate-y-0.5 hover:bg-orange-50"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-orange-600 px-3 py-1.5 font-semibold text-white shadow-[0_8px_18px_rgba(234,88,12,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page container */}
      <main className="mx-auto w-[min(1150px,95%)] py-8">{children}</main>

      {/* Footer (rounded icon removed) */}
      <footer className="mt-auto border-t border-white/30 bg-white/10 py-8 text-white backdrop-blur">
        <div className="mx-auto w-[min(1150px,95%)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="cibo libro"
              width={140}
              height={32}
              className="h-8 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
            />
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link className="hover:underline" href="/legal/content-policy">Content Policy</Link>
            <Link className="hover:underline" href="/legal/privacy">Privacy Policy</Link>
            <Link className="hover:underline" href="/support">Support</Link>
            <Link className="hover:underline" href="/contact">Contact</Link>
          </nav>
          <div className="text-xs/6 opacity-90">© {new Date().getFullYear()} cibo libro. All rights reserved.</div>
        </div>
      </footer>

      {/* Inline SVG button component */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.__navIcon = (d)=>'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="'+d+'"/></svg>');
            `,
        }}
      />
    </div>
  );
}

/* Reusable pill-like navbar link */
function NavLink({
  href,
  label,
  icon,
  highlight = false,
}: {
  href: string;
  label: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      className={[
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium shadow transition",
        highlight
          ? "bg-orange-600 text-white hover:-translate-y-0.5 hover:bg-orange-700"
          : "border border-orange-200 bg-white text-orange-700 hover:-translate-y-0.5 hover:bg-orange-50",
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        aria-hidden
        width={16}
        height={16}
        src={`javascript:__navIcon('${icon}')`}
      />
      {label}
    </a>
  );
}
