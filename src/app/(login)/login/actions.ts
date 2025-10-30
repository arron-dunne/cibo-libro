"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function handleSignIn(formData: FormData) {

  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) redirect("/signin?error=invalid");

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (err) {
    
    if (err instanceof AuthError) {
      redirect("/login?error=invalid");
    }

    throw err;
  }
}