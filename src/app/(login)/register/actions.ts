"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { redirect } from "next/navigation";

const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});


export async function handleRegister(formData: FormData) {

  const raw = {
    email: String(formData.get("email") || "").toLowerCase().trim(),
    password: String(formData.get("password") || ""),
  };

  const parsed = RegisterSchema.safeParse(raw);
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

  redirect("/login?created=1");
}