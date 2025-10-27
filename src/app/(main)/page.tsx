import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="mx-auto grid w-full place-items-center">
      {/* Floating welcome card */}
      <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.18)] backdrop-blur sm:p-8">
        <h1 className="font-[var(--font-fredoka)] text-3xl tracking-tight">
          Welcome to cibo libro
        </h1>
        <p className="mt-2 text-slate-700">
          Your playful, beautiful digital cookbook.
        </p>

        <div className="mt-6">
          {session?.user ? (
            <p className="text-slate-800">
              Signed in as <strong>{session.user.email}</strong>.{" "}
              Go to{" "}
              <a className="font-medium text-orange-700 underline" href="/recipes">
                your recipes
              </a>
              .
            </p>
          ) : (
            <p className="text-slate-800">
              <a className="font-medium text-orange-700 underline" href="/login">
                Login
              </a>{" "}
              to start adding recipes.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
