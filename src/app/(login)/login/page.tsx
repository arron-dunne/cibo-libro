import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

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
    <div className="flex flex-col w-full place-items-center">

      {/* Logo above panel */}
      <div className="my-10">
        <Image
          src="/logo.png"
          alt="Cibo Libro"
          width={300}
          height={70}
          priority
        />
      </div>

      {/* Floating panel */}
      <section
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white/65 p-10 shadow-2xl backdrop-blur"
      >

        <header className="text-center">
          <h1 className="text-4xl font-semibold">
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
              className="block w-full rounded-2xl border border-white bg-white px-4 py-3
                         outline-none transition
                         focus:border-orange-500 focus:shadow-lg"
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
              className="block w-full rounded-2xl border border-white bg-white px-4 py-3
                         outline-none transition
                         focus:border-orange-500 focus:shadow-lg"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-gray-500 hover:underline transition hover:text-gray-700">
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
            className="w-full rounded-2xl bg-orange-600 px-4 py-3
                      text-white text-lg font-bold flex items-center justify-center gap-4
                      shadow-lg
                       transition hover:-translate-y-0.5 hover:bg-orange-700 active:translate-y-0"
            aria-label="Login"
          >
            Login <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            New here?
            <a href="/register" className="font-medium text-orange-700 underline">
              Create an account
            </a>
          </div>
        </form>
      </section>
    </div>
  );
}
