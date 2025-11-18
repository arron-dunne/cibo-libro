"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { verify, hash } from "argon2"

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.passwordHash) {
    throw new Error("User not found");
  }

  const valid = await verify(currentPassword, user.passwordHash);
  if (!valid) {
    throw new Error("Incorrect current password");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hash(newPassword),
      sessionVersion: { increment: 1 },   // kill all JWT sessions everywhere
    },
  });

  return true;
}
