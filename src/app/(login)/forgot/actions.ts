"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { generateResetToken } from "@/lib/auth/tokens";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resetPassword(formData: FormData): Promise<void> {

    const email = String(formData.get("email") || "");

    const user = await prisma.user.findUnique({ where: { email } });

    // dont show unknown user on the UI
    if (!user) return;

    const { token, hashed } = generateResetToken();

    // Store in DB
    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token: hashed,
            expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        },
    });

    // Build reset link
    const base = process.env.NEXT_PUBLIC_VERCEL_URL;
    const resetUrl = `${base}/reset?token=${token}`;

    // Send email
    await resend.emails.send({
        from: "Cibo Libro <support@mail.cibolibro.com>",
        to: email,
        subject: "Reset your Cibo Libro password",
        html: `
      <p>Hi there,</p>
      <p>You requested to reset your Cibo Libro password.</p>
      <p>Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn’t request this, you can safely ignore it.</p>
    `,
    });

    // return { ok: true };
}