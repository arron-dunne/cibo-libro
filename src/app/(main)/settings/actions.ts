"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "argon2";
import { verifyPassword } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export async function signOutAllDevices() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { sessionVersion: { increment: 1 } },
  });

  redirect("/login");
}

export async function changePassword(
  prevState: { error: string | null },
  formData: FormData,
) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "New passwords don't match" };
  }

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

  const valid = await verifyPassword(user.passwordHash, currentPassword);
  if (!valid) {
    return { error: "Incorrect current password" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hash(newPassword),
      sessionVersion: { increment: 1 }, // kill all JWT sessions everywhere
    },
  });

  return { error: null };
}
