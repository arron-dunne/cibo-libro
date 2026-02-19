"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import crypto from "crypto";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";

const PasswordSchema = z
  .object({
    token: z.hex().length(64),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    error: "password mismatch",
  });

export async function updatePassword(formData: FormData): Promise<void> {
  const token = String(formData.get("token") || "");

  // Parse the form data into structured data
  const raw = {
    token,
    password: String(formData.get("password") || ""),
    confirm: String(formData.get("confirm") || ""),
  };

  const parsed = PasswordSchema.safeParse(raw);

  // Handle validation errors
  if (!parsed.success) {
    if (
      parsed.error.issues.some((err) => err.message === "password mismatch")
    ) {
      redirect(`/reset?token=${token}&error=password`);
    }
    redirect(`/reset?token=${token}&error=invalid`);
  }

  const { password } = parsed.data;

  // Check token exists
  const dbToken = await prisma.verificationToken.findUnique({
    where: { token: crypto.createHash("sha256").update(token).digest("hex") },
  });
  if (!dbToken) redirect("/reset?error=token");

  // Check token is not expired
  const expiryDate = new Date(dbToken.expires);
  if (expiryDate < new Date(Date.now())) redirect("/reset?error=token");

  // Reset password and invalidate existing sessions
  await prisma.user.update({
    where: { email: dbToken.identifier },
    data: {
      passwordHash: await argon2.hash(password),
      sessionVersion: { increment: 1 },
    },
  });

  // Consume / delete token (and any others associated with this user)
  await prisma.verificationToken.deleteMany({
    where: { identifier: dbToken.identifier },
  });

  redirect("/login?updated=1");
}
