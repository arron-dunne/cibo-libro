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
    <main className="grid place-items-center">
      {/* Solid white floating panel, playful headings, gentle motion */}
      <section className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/80 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.20)] sm:p-8">
        {/* decorative highlights */}
        <div className="pointer-events-none absolute -z-10 -mx-4 -mt-4 h-32 w-32 rounded-full bg-orange-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -z-10 right-2 top-24 h-24 w-24 rounded-full bg-rose-200/60 blur-2xl" />

        <h1 className="font-[var(--font-fredoka)] text-3xl tracking-tight">
          Welcome back ✨
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Sign in to your cookbook to save and cook recipes.
        </p>

        {/* Banners */}
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
              className="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition will-change-transform
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
              className="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition
                         focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(234,88,12,0.15)]"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a
              href="#"
              className="text-gray-500 underline underline-offset-4 transition hover:text-gray-700"
            >
              Forgot password
            </a>
            <span className="text-gray-500">
              {/* tiny friendly hint */}
              Need help? <a href="/support" className="text-orange-700 hover:underline">Support</a>
            </span>
          </div>

          <button
            className="group w-full rounded-2xl bg-orange-600 px-4 py-3 font-semibold text-white shadow-[0_12px_26px_rgba(234,88,12,0.35)]
                       transition hover:-translate-y-0.5 hover:bg-orange-700 active:translate-y-0"
            aria-label="Sign in"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <span>Sign in</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
    </main>
  );
}
