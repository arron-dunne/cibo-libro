// Static, no client JS.
// Fun “we’re building/cooking” theme with subtle CSS-only animation.
import Image from "next/image";

export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="relative h-[100svh] w-full overscroll-none select-none">
      {/* Background (matches app vibe) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />

      {/* Soft orbs for depth */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-rose-200/50 blur-3xl"
      />

      {/* Center stage */}
      <section className="relative mx-auto grid h-full max-w-3xl place-items-center px-6">
        <div className="w-full rounded-3xl border border-white/35 bg-white/65 p-8 text-center shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-white/55">
          {/* Logo */}
          <div className="mx-auto mb-6 w-full">
            <div className="mx-auto inline-flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Cibo Libro"
                width={200}
                height={48}
                priority
                className="h-12 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            We’re <span className="text-orange-700">cooking</span> up something tasty
          </h1>

          {/* Subcopy */}
          <p className="mx-auto mt-3 max-w-prose text-base text-gray-700 md:text-lg">
            The new Cibo&nbsp;Libro is in the oven. Come back soon for a beautiful,
            no‑nonsense digital cookbook.
          </p>

          {/* “Construction” strip — pure CSS, playful but subtle */}
          <div className="relative mx-auto mt-8 w-full max-w-md">
            <div className="h-10 w-full overflow-hidden rounded-xl border border-orange-300/70 bg-white/70 shadow">
              <div
                aria-hidden
                className="h-full w-[140%] animate-[slide_2.2s_linear_infinite] bg-[repeating-linear-gradient(45deg,theme(colors.orange.500/.25),theme(colors.orange.500/.25)_16px,theme(colors.white/.7)_16px,theme(colors.white/.7)_32px)]"
              />
            </div>
            <p className="mt-3 text-sm font-semibold tracking-wide text-orange-800/90">
              Building… please check back soon
            </p>
          </div>

          {/* Bottom mini-nav (static) */}
          <div className="mt-8 flex items-center justify-center gap-4 text-sm font-medium">
            <a
              href="/privacy"
              className="rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow hover:bg-white"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow hover:bg-white"
            >
              Terms
            </a>
            <a
              href="/dmca"
              className="rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow hover:bg-white"
            >
              DMCA
            </a>
          </div>
        </div>
      </section>

      {/* Footer pinned into the same viewport (still non-scrollable) */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-white/90">
        © {new Date().getFullYear()} Cibo Libro
      </footer>

      {/* Keyframes (scoped via Tailwind plugin-free) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-20%); }
          }
        `,
        }}
      />
    </main>
  );
}
