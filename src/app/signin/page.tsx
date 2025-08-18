import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const SigninSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const params = await searchParams;

  async function doSignIn(formData: FormData) {
    "use server";
    const obj = Object.fromEntries(formData.entries());
    const parsed = SigninSchema.safeParse(obj);
    if (!parsed.success) redirect("/signin?error=invalid");

    const { email, password } = parsed.data;

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  }

  return (
    <div className="mx-auto grid w-full place-items-center">
      {/* Floating panel (no logo here — it lives in the navbar) */}
      <section
        className="relative w-full max-w-md overflow-hidden rounded-[28px]
                   bg-white p-7 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.20)]"
        style={{
          // subtle gradient border using mask — feels premium
          WebkitMaskImage:
            "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.75), 0 30px 80px rgba(0,0,0,0.20)",
          borderRadius: "28px",
          padding: "1.75rem",
          background:
            "linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,0.98)) padding-box, linear-gradient(140deg, rgba(255,255,255,0.85), rgba(255,255,255,0.2)) border-box",
        }}
      >
        {/* soft interior glow */}
        <div className="pointer-events-none absolute -left-10 -top-10 -z-10 h-36 w-36 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 -z-10 h-24 w-24 rounded-full bg-rose-200/55 blur-2xl" />

        <header className="text-center">
          <h1 className="font-[var(--font-nunito)] text-[28px] tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Sign in to your cookbook to save and cook recipes.
          </p>
        </header>

        {/* Status banners */}
        {params?.created && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Account created. You can sign in now.
          </div>
        )}
        {params?.error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {params.error === "invalid" ? "Invalid email or password" : "Sign-in failed"}
          </div>
        )}

        <form action={doSignIn} className="mt-6 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3
                         font-[var(--font-nunito)]
                         outline-none transition
                         focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(234,88,12,0.15)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3
                         font-[var(--font-nunito)]
                         outline-none transition
                         focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(234,88,12,0.15)]"
            />
            <div className="mt-2 text-xs text-gray-500">
              Use at least 8 characters with letters and numbers.
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-gray-500 underline underline-offset-4 transition hover:text-gray-700">
              Forgot password
            </a>
            <span className="text-gray-500">
              Need help?{" "}
              <a href="/support" className="text-orange-700 hover:underline">
                Support
              </a>
            </span>
          </div>

          <button
            className="group w-full rounded-2xl bg-orange-600 px-4 py-3
                       font-[var(--font-nunito)] text-white
                       shadow-[0_12px_26px_rgba(234,88,12,0.35)]
                       transition hover:-translate-y-0.5 hover:bg-orange-700 active:translate-y-0"
            aria-label="Sign in"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <span>Sign in</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            New here?
            <a href="/signup" className="font-medium text-orange-700 underline">
              Create an account
            </a>
          </div>
        </form>
      </section>
    </div>
  );
}
