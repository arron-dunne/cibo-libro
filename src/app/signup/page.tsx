// src/app/signup/page.tsx
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { z } from "zod";
import { redirect } from "next/navigation";

export default function SignupPage() {
  async function signup(formData: FormData) {
    "use server";

    const raw = {
      email: String(formData.get("email") || "").toLowerCase().trim(),
      password: String(formData.get("password") || ""),
    };

    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      throw new Error("Invalid email or password");
    }

    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("An account with that email already exists");
    }

    await prisma.user.create({
      data: { email, passwordHash: await argon2.hash(password) },
    });

    redirect("/signin?created=1");
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">Create your account</h1>
      <form action={signup} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            minLength={8}
            required
            className="w-full rounded-md border px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use at least 8 characters
          </p>
        </div>
        <button className="w-full rounded-md bg-black text-white py-2">
          Sign up
        </button>
      </form>
      <p className="text-sm mt-4">
        Already have an account?{" "}
        <a href="/signin" className="underline">
          Sign in
        </a>
      </p>
    </main>
  );
}
