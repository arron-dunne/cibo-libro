import Image from "next/image";

export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="relative h-[100svh] w-full overscroll-none select-none">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl -z-10"
      />

      {/* Logo above panel */}
      <div className="absolute top-10 left-0 right-0 z-10 flex justify-center">
        <Image
          src="/images/logo.png"
          alt="Cibo Libro"
          width={280}  // bigger than before
          height={70}
          priority
          className="h-16 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
        />
      </div>

      {/* Centered panel */}
      <section className="relative mx-auto grid h-full max-w-3xl place-items-center px-6">
        <div className="relative w-full rounded-3xl border border-white/40 bg-white/65 p-10 text-center shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-white/55">
          {/* Decorative sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-80 [mask-image:linear-gradient(to_bottom,white,transparent_70%)]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05))",
            }}
          />

          {/* Headline */}
          <h1 className="relative text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
            We’re <span className="text-orange-700">cooking</span> up something tasty
          </h1>

          {/* More breathing room */}
          <p className="relative mx-auto mt-8 max-w-prose text-base text-slate-700 md:text-lg">
            The new Cibo&nbsp;Libro is in the oven. Come back soon for a beautiful,
            no-nonsense digital cookbook.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-white/90">
        © {new Date().getFullYear()} Cibo Libro
      </footer>
    </main>
  );
}
