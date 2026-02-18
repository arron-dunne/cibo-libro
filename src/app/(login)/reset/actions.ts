"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import argon2 from "argon2";

const PasswordSchema = z
  .object({
    token: z.hex().length(64),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    error: "password mismatch",
  });

export async function updatePassword(
  prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  
  // Parse the form data into structured data
  const raw = {
    token: String(formData.get("token") || ""),
    password: String(formData.get("password") || ""),
    confirm: String(formData.get("confirm") || ""),
  };

  const parsed = PasswordSchema.safeParse(raw);

  // Check passwords match
  if (!parsed.success) {
    if (
      parsed.error.issues.some((err) => err.message === "password mismatch")
    ) {
      return { error: "Passwords do not match" };
    }
    return { error: "An error occured" };
  }

  const { token, password } = parsed.data;

  // Check token exists
  const dbToken = await prisma.verificationToken.findUnique({
    where: { token: crypto.createHash("sha256").update(token).digest("hex") },
  });
  if (!dbToken) return { error: "An error occured" };

  // Check token is not expired
  const expiryDate = new Date(dbToken.expires);
  if (expiryDate < new Date(Date.now())) return { error: "An error occured" };

  // reset password
  await prisma.user.update({
    where: { email: dbToken.identifier },
    data: { passwordHash: await argon2.hash(password) },
  });

  // consume / delete token (and any others associated with this user)
  await prisma.verificationToken.deleteMany({
    where: { identifier: dbToken.identifier },
  });

  return { error: "Password updated" };
}
