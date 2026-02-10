"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { redirect } from "next/navigation";

const RegisterSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    error: "password mismatch",
  });

export async function handleRegister(formData: FormData) {
  const raw = {
    email: String(formData.get("email") || "")
      .toLowerCase()
      .trim(),
    password: String(formData.get("password") || ""),
    confirm: String(formData.get("confirm") || ""),
  };

  const parsed = RegisterSchema.safeParse(raw);

  if (!parsed.success) {
    if (
      parsed.error.issues.some((err) => err.message === "password mismatch")
    ) {
      redirect("/register?error=mismatch");
    }

    redirect("/register?error=invalid");
  }

  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/register?error=existing");
  }

  await prisma.user.create({
    data: { email, passwordHash: await argon2.hash(password) },
  });

  redirect("/login?created=1");
}
