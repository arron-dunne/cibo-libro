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
      {/* Floating sign-in panel */}
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.18)] backdrop-blur sm:p-8">
        <div className="relative">
          {/* soft decorative blobs like the recipe card */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-200/60 blur-3xl" />
          <div className="pointer-events-none absolute bottom-6 right-0 h-24 w-24 rounded-full bg-rose-200/60 blur-2xl" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
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
            {params.error === "invalid"
              ? "Invalid email or password"
              : "Sign-in failed"}
          </div>
        )}

        <form action={doSignIn} className="mt-6 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a
              href="#"
              className="text-gray-500 underline underline-offset-4 hover:text-gray-700"
            >
              Forgot password
            </a>
          </div>

          <button
            className="w-full rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white shadow-[0_10px_22px_rgba(234,88,12,0.35)] transition hover:bg-orange-700"
          >
            Sign in
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
