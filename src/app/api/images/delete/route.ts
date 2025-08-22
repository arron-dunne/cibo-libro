// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { auth } from "@/lib/auth";
// // import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"; // adjust if your path differs

// // --- R2 client: adapt these imports to match your lib/r2.ts ---
// import { deleteObject } from "@/lib/images/r2"; 
// // Expected signatures:
// //   async function deleteObjectFromR2(key: string): Promise<{ ok: boolean; status?: number }>
// //   export const R2_BUCKET_NAME: string

// // --- (Optional) DB access for stricter verification (recommended) ---
// // import { prisma } from "@/lib/db"; // adjust if you use a different prisma export path

// // Request payload:
// // - key: the exact object key to delete (versioned key)
// // - recipeId: (optional) verify the key matches the current recipe imageKey before deleting
// const BodySchema = z.object({
//   key: z.string().min(1, "Missing key").max(1024),
//   recipeId: z.string().optional(),
// });

// // Basic sanity checks to avoid path traversal or invalid keys
// function isKeySafe(key: string): boolean {
//   if (key.startsWith("/") || key.includes("..") || key.includes("//")) return false;
//   // keep it tight: only allow [a-z0-9/_ . -]
//   return /^[a-zA-Z0-9/_\-.]+$/.test(key);
// }

// // Verify the key is namespaced to the logged-in user, e.g. "user/<uid>/..."
// function keyBelongsToUser(key: string, userId: string): boolean {
//   // Adjust this if your namespace differs
//   const prefix = `user/${userId}/`;
//   return key.startsWith(prefix);
// }

// // Optional: if recipeId provided, ensure the DB says this recipe belongs to the user
// // and (strongest form) that the provided key is either the current recipe image,
// // or is inside the user's pending namespace for that recipe.
// async function assertRecipeOwnershipAndKey(
//   recipeId: string,
//   userId: string,
//   key: string
// ): Promise<void> {
//   const recipe = await prisma.recipe.findUnique({
//     where: { id: recipeId },
//     select: { ownerId: true, imageKey: true },
//   });

//   if (!recipe) {
//     throw new Error("Recipe not found");
//   }
//   if (recipe.ownerId !== userId) {
//     throw new Error("Not authorized to modify this recipe");
//   }

//   // Strongest policy: only allow deleting the key currently referenced by the recipe
//   // (or a known pending path you control). This prevents clients from submitting
//   // arbitrary keys even inside their namespace.
//   const isCurrentCover = recipe.imageKey && key === recipe.imageKey;
//   const isPendingForRecipe =
//     key.startsWith(`user/${userId}/recipe/${recipeId}/pending/`) ||
//     key.startsWith(`user/${userId}/drafts/${recipeId}/`);

//   if (!isCurrentCover && !isPendingForRecipe) {
//     throw new Error("Key does not match this recipe");
//   }
// }

// export async function POST(req: Request) {
//   try {
//     // 1) AuthN
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const userId = session.user.id as string;

//     // 2) Parse & validate body
//     const json = await req.json().catch(() => ({}));
//     const { key, recipeId } = BodySchema.parse(json);

//     // 3) Guardrails on key shape + namespace
//     if (!isKeySafe(key)) {
//       return NextResponse.json({ error: "Invalid key" }, { status: 400 });
//     }
//     if (!keyBelongsToUser(key, userId)) {
//       return NextResponse.json({ error: "Not authorized" }, { status: 403 });
//     }

//     // 4) (Optional but recommended) DB-level authorization by recipe
//     if (recipeId) {
//       await assertRecipeOwnershipAndKey(recipeId, userId, key);
//     }

//     // 5) Delete in R2 (idempotent)
//     const result = await deleteObject(key);
//     // Even if object missing, treat as success to keep delete idempotent
//     const ok = result?.ok ?? true;

//     return NextResponse.json({
//       ok,
//       key,
//       // You can include a "deleted: true" flag for clarity
//       deleted: true,
//     });
//   } catch (err: any) {
//     // Zod errors
//     if (err?.name === "ZodError") {
//       return NextResponse.json({ error: err.errors?.[0]?.message ?? "Bad request" }, { status: 400 });
//     }
//     const message =
//       typeof err?.message === "string" ? err.message : "Failed to delete image";
//     // Hide internal details from clients, but keep message user-comprehensible
//     return NextResponse.json({ error: message }, { status: 400 });
//   }
// }
