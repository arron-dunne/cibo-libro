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
    // ✅ await the searchParams Promise
    const params = await searchParams;

    async function doSignIn(formData: FormData) {
        "use server";

        const email = String(formData.get("email") || "").toLowerCase().trim();
        const password = String(formData.get("password") || "");
        const parsed = SigninSchema.safeParse({ email, password });
        if (!parsed.success) redirect("/signin?error=invalid");


        await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        });
    }

    return (
        <main className="mx-auto max-w-sm px-4 py-16">
            <h1 className="text-2xl font-semibold mb-6">Sign in</h1>

            {params?.created && (
                <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                    Account created. You can sign in now.
                </p>
            )}
            {params?.error && (
                <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {params.error === "invalid" ? "Invalid email or password" : "Sign-in failed"}
                </p>
            )}

            <form action={doSignIn} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input name="email" type="email" required className="w-full rounded-md border px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input name="password" type="password" required className="w-full rounded-md border px-3 py-2" />
                </div>
                <button className="w-full rounded-md bg-black text-white py-2">
                    Sign in
                </button>
            </form>

            <p className="text-sm mt-4">
                New here? <a href="/signup" className="underline">Create an account</a>
            </p>
        </main>
    );
}
