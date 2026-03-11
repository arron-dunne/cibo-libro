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

export async function exportRecipes(
  format: "json" | "markdown",
): Promise<{ content: string; filename: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const recipes = await prisma.recipe.findMany({
    where: { ownerId: session.user.id },
    select: {
      title: true,
      description: true,
      type: true,
      prepMins: true,
      cookMins: true,
      servings: true,
      ingredients: true,
      steps: true,
      tags: true,
      note: true,
      sourceUrl: true,
      isFavourite: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date().toISOString().split("T")[0];

  if (format === "json") {
    return {
      content: JSON.stringify(recipes, null, 2),
      filename: `cibo-libro-recipes-${now}.json`,
    };
  }

  const sections = recipes.map((r) => {
    const lines: string[] = [];
    lines.push(`## ${r.title || "Untitled"}`);
    if (r.description) lines.push(`\n${r.description}`);

    const meta: string[] = [];
    if (r.prepMins != null) meta.push(`**Prep:** ${r.prepMins} mins`);
    if (r.cookMins != null) meta.push(`**Cook:** ${r.cookMins} mins`);
    if (r.servings != null) meta.push(`**Serves:** ${r.servings}`);
    if (meta.length) lines.push(`\n${meta.join(" | ")}`);

    if (r.ingredients.length) {
      lines.push(`\n### Ingredients`);
      r.ingredients.forEach((i) => lines.push(`- ${i}`));
    }

    if (r.steps.length) {
      lines.push(`\n### Steps`);
      r.steps.forEach((s, idx) => lines.push(`${idx + 1}. ${s}`));
    }

    if (r.note) lines.push(`\n**Note:** ${r.note}`);
    if (r.tags.length) lines.push(`\n**Tags:** ${r.tags.join(", ")}`);
    if (r.sourceUrl) lines.push(`\n**Source:** ${r.sourceUrl}`);

    return lines.join("\n");
  });

  return {
    content: `# My Cibo Libro Recipes\n\nExported on ${now}\n\n---\n\n${sections.join("\n\n---\n\n")}`,
    filename: `cibo-libro-recipes-${now}.md`,
  };
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
